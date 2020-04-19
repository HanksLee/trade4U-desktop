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
export default class extends BaseReact {
  timer = 0;
  delay = 200;
  prevent = false;

  state = {
    currentFilter: 0,
    hasMore: false,
    orderTabKey: '持仓',
    symbolTabKey: '',
    openSymbolId: undefined,
    modalVisible: false,
  };

  onFilterChange = async (id) => {
    this.setState({
      currentFilter: id,
    }, async () => {
      // @todo 调取 symbol-list 接口
    });
  };

  renderFilter = () => {
    const { currentFilter, } = this.state;

    return (
      <div className={"symbol-filter"}>
        {
          symbolMarkets.map(item => {
            return <div className={`symbol-filter-item ${item.id == currentFilter ? "active" : ""}`}
              onClick={() => this.onFilterChange(item.id)}>
              {item.title}
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


    const data = [{
      id: 1,
      market: "虎骨1",
      code: 12312,
      dots: 123,
      buy: 123,
      sell: 232,
    }, {
      id: 2,
      market: "虎骨2",
      code: 12312,
      dots: 123,
      buy: 123,
      sell: 232,
    }];

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
            data.map(item => {
              return <Row className={"custom-table-item"} key={item.id} type={"flex"} justify={"space-between"} onClick={(e)=> {
                this.onSingleClick(item);
              }}
              onDoubleClick={(e) => {
                this.onDoubleClick(item);
              }}
              >
                <Col span={24}>
                  <Row>
                    <Col span={itemWidth}>
                      <span style={{
                        color: "#838D9E",
                      }}>{item.market}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span style={{
                        color: "#FFF",
                      }}>{item.code}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span style={{
                        color: "#838D9E",
                      }}>{item.dots}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span className={"p-up"}>{item.buy}</span>
                    </Col>
                    <Col span={itemWidth}>
                      <span className={"p-down"}>{item.sell}</span>
                    </Col>
                  </Row>
                </Col>
                <Col className={`symbol-sidebar-info ${openSymbolId == item.id ? 'active' : ''}`} span={24}>
                  <Row type={'flex'} justify={'space-around'}>
                    <Col span={12}>
                      <div className={'symbol-item-info'} >
                        <span>最高</span>
                        <span>123.00</span>
                      </div>

                      <div className={'symbol-item-info'} >
                        <span>今开</span>
                        <span>123.00</span>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className={'symbol-item-info'} >
                        <span>最低</span>
                        <span>123.00</span>
                      </div>

                      <div className={'symbol-item-info'} >
                        <span>昨收</span>
                        <span>123.00</span>
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

  renderOrderTable = (type) => {
    if (type == '历史') {
      return <div>历史</div>;
    }


    const columns = [
      {
        title: '品种',
        dataIndex: 'symbol',
      },
      {
        title: '品种代码',
      },
      {
        title: '开仓价',
      },
      {
        title: '交易手数',
      },
      {
        title: '订单号',
      },
      {
        title: '库存费',
      },
      {
        title: '税费',
      },
      {
        title: '手续费',
      },
      {
        title: '盈亏',
      },
      {
        title: '开仓时间',
      }
    ];
    const dataSource = [];

    return <Table
      columns={columns}
      dataSource={dataSource}
    />;
  };


  render() {
    const { orderTabKey, } = this.state;

    return <div className={"symbol-page"}>
      <Row>
        <Col className={"symbol-left"} span={8}>
          <Tabs defaultActiveKey={"1"}>
            <TabPane tab={"自选"} key={"1"}>
              {this.renderFilter()}
              {this.renderSymbolTable()}
            </TabPane>
          </Tabs>
        </Col>
        <Col className={"symbol-right"} span={16}>
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
        visible={this.state.modalVisible}
        onCancel={() => {
          this.setState({
            modalVisible: false,
          });
        }}
        closable={false}
        footer={null}
      >
        <Row>
          <Col className={'symbol-modal-chart'} span={12}>
            chart
          </Col>
          <Col className={'symbol-modal-form'} span={12}>

          </Col>
        </Row>
      </Modal>
    </div>;
  }
}
