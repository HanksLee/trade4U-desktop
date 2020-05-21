import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import {
  Col,
  Row,
  Tabs,
  Table,
  Spin,
  Modal,
  DatePicker
} from "antd";
import {
  StarFilled,
  createFromIconfontCN
} from "@ant-design/icons";
import WithRoute from "components/@shared/WithRoute";
import InfiniteScroll from "react-infinite-scroller";
import "./index.scss";
import SymbolEditor from "components/SymbolEditor";
import { inject, observer } from "mobx-react";
import ws from "utils/ws";
import utils from "utils";
import moment from "moment";
import { traderStatusMap } from "constant";
import cloneDeep from "lodash/cloneDeep";
import {
  STOCK_COLOR_MAP,
  STOCK_COLOR_GIF_MAP,
} from 'constant';
import TVChartContainer from './TVChartContainer';
import { toJS } from 'mobx';
import utils from 'utils';
import {
  MinusOutlined
} from '@ant-design/icons';

const { TabPane, } = Tabs;
const { RangePicker, } = DatePicker;

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1795058_4vgdb4lgh5.js",
});

const orderTabs = [
  {
    id: "in_transaction",
    name: "持仓",
  },
  {
    id: "pending",
    name: "挂单",
  },
  {
    id: "finish",
    name: "历史",
  }
];

/* eslint new-cap: "off" */
@WithRoute("/dashboard/symbol")
@inject("market", "common")
@observer
export default class extends BaseReact {
  private selfSymbolWSConnect = null;
  private orderWSConnect = null;
  timer: any = 0;
  delay = 200;
  prevent = false;
  wsConnect = null;
  buyTimers = [];
  sellTimers = [];

  state = {
    currentFilter: "全部",
    hasMore: false,
    orderTabKey: "in_transaction",
    symbolTabKey: "",
    openSymbolId: undefined,
    modalVisible: false,
    symbolTypeList: [],
    loading: false,
    historyFilter: {
      page: 1,
      page_size: 5,
    },
    orderMode: "add",
    foldTabs: false,
  };

  async componentDidMount() {
    (window as any).$market = this.props.common;

    this.getSelfSymbolList();
    this.getSymbolTypeList();
    this.getTradeList({
      params: {
        status: "in_transaction",
      },
    }, "in_transaction");
    this.connnetWebsocket();
  }

  componentWillUnmount() {
    if (this.selfSymbolWSConnect) {
      this.selfSymbolWSConnect.close();
      this.selfSymbolWSConnect = null;
    }

    if (this.orderWSConnect) {
      this.orderWSConnect.close();
      this.orderWSConnect = null;
    }
  };

  getSelfSymbolList = async () => {
    await this.props.market.getSelfSelectSymbolList();
    const {
      market: {
        selfSelectSymbolList,
        currentSymbol,
      },
    } = this.props;

    if (utils.isEmpty((currentSymbol))) {
      this.props.market.getCurrentSymbol(selfSelectSymbolList[0].symbol);
    }
  };

  connnetWebsocket = () => {
    // 建立自选个股 ws

    this.selfSymbolWSConnect = ws("self-select-symbol");
    this.selfSymbolWSConnect.onmessage = (event) => {
      const message = event.data;
      const data = JSON.parse(message).data;
      const { selfSelectSymbolList, currentSymbol, setCurrentSymbol, } = this.props.market;
      const newSelfSelectSymbolList = selfSelectSymbolList.map((item, index) => {
        const newItem = cloneDeep(item);
        if (
          newItem?.product_details?.symbol == data.symbol
          && Number(newItem?.product_details?.timestamp) < Number(data.timestamp)
        ) {
          const payload = {
            ...data,
            buy_change: (
              data.buy - newItem.product_details.buy > 0
                ? 'up'
                : data.buy - newItem.product_details.buy == 0
                  ? 'balance'
                  : 'down'
            ),
            sell_change: (
              data.sell - newItem.product_details.sell > 0
                ? 'up'
                : data.sell - newItem.product_details.sell == 0
                  ? 'balance'
                  : 'down'
            ),
            sell_open_change: (
              data.sell - data.close > 0
                ? 'up'
                : data.sell - newItem.close == 0
                  ? 'balance'
                  : 'down'
            ),
            new_price_change: (
              data.new_price - newItem.product_details.new_price > 0
                ? 'up'
                : data.new_price - newItem.product_details.new_price == 0
                  ? 'balance'
                  : 'down'
            ),
            change_change: (
              data.change - newItem.product_details.change > 0
                ? 'up'
                : data.change - newItem.product_details.change == 0
                  ? 'balance'
                  : 'down'
            ),
            chg_change: (
              data.change - newItem.product_details.change > 0
                ? 'up'
                : data.change - newItem.product_details.change == 0
                  ? 'balance'
                  : 'down'
            ),
          };

          // 同步到 currentSymbol

          if (
            currentSymbol?.product_details?.symbol == data.symbol
            && Number(currentSymbol?.product_details?.timestamp) < Number(data.timestamp)
          ) {
            const symbol = {
              ...currentSymbol,
              product_details: {
                ...currentSymbol.product_details,
                ...payload,
              },
            };

            setCurrentSymbol(symbol);
          }

          newItem.product_details = {
            ...newItem.product_details,
            ...payload,
          };
        }

        return newItem;
      });
      this.props.market.setSelfSelectSymbolList(newSelfSelectSymbolList);
    };

    this.orderWSConnect = ws("order");
    const { setTradeList, } = this.props.market;

    this.orderWSConnect.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      // console.log('msg', msg);
      // console.log('tradeList', this.props.market?.tradeList);


      if (msg.type == "meta_fund") {
        this.updateTradeInfo({
          balance: msg.data.balance,
          margin: msg.data.margin,
        });
      } else {
        let list = cloneDeep(this.props.market?.tradeList);
        let futureList = cloneDeep(this.props.market?.futureTradeList);

        if (msg.type == "order_open") {
          list = [msg.data, ...list];
        } else if (msg.type == "order_profit") {
          list = list.map((item) => {
            if (item.order_number == msg.data.order_number && msg.data.timestamp > item.timestamp) {
              item = msg.data;
            }
            return item;
          });
        } else if (msg.type == "order_close") {
          list = list.filter(
            (item) => item.order_number != msg.data.order_number
          );
        } else if (msg.type == "pending_order_close") {
          futureList = futureList.filter(
            (item) => item.order_number != msg.data.order_number
          );
        }
        setTradeList(list);
        setTradeList(futureList, "future");
      }
    };
  };

  getTradeList = async (config, type) => {
    this.setState({
      loading: true,
    }, async () => {
      try {
        const res = await this.$api.market.getTradeInfo();


        await this.props.market.getTradeList(config, type);
        let tradeInfo = {
          balance: res.data.balance,
          // equity: 1014404.86, // 净值
          margin: res.data.margin, // 预付款
          // free_margin: 1014399.22, // 可用预付款
          // margin_level: 18017848.22, // 预付款比例
        };
        this.updateTradeInfo(tradeInfo);
      } catch (e) {
        this.$msg.error(e);
      }

      this.setState({ loading: false, });
    });
  };

  getTradeHistoryList = async config => {
    this.setState({
      loading: true,
    }, async () => {
      try {
        this.props.market.getTradeHistoryList(config);
      } catch (e) {
        this.$msg.error(e);
      }
    });

    this.setState({
      loading: false,
    });
  };

  getSymbolTypeList = async () => {
    const res = await this.$api.market.getSymbolTypeList();

    if (res.status == 200) {
      this.setState({
        symbolTypeList: [
          {
            id: 0,
            symbol_type_name: "全部",
          },
          ...res.data.results
        ],
      });
    }
  };

  onDateRangeChanged = async (dateRange) => {
    this.setState({
      dateRange,
      historyFilter: {
        ...this.state.historyFilter,
        close_start_time: dateRange ? dateRange[0].unix() : undefined,
        close_end_time: dateRange ? dateRange[1].unix() : undefined,
      },
    }, () => {
      this.getTradeHistoryList({
        params: this.state.historyFilter,
      });
    });
  };


  onFilterChange = async (id) => {
    this.setState({
      currentFilter: id,
    }, async () => {
      // @todo 调取 symbol-list 接口
      await this.props.market.getSelfSelectSymbolList({
        params: {
          type__name: id == "全部" ? undefined : id,
        },
      });
    });
  };

  renderFilter = () => {
    const { currentFilter, symbolTypeList, } = this.state;

    return (
      <div className={"symbol-filter"}>
        {
          symbolTypeList.map(item => {
            return <div className={`symbol-filter-item ${item.symbol_type_name == currentFilter ? "active" : ""}`}
              onClick={() => this.onFilterChange(item.symbol_type_name)}>
              {item.symbol_type_name}
            </div>;
          })
        }
      </div>
    );
  };

  getCurrentSymbol = (item) => {
    this.props.market.getCurrentSymbol(item.symbol);
  };

  onSingleClick = (item) => {
    const { openSymbolId, } = this.state;

    this.getCurrentSymbol(item);

    this.timer = setTimeout(() => {
      if (!this.prevent) {
        this.setState({
          openSymbolId: item.id == openSymbolId ? undefined : item.id,
        });
      }
    }, this.delay);
  };

  onDoubleClick = (item?) => {
    clearTimeout(this.timer);

    this.prevent = true;
    if (item) {
      this.props.market.getCurrentSymbol(item.symbol);
    }
    this.props.market.toggleOrderModalVisible();
    this.setState({
      // modalVisible: true,
      orderMode: "add",
    }, () => {
      setTimeout(() => {
        this.prevent = false;
      }, this.delay);
    });
  };

  renderSymbolTable = () => {
    const { hasMore, openSymbolId, } = this.state;
    const columns = [{
      title: "品种",
      dataIndex: "market",
    }, {
      title: "股票代号",
      dataIndex: "code",
    }, {
      title: "点差",
      dataIndex: "dots",
    }, {
      title: "卖出",
      dataIndex: "sell",
    }, {
      title: "买入",
      dataIndex: "buy",
    }];

    const {
      selfSelectSymbolList,
      currentSymbol,
    } = this.props.market;
    const {
      common: {
        stockColorMode,
      },
    } = this.props;
    const itemWidth = Math.floor(24 / columns.length);

    return (
      <div className={"symbol-sidebar custom-table"}>
        <Row className={"custom-table-title"} type={"flex"} justify={"space-between"}>
          {
            columns.map(item => {
              return (
                <Col span={itemWidth}>
                  {item.title}
                </Col>
              );
            })
          }
        </Row>
        <InfiniteScroll
          pageStart={0}
          className={"custom-table-body"}
          loadMore={this.loadMore}
          hasMore={hasMore}
          loader={<div className="custom-table-loadmore" key={0}>
            <Spin/>
          </div>}
        >
          {
            selfSelectSymbolList.map(item => {
              return <Row style={{
                // backgroundColor: item.symbol == currentSymbol.id ? 'rgba(0, 0, 0, .4)' : undefined,
              }} className={"custom-table-item"} key={item.id} type={"flex"} justify={"space-between"}
              onClick={(e) => {
                this.onSingleClick(item);
              }}
              onDoubleClick={(e) => {
                this.onDoubleClick();
              }}
              >
                <Col span={24}>
                  <Row type={"flex"} justify={"space-between"}>
                    <Col span={itemWidth}>
                      <span style={{
                        color: "#838D9E",
                      }}>{item?.symbol_display?.name}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span style={{
                        color: "#FFF",
                      }}>{item?.product_details?.symbol}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span style={{
                        color: "#838D9E",
                      }}>{item?.symbol_display?.spread}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span className={`
                      ${
                        STOCK_COLOR_MAP[stockColorMode][item?.product_details?.sell_change || 'balance']
                        // utils.getStockChangeClass(item?.product_details?.sell_change, stockColorMode)
                        }
                        ${
                        STOCK_COLOR_GIF_MAP[stockColorMode][item?.product_details?.sell_change || 'balance']
                        }
                      self-select-sell-block`}>{item?.product_details?.sell}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span className={`
                        ${
      STOCK_COLOR_MAP[stockColorMode][item?.product_details?.buy_change || 'balance']
  // utils.getStockChangeClass(item?.product_details?.buy_change, stockColorMode)
      }
                              ${
                        STOCK_COLOR_GIF_MAP[stockColorMode][item?.product_details?.buy_change || 'balance']
                        }
                        self-select-buy-block`}
                      >{item?.product_details?.buy}</span>
                    </Col>
                  </Row>
                </Col>
                <Col className={`symbol-sidebar-info ${openSymbolId == item.id ? "active" : ""}`} span={24}>
                  <Row type={"flex"} justify={"space-around"}>
                    <Col span={12}>
                      <div className={"symbol-item-info"}>
                        <span>小数点位</span>
                        <span>{item?.symbol_display?.decimals_place}</span>
                      </div>
                      <div className={"symbol-item-info"}>
                        <span>点差</span>
                        <span>浮动</span>
                      </div>
                      <div className={"symbol-item-info"}>
                        <span>获利货币</span>
                        <span>{item?.symbol_display?.profit_currency_display}</span>
                      </div>

                      <div className={"symbol-item-info"}>
                        <span>最大交易手数</span>
                        <span>{item?.symbol_display?.max_lots}</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={"symbol-item-info"}>
                        <span>合约大小</span>
                        <span>{item?.symbol_display?.contract_size}</span>
                      </div>
                      <div className={"symbol-item-info"}>
                        <span>预付款货币</span>
                        <span>{item?.symbol_display?.margin_currency_display}</span>
                      </div>
                      <div className={"symbol-item-info"}>
                        <span>交易数步长</span>
                        <span>{
                          (item?.symbol_display?.lots_step)?.toFixed(2)
                        }</span>
                      </div>
                      <div className={"symbol-item-info"}>
                        <span>最小交易手数</span>
                        <span>{item?.symbol_display?.min_lots}</span>
                      </div>
                    </Col>
                  </Row>
                </Col>
              </Row>;
            })
          }
        </InfiniteScroll>
      </div>
    );
  };

  loadMore = () => {
    // console.log(1111);
  };

  updateTradeInfo = (tradeInfo) => {
    let payload: any = {};
    const { tradeList, setTradeInfo, } = this.props.market;
    if (utils.isEmpty(tradeInfo)) {
      payload = {
        balance: this.props.market.tradeInfo.balance,
        margin: this.props.market.tradeInfo.margin,
      };
    } else {
      payload = {
        balance: tradeInfo.balance,
        margin: tradeInfo.margin,
      };
    }

    payload.profit = tradeList.reduce((acc, cur) => acc + cur.profit, 0);
    payload.equity = tradeList.reduce((acc, cur) => acc + cur.profit, 0) + payload.balance;
    payload.free_margin = payload.equity - payload.margin;
    payload.margin_level = payload.equity / payload.margin;

    setTradeInfo(payload);
  };

  togggleFavorite = async () => {
    const {
      market: {
        currentSymbol,
        setCurrentSymbol,
      },
    } = this.props;

    try {
      if (currentSymbol.is_self_select == 1) {
        const res = await this.$api.market.deleteSelfSelectSymbolList({
          data: {
            symbol: [currentSymbol?.id],
          },
        });

        if (res.status == 204) {
          this.$msg.success(`${currentSymbol?.symbol_display?.name}成功移除自选`);
          setCurrentSymbol({
            is_self_select: 0,
          });
          this.getSelfSymbolList();
        }
      } else {
        const res = await this.$api.market.addSelfSelectSymbolList({
          symbol: [currentSymbol?.id],
        });

        if (res.status == 201) {
          this.$msg.success(`${currentSymbol?.symbol_display?.name}成功添加到自选`);
          setCurrentSymbol({
            is_self_select: 1,
          });
          this.getSelfSymbolList();
        }
      }
    } catch (err) {
      this.$msg.error(err?.response?.data);
    }
  };

  renderOrderTable = (type) => {
    if (type == "历史") {
      const {
        market: {
          tradeHistoryListMeta,
          tradeHistoryList,
        },
      } = this.props;
      const columns = [
        {
          title: "品种",
          dataIndex: "symbol_name",
          width: 80,
        },
        {
          title: "品种代码",
          dataIndex: "product_code",
          width: 100,
        },
        {
          title: "开仓价",
          dataIndex: "open_price",
          width: 80,
        },
        {
          title: "平仓价",
          dataIndex: "close_price",
          width: 80,
        },
        {
          title: "交易手数",
          dataIndex: "lots",
          width: 80,
        },
        {
          title: "止盈/止损",
          width: 80,
          render: (text, record) => {
            return <div>
              <p className={"p-up"}>{record.take_profit}</p>
              <p className={"p-down"}>{record.stop_loss}</p>
            </div>;
          },
        },
        {
          title: "订单号",
          dataIndex: "order_number",
          width: 80,
        },
        {
          title: "库存费",
          dataIndex: "swaps",
          width: 80,
        },
        {
          title: "税费",
          dataIndex: "taxes",
          width: 80,
        },
        {
          title: "手续费",
          dataIndex: "fee",
          width: 80,
        },
        {
          title: "盈亏",
          dataIndex: "profit",
          width: 80,
        },
        {
          title: "开仓时间",
          dataIndex: "create_time",
          width: 80,
          render: (text, record) => moment(text * 1000).format("YYYY.MM.DD HH:mm:ss"),
        },
        {
          title: "平仓时间",
          dataIndex: "close_time",
          width: 120,
          fixed: 'right',
          render: (text, record) => moment(text * 1000).format("YYYY.MM.DD HH:mm:ss"),
        }

      ];

      const orderInfo = [
        {
          title: "盈利",
          value: tradeHistoryListMeta?.data?.profit?.toFixed(2),
        },
        {
          title: "亏损",
          value: tradeHistoryListMeta?.data?.loss?.toFixed(2),
        },
        {
          title: "结余",
          value: tradeHistoryListMeta?.data?.balance?.toFixed(2),
        }
      ];

      const columnsWidth = columns.reduce(function (total, cur) {
        return total + cur.width;
      }, 0);

      return <div>
        <div className="symbol-order-info">
          <Row type={"flex"} justify={"start"} style={{
            marginBottom: 16,
            marginLeft: 16,
            textAlign: "left",
          }}>
            <Col span={24}>
              <RangePicker onChange={this.onDateRangeChanged}/>
            </Col>
          </Row>
          <Row type={"flex"} justify={"space-between"}>
            {
              orderInfo.map(item => <Col span={24 / orderInfo.length}>
                <p>
                  <strong>
                    {item.title}
                  </strong>
                </p>
                <p>{item.value}</p>
              </Col>)
            }
          </Row>
        </div>
        <Table
          loading={this.state.loading}
          pagination={{
            size: "small",
            pageSize: 5,
            current: tradeHistoryListMeta?.page,
            total: tradeHistoryListMeta?.total,
          }}
          onChange={(pagination, filters, sorter) => {
            const payload: any = {
              ...this.state.historyFilter,
              page: pagination.current,
              page_size: pagination.pageSize,
            };

            this.getTradeHistoryList({
              params: payload,
            });
          }}
          columns={columns}
          scroll={{
            x: columnsWidth,
            y: 260,
          }}
          dataSource={tradeHistoryList}
        >

        </Table>
      </div>;
    }

    const columns = [
      {
        title: "品种",
        dataIndex: "symbol_name",
        width: 80,
      },
      {
        title: "品种代码",
        dataIndex: "product_code",
        width: 100,
      },
      {
        title: "开仓价",
        dataIndex: "open_price",
      },
      {
        title: "交易手数",
        dataIndex: "lots",
      },
      {
        title: "订单号",
        dataIndex: "order_number",
      },
      {
        title: "止盈/止损",
        render: (text, record) => {
          return (
            <div>
              <p>{record?.take_profit || "-"}</p>
              <p>{record?.stop_loss || "-"}</p>
            </div>
          );
        },
      },
      {
        title: "库存费",
        dataIndex: "swaps",
      },
      {
        title: "税费",
        dataIndex: "taxes",
      },
      {
        title: "手续费",
        dataIndex: "fee",
      },
      {
        title: "盈亏",
        dataIndex: "profit",
        render: (text, record) => <span
          className={`
          ${utils.getStockChangeClass(text, this.props.common.stockColorMode)}
          `}>{text > 0 ? `+${text}` : text}</span>,

      },
      {
        title: "开仓时间",
        dataIndex: "create_time",
        render: (text, record) => moment(text * 1000).format("YYYY.MM.DD HH:mm:ss"),
      }
    ];
    const {
      market: {
        tradeList,
        futureTradeList,
        tradeInfo,
        setCurrentOrder,
      },
    } = this.props;

    // balance: res.data.balance,
    //   // equity: 1014404.86, // 净值
    //   margin: res.data.margin, // 预付款
    // // free_margin: 1014399.22, // 可用预付款
    // // margin_level: 18017848.22, // 预付款比例

    const orderInfo = [
      {
        title: "持仓盈亏",
        value: tradeInfo?.profit?.toFixed(2),
      },
      {
        title: "结余",
        value: tradeInfo?.balance?.toFixed(2),
      },
      {
        title: "净值",
        value: tradeInfo?.equity?.toFixed(2),
      },
      {
        title: "预付款",
        value: tradeInfo?.margin?.toFixed(2),
      },
      {
        title: "可用预付款",
        value: tradeInfo?.free_margin?.toFixed(2),
      },
      {
        title: "预付款比率(%)",
        value: tradeInfo?.margin_level == 0 ? "-" : (tradeInfo?.margin_level * 100)?.toFixed(2),
      }
    ];

    return <div>
      <div className={"symbol-order-info"}>
        <Row type={"flex"} justify={"space-between"}>
          {
            orderInfo.map(item => <Col span={24 / orderInfo.length}>
              <p>
                <strong>
                  {item.title}
                </strong>
              </p>
              <p>{item.value}</p>
            </Col>)
          }
        </Row>
      </div>
      <Table
        rowClassName={"symbol-order-table-row"}
        scroll={{ y: 260, }}
        onRow={record => {
          return {
            onDoubleClick: async evt => {
              setCurrentOrder(record, true);
              // console.log("currentOrder", toJS(record));

              await this.props.market.getCurrentSymbol(record?.symbol);
              this.props.market.toggleOrderModalVisible();

              this.setState({
                // modalVisible: true,
                orderMode: "update",
              });
            },
          };
        }}
        loading={this.state.loading}
        pagination={
          {
            size: "small",
            pageSize: this.state.orderTabKey == "in_transaction"
              ? tradeList.length
              : futureTradeList.length,

          }
        }
        columns={columns}
        dataSource={
          this.state.orderTabKey == "in_transaction"
            ? tradeList
            : futureTradeList
        }
      />
    </div>;
  };

  toggleFoldTabs = () => {
    this.setState((prevState) => ({
      foldTabs: !prevState.foldTabs,
    }));
  }

  render() {
    const { orderTabKey, } = this.state;
    const {
      market: {
        currentSymbol,
      },
      common: {
        stockColorMode,
      },
    } = this.props;

    // const sell = currentSymbol?.product_details?.sell;
    const sell_change = currentSymbol?.product_details?.sell_change;
    const sell_open_change = currentSymbol?.product_details?.sell_open_change;

    const change = currentSymbol?.product_details?.change;
    const change_change = currentSymbol?.product_details?.change_change;
    const chg = currentSymbol?.product_details?.chg;
    const chg_change = currentSymbol?.product_details?.chg_change;

    // console.log('sell_change', sell_change);


    const OrderTabs = orderTabs.map(item =>
      <TabPane tab={item.name} key={item.id}>
        {this.renderOrderTable(item.name)}
      </TabPane>
    );

    return <div className={"symbol-page"}>
      <div className={"symbol-left"}>
        <Tabs
          tabBarStyle={{
            padding: "0 10px",
          }}
          defaultActiveKey={"1"}>
          <TabPane tab={"自选"} key={"1"}>
            {this.renderFilter()}
            {this.renderSymbolTable()}
          </TabPane>
        </Tabs>
      </div>
      <div className={"symbol-right"}>
        <Row style={{ height: '100%', }}>
          <Col span={24} className={"symbol-chart"}>
            <Row className={"symbol-chart-info"} type={"flex"} justify={"space-between"} align={"middle"}>
              <Col>
                <div className={"symbol-chart-title"}>
                  <span>{currentSymbol?.symbol_display?.name}</span>
                  <span className={`
                  ${
  STOCK_COLOR_MAP[stockColorMode][sell_open_change || 'balance']
}
                  `}>
                    {
                      currentSymbol?.product_details?.sell
                    }
                    {
                      sell_open_change == 'up'
                        ? <IconFont type={"icon-arrow-up"}/>
                        : sell_open_change == 'down'
                          ? <IconFont type={"icon-arrow-down"}/>
                          : <MinusOutlined />
                    }
                  </span>
                  <span className={`
                  ${
  STOCK_COLOR_MAP[stockColorMode][sell_open_change || 'balance']
}
                  `}>
                    {
                      change > 0 ? "+" + change : change
                    }
                  </span>
                  <span className={`
                  ${
  STOCK_COLOR_MAP[stockColorMode][sell_open_change || 'balance']

}
                  `}>
                    {
                      chg > 0 ? "+" + chg : chg
                    }
                    %
                  </span>
                  <span className={"symbol-chart-title-status"}>
                    {
                      traderStatusMap[currentSymbol?.trader_status]
                    }
                  </span>
                </div>
              </Col>
              <Col>
                <div className={"symbol-order-favorite"}>
                  <span className={"symbol-order-btn"} onClick={() => this.onDoubleClick()}>下单</span>
                  <StarFilled onClick={this.togggleFavorite} style={{
                    color: currentSymbol?.is_self_select == 1 ? "#f2e205" : "white",
                    cursor: "pointer",
                  }}/>
                </div>
              </Col>
            </Row>
            <div className={this.state.foldTabs ? 'unfold-chart' : 'fold-chart'}>
              {
                currentSymbol.id && (
                  <TVChartContainer
                    symbol={currentSymbol.id ? String(currentSymbol.id) : currentSymbol.id}
                  />
                )
              }
            </div>
          </Col>
          <Col span={24} className={`symbol-order ${this.state.foldTabs ? 'fold-tabs' : 'unfold-tabs'}`}>
            <Tabs
              tabBarExtraContent={<span onClick={this.toggleFoldTabs} className="rect-dock" />}
              tabBarStyle={{
                padding: "0 10px",
              }}
              activeKey={orderTabKey} onTabClick={(key, evt) => {
              // console.log("key", key);
                this.setState({
                  orderTabKey: key,
                }, () => {
                  if (key != "finish") {
                    this.getTradeList({
                      params: {
                        status: key,
                      },
                    }, key);
                  } else {
                    this.getTradeHistoryList({
                      params: {
                        page: 1,
                        page_size: 5,
                      },
                    });
                  }
                });
              }
              }>
              {OrderTabs}
            </Tabs>
          </Col>
        </Row>
      </div>
      <Modal
        className={"symbol-modal"}
        mask={false}
        width={670}
        style={{
          backgroundColor: "#373e47",
        }}
        bodyStyle={{
          backgroundColor: "#373e47",
        }}
        visible={this.props.market.orderModalVisible}
        onCancel={() => {
          this.props.market.toggleOrderModalVisible();
        }}
        closable={false}
        footer={null}
      >
        <SymbolEditor getTradeHistoryList={() => {
          this.getTradeHistoryList(
            {
              params: this.state.historyFilter,
            }
          );
        }} getTradeList={() => {
          this.getTradeList({
            params: {
              status: orderTabKey,
            },
          }, orderTabKey);
        }} orderMode={this.state.orderMode}/>
      </Modal>
    </div>;
  }
}
