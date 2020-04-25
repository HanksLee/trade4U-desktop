import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import {
  Col,
  Row,
  Tabs,
  Table,
  Spin,
  Icon,
  Modal
} from "antd";
import { symbolMarkets } from "constant";
import WithRoute from 'components/@shared/WithRoute';
import InfiniteScroll from "react-infinite-scroller";
import "./index.scss";
import SymbolEditor from 'components/SymbolEditor';
import { inject, observer } from "mobx-react";
import ws from 'utils/ws';
import utils from 'utils';
import moment from 'moment';
import { toJS } from 'mobx';
const { TabPane, } = Tabs;

const orderTabs = [
  {
    name: '持仓',
  },
  {
    name: '挂单',
  },
  {
    name: '历史',
  }
];

/* eslint new-cap: "off" */
@WithRoute('/dashboard/symbol')
@inject("market")
@observer
export default class extends BaseReact {
  timer = 0;
  delay = 200;
  prevent = false;
  wsConnect = null;
  buyTimers = [];
  sellTimers = [];

  state = {
    currentFilter: '全部',
    hasMore: false,
    orderTabKey: '持仓',
    symbolTabKey: '',
    openSymbolId: undefined,
    modalVisible: false,
    symbolTypeList: [],
    loading: false,
  };

  async componentDidMount() {
    this.props.market.getSelfSelectSymbolList();
    this.getSymbolTypeList();
    this.getTradeList({
      params: {
        status: 'in_transaction',
      },
    });
    this.connnetWebsocket();
  }

  componentWillUnmount = () => {
    if (this.wsConnect) {
      this.wsConnect.close();
    }
  }

  connnetWebsocket = () => {
    this.wsConnect = ws('self-select-symbol');
    this.wsConnect.onmessage = (event) => {
      const message = event.data;
      const data = JSON.parse(message).data;
      const { selfSelectSymbolList, } = this.props.market;
      const newSelfSelectSymbolList = selfSelectSymbolList.map((item, index) => {
        // if (item.symbol_display.product_display.code === data.symbol &&
        //   Number(item.product_details.timestamp) < Number(data.timestamp)) {
        //   const buyItemDom = $$($$('.self-select-buy-block')[index])
        //   const sellItemDom = $$($$('.self-select-sell-block')[index])
        //   if (data.buy > item.product_details.buy) {
        //     clearTimeout(this.buyTimers[index])
        //     buyItemDom.addClass('increase')
        //     this.buyTimers[index] = setTimeout(() => {
        //       buyItemDom && buyItemDom.hasClass('increase') && buyItemDom.removeClass('increase')
        //     }, 2000);
        //   } else if (data.buy < item.product_details.buy) {
        //     clearTimeout(this.buyTimers[index])
        //     buyItemDom.addClass('decrease')
        //     this.buyTimers[index] = setTimeout(() => {
        //       buyItemDom && buyItemDom.hasClass('decrease') && buyItemDom.removeClass('decrease')
        //     }, 2000);
        //   }
        //
        //   if (data.sell > item.product_details.sell) {
        //     clearTimeout(this.sellTimers[index])
        //     sellItemDom.addClass('increase')
        //     this.sellTimers[index] = setTimeout(() => {
        //       sellItemDom && sellItemDom.hasClass('increase') && sellItemDom.removeClass('increase')
        //     }, 2000);
        //   } else if (data.sell < item.product_details.sell) {
        //     clearTimeout(this.sellTimers[index])
        //     sellItemDom.addClass('decrease')
        //     this.sellTimers[index] = setTimeout(() => {
        //       sellItemDom && sellItemDom.hasClass('decrease') && sellItemDom.removeClass('decrease')
        //     }, 2000);
        //   }
        //
        //   return {
        //     ...item,
        //     product_details: {
        //       ...item.product_details,
        //       ...data,
        //     }
        //   }
        // }
        //
        return {
          ...item,
          product_details: {
            ...item.product_details,
            ...data,
          },
        };
      });
      this.props.market.setSelfSelectSymbolList(newSelfSelectSymbolList);
    };
  }

  getTradeList = async (config) => {
    this.setState({
      loading: true,
    }, async () => {
      try {
        const res = await this.$api.market.getTradeInfo();
        let tradeInfo = {
          balance: res.data.balance,
          // equity: 1014404.86, // 净值
          margin: res.data.margin, // 预付款
          // free_margin: 1014399.22, // 可用预付款
          // margin_level: 18017848.22, // 预付款比例
        };

        this.props.market.getTradeList(config);
        this.updateTradeInfo(tradeInfo);
      } catch(e) {
        this.$msg.error(e);
      }

      this.setState({ loading: false, });
    });
  }

  getSymbolTypeList = async () => {
    const res = await this.$api.market.getSymbolTypeList();

    if (res.status == 200) {
      this.setState({
        symbolTypeList: [
          {
            id: 0,
            symbol_type_name: '全部',
          },
          ...res.data.results
        ],
      });
    }
  }

  onFilterChange = async (id) => {
    this.setState({
      currentFilter: id,
    }, async () => {
      // @todo 调取 symbol-list 接口
      await this.props.market.getSelfSelectSymbolList({
        params: {
          type__name: id == '全部' ? undefined : id,
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

  onSingleClick = (item) => {
    const { openSymbolId, } = this.state;

    this.timer = setTimeout(() => {
      if (!this.prevent) {
        this.setState({
          openSymbolId: item.id == openSymbolId ? undefined : item.id,
        });
      }
    }, this.delay);
  }

  onDoubleClick = (item) => {
    clearTimeout(this.timer);
    this.prevent = true;
    this.setState({
      modalVisible: true,
    }, () => {
      setTimeout(() => {
        this.prevent = false;
      }, this.delay);
    });
  }

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
      title: "买入",
      dataIndex: "buy",
    }, {
      title: "卖出",
      dataIndex: "sell",
    }];

    const {
      selfSelectSymbolList,
    } = this.props.market;
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
              return <Row className={"custom-table-item"} key={item.id} type={"flex"} justify={"space-between"} onClick={(e)=> {
                this.onSingleClick(item);
              }}
              onDoubleClick={(e) => {
                this.onDoubleClick(item);
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
                      <span className={"p-up self-select-buy-block"}>{item?.product_details?.buy}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span className={"p-down self-select-sell-block"}>{item?.product_details?.sell}</span>
                    </Col>
                  </Row>
                </Col>
                <Col className={`symbol-sidebar-info ${openSymbolId == item.id ? 'active' : ''}`} span={24}>
                  <Row type={'flex'} justify={'space-around'}>
                    <Col span={12}>
                      <div className={'symbol-item-info'} >
                        <span>小数点位</span>
                        <span>{item?.symbol_display?.decimals_place}</span>
                      </div>
                      <div className={'symbol-item-info'} >
                        <span>点差</span>
                        <span>浮动</span>
                      </div>
                      <div className={'symbol-item-info'} >
                        <span>获利货币</span>
                        <span>{item?.symbol_display?.profit_currency_display}</span>
                      </div>

                      <div className={'symbol-item-info'} >
                        <span>最大交易量</span>
                        <span>{item?.symbol_display?.max_trading_volume}</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={'symbol-item-info'} >
                        <span>合约大小</span>
                        <span>{item?.symbol_display?.contract_size}</span>
                      </div>
                      <div className={'symbol-item-info'} >
                        <span>预付款货币</span>
                        <span>{item?.symbol_display?.margin_currency_display}</span>
                      </div>
                      <div className={'symbol-item-info'} >
                        <span>最小交易量</span>
                        <span>{item?.symbol_display?.min_trading_volume}</span>
                      </div>

                      <div className={'symbol-item-info'} >
                        <span>交易量步长</span>
                        <span>{
                          (item?.symbol_display?.volume_step / item?.symbol_display?.contract_size)?.toFixed(2)
                        }</span>
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

    payload.equity =
      tradeList.reduce((acc, cur) => acc + cur.profit, 0) + payload.balance;
    payload.free_margin = payload.equity - payload.margin;
    payload.margin_level = payload.equity / payload.margin;

    setTradeInfo(payload);
  };

  renderOrderTable = (type) => {
    if (type == '历史') {
      return <div>历史</div>;
    }

    const columns = [
      {
        title: '品种',
        dataIndex: 'symbol_name',
      },
      {
        title: '品种代码',
        dataIndex: 'product_code',
      },
      {
        title: '开仓价',
        dataIndex: 'open_price',
      },
      {
        title: '交易手数',
        dataIndex: 'lots',
      },
      {
        title: '订单号',
        dataIndex: 'order_number',
      },
      {
        title: '止盈/止损',
        render: (text, record) => {
          return (
            <div>
              <p>{record?.take_profit || '-'}</p>
              <p>{record?.stop_loss || '-'}</p>
            </div>
          );
        },
      },
      {
        title: '库存费',
        dataIndex: 'swaps',
      },
      {
        title: '税费',
        dataIndex: 'taxes',
      },
      {
        title: '手续费',
        dataIndex: 'fee',
      },
      {
        title: '盈亏',
        dataIndex: 'profit',
      },
      {
        title: '开仓时间',
        dataIndex: 'create_time',
        render: (text, record) => moment(text).format('YYYY.MM.DD HH:mm:ss'),
      }
    ];
    const {
      market: {
        tradeList,
      },
    } = this.props;

    const orderInfo = [
      {
        title: '持仓盈亏',
        value: '',
      }
    ];

    return <div>
      <div>
        <Row></Row>
      </div>
      <Table
        loading={this.state.loading}
        pagination={
          {
            size: 'small',
            pageSize: 5,
          }
        }
        columns={columns}
        dataSource={tradeList}
      />;
    </div>;
  };


  render() {
    const { orderTabKey, } = this.state;

    return <div className={"symbol-page"}>
      <Row>
        <Col className={"symbol-left"} span={10}>
          <Tabs defaultActiveKey={"1"}>
            <TabPane tab={"自选"} key={"1"}>
              {this.renderFilter()}
              {this.renderSymbolTable()}
            </TabPane>
          </Tabs>
        </Col>
        <Col className={"symbol-right"} span={14}>
          <Row>
            <Col span={24} className={"symbol-chart"}>
              <div className={'symbol-chart-title'}>
                <span>AAPL</span>
                <span className={`p-up`}>
                  256.2
                  <Icon type="arrow-up" />
                </span>
                <span className={`p-up`}>
                  +10.22
                </span>
                <span className={`p-up`}>
                  +4.44%
                </span>
                <span className={'symbol-chart-title-status'}>
                  交易中
                </span>
              </div>
            </Col>
            <Col span={24} className={"symbol-order"}>
              <Tabs activeKey={orderTabKey} onTabClick={(key, evt) => {
                // console.log("key", key);
                this.setState({
                  orderTabKey: key,
                });
              }
              }>
                {
                  orderTabs.map(item =>
                    <TabPane tab={item.name} key={item.name}>
                      {this.renderOrderTable(item.name)}
                    </TabPane>
                  )
                }
              </Tabs>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        className={'symbol-modal'}
        mask={false}
        width={970}
        style={{
          backgroundColor: '#373e47',
        }}
        bodyStyle={{
          backgroundColor: '#373e47',
        }}
        visible={this.state.modalVisible }
        onCancel={() => {
          this.setState({
            modalVisible: false,
          });
        }}
        closable={false}
        footer={null}
      >
        <SymbolEditor />
      </Modal>
    </div>;
  }
}
