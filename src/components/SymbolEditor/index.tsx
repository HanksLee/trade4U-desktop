import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import {
  Form,
  Input,
  Select,
  Modal,
  Row,
  Col,
  Button,
  InputNumber,
  Icon
} from "antd";
import { inject, observer } from "mobx-react";
import {
  actionsType,
  tradeTypeOptions,
  tradeFutureTypeOptions
} from "constant";
import { toJS } from "mobx";
import "./index.scss";
import {
  CheckCircleFilled,
  CaretUpFilled,
  CaretDownFilled,
  UpOutlined,
  DownOutlined
} from "@ant-design/icons";
import closeSVG from "assets/img/ic_close.svg";

const FormItem = Form.Item;
const Option = Select.Option;

// @ts-ignore
@Form.create()
@inject("common")
@observer
export default class SymbolEditor extends BaseReact {
  state = {
    orderOperateType: "update",
    quoted_price: this.props.common.getKeyConfig("quoted_price"),
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentWillUnmount() {}

  renderActionButtons = () => {
    const { orderMode, } = this.props;
    const {
      currentSymbol,
      setCurrentOrder,
      currentShowOrder,
    } = this.props.market;
    const { orderOperateType, quoted_price, } = this.state;
    const actionSwitch = currentSymbol?.symbol_display?.action;
    const useBuyBtn = actionSwitch.includes("0");
    const useSellBtn = actionSwitch.includes("1");

    // 是否是持仓订单
    if (orderMode == "update") {
      if (orderOperateType == "update") {
        return (
          <div
            className={"bg-down custom-btn"}
            onClick={async () => {
              try {
                const payload = {
                  open_price: currentShowOrder.open_price,
                  take_profit: currentShowOrder.take_profit,
                  stop_loss: currentShowOrder.stop_loss,
                  lots: currentShowOrder.lots,
                };
                const res = await this.$api.market.updateOrder(
                  currentShowOrder?.order_number,
                  payload
                );

                if (res.status == 200) {
                  this.$msg.success(`订单修改成功~`);
                  // 修改成功后，重新拉取列表接口
                  this.props.getTradeList();
                  this.props.market.toggleOrderModalVisible();
                }
              } catch (err) {
                this.$msg.error(err?.response?.data?.message);
              }
            }}
          >
            修改
          </div>
        );
      } else if (orderOperateType == "close") {
        return (
          <div
            className={"bg-orange custom-btn"}
            onClick={async () => {
              try {
                const res = await this.$api.market.closeOrder(
                  currentShowOrder?.order_number
                );

                if (res.status == 200) {
                  this.$msg.success("订单平仓成功~");
                  this.props.getTradeList();
                  this.props.market.toggleOrderModalVisible();
                }
              } catch (err) {
                this.$msg.error(err?.response?.data?.message);
              }
            }}
          >
            平仓
          </div>
        );
      } else if (orderOperateType == "delete") {
        return (
          <div
            className={"bg-orange custom-btn"}
            onClick={async () => {
              try {
                const res = await this.$api.market.closeOrder(
                  currentShowOrder.order_number
                );

                if (res.status == 200) {
                  this.$msg.success("挂单删除成功~");
                  this.props.getTradeList();
                  this.props.market.toggleOrderModalVisible();
                }
              } catch (err) {
                this.$msg.error(err?.response?.data?.message);
              }
            }}
          >
            删除
          </div>
        );
      }
    }

    if (
      orderMode == "add" &&
      currentSymbol?.symbol_display?.action?.length > 0
    ) {
      // const useBuyBtn = currentSymbol?.symbol_display?.action?.includes("0");
      // const useSellBtn = currentSymbol?.symbol_display?.action?.includes("1");

      if (currentShowOrder?.actionMode == "future") {
        // 如果是挂单交易
        return (
          <div
            className={"custom-btn order-future-btn"}
            onClick={this.onSubmit}
          >
            下单
          </div>
        );
      }

      // 如果创建订单
      return (
        <Row
          type={"flex"}
          justify={quoted_price === "two_price" ? "space-between" : "center"}
        >
          {
            <Col span={11}>
              <div
                className={`custom-btn bg-down ${!useSellBtn ? "bg-grey" : ""}`}
                onClick={() => {
                  if (!useSellBtn) return;

                  setCurrentOrder({
                    action: 1,
                  });
                  this.onSubmit();
                }}
              >
                卖出
              </div>
            </Col>
          }
          {quoted_price === "two_price" && (
            <Col span={11}>
              <div
                className={`custom-btn bg-up ${!useBuyBtn ? "bg-grey" : ""}`}
                onClick={() => {
                  if (!useBuyBtn) return;

                  setCurrentOrder({
                    action: 0,
                  });

                  this.onSubmit();
                }}
              >
                买入
              </div>
            </Col>
          )}
        </Row>
      );
    }

    return null;
  };

  onSubmit = async () => {
    const {
      orderMode,
      market: { currentSymbol, currentOrder, },
    } = this.props;

    const lots = currentOrder?.lots || currentSymbol?.symbol_display?.min_lots;
    const decimals_place = currentSymbol?.symbol_display?.decimals_place;

    const payload: any = {
      trading_volume: (
        Number(lots) * Number(currentSymbol?.symbol_display?.contract_size)
      ).toFixed(decimals_place),
      lots,
      symbol: currentSymbol.id,
      take_profit: currentOrder?.take_profit,
      stop_loss: currentOrder?.stop_loss,
      action: currentOrder.action,
    };

    try {
      if (orderMode == "add") {
        if (currentOrder.action == 0) {
          payload.open_price = currentSymbol?.product_details?.buy;
        } else if (currentOrder.action == 1) {
          payload.open_price = currentSymbol?.product_details?.sell;
        } else {
          payload.open_price = currentOrder?.open_price;
        }

        const res = await this.$api.market.createOrder(payload);

        if (res.status == 201) {
          const modal = Modal.info({
            icon: <CheckCircleFilled />,
            content: (
              <div>
                <h2>买入完成</h2>
              </div>
            ),
            onOk() {
              modal.destroy();
            },
          });

          setTimeout(() => {
            this.props.market.setCurrentOrder({}, true);
            this.props.market.toggleOrderModalVisible();
          }, 300);
        }
      } else {
      }
    } catch (err) {
      // this.$msg.error(err?.response?.data?.message);
    }
  };

  onTradeTypeChanged = mode => {
    const { setCurrentOrder, } = this.props.market;

    // 选择交易类型下拉框后，如果是立即执行，则置为做多 0，否则置为 buy limit 2；

    setCurrentOrder({
      action: mode == "instance" ? 0 : 2,
    });
  };

  get orderOperateOptions() {
    const { currentOrder, } = this.props.market;
    let options = [
      {
        id: "update",
        name: "修改",
      }
    ];

    if (currentOrder?.action == 0 || currentOrder?.action == 1) {
      // 对于持仓订单，存在平仓操作
      options.push({
        id: "close",
        name: "平仓",
      });
    } else {
      // 对于挂单订单，存在删除操作
      options.push({
        id: "delete",
        name: "删除",
      });
    }

    return options;
  }

  render() {
    const { orderMode, } = this.props;
    const {
      currentShowOrder,
      currentSymbol,
      setCurrentOrder,
    } = this.props.market;
    const price_step = 1 / 10 ** currentSymbol?.symbol_display?.decimals_place;
    const decimals_place = currentSymbol?.symbol_display?.decimals_place;
    const actionSwitch = currentSymbol?.symbol_display?.action;
    const useBuyBtn = actionSwitch.includes("0");
    const useSellBtn = actionSwitch.includes("1");
    const { quoted_price, } = this.state;
    return (
      <div className={"editor symbol-editor"}>
        <div
          className={"symbol-editor-close"}
          onClick={() => {
            this.props.market.setCurrentOrder({}, true);
            this.props.market.toggleOrderModalVisible();
          }}
        >
          <img src={closeSVG} alt="" />
        </div>
        <Row>
          {/*<Col className={"symbol-editor-chart"} span={12}>*/}
          {/*chart*/}
          {/*</Col>*/}
          <Col
            style={{
              paddingLeft: 6,
            }}
            className={"symbol-editor-form"}
            span={24}
          >
            <Form layout={"vertical"}>
              <FormItem label={"交易品种"}>
                <Input
                  placeholder={"请输入交易品种"}
                  onChange={evt => {
                    // @todo
                  }}
                  value={currentSymbol?.symbol_display?.name}
                  disabled={true}
                />
              </FormItem>
              <FormItem label={"交易类型"}>
                <Select
                  disabled={orderMode == "update"}
                  placeholder={"请选择交易类型"}
                  onChange={val => {
                    this.onTradeTypeChanged(val);
                  }}
                  value={currentShowOrder?.actionMode}
                >
                  {tradeTypeOptions.map(item => {
                    return <Option key={item.id}>{item.name}</Option>;
                  })}
                </Select>
              </FormItem>
              {currentShowOrder?.actionMode == "future" && (
                <FormItem label={"类型"}>
                  <Select
                    disabled={orderMode == "update"}
                    placeholder={"请选择类型"}
                    onChange={val => {
                      setCurrentOrder({
                        action: +val,
                      });
                    }}
                    value={
                      tradeFutureTypeOptions[`${currentShowOrder.action - 2}`]
                        .name
                    }
                  >
                    {tradeFutureTypeOptions.map(item => {
                      return (
                        <Option
                          disabled={
                            item.id == "2" || item.id == "4"
                              ? !useBuyBtn
                              : !useSellBtn
                          }
                          key={item.id}
                        >
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </FormItem>
              )}
              {orderMode == "update" && (
                <FormItem label={"类型"}>
                  <Select
                    value={this.state.orderOperateType}
                    placeholder={"请选择类型"}
                    onChange={val => {
                      this.setState({
                        orderOperateType: val,
                      });
                    }}
                  >
                    {this.orderOperateOptions.map(item => {
                      return <Option key={item.id}>{item.name}</Option>;
                    })}
                  </Select>
                </FormItem>
              )}
              <Row type={"flex"} justify={"space-between"}>
                {currentShowOrder?.actionMode == "future" && (
                  <Col span={11}>
                    <FormItem label={"价格"} className={"input-number"}>
                      <Input
                        value={currentShowOrder?.open_price}
                        min={0.01}
                        type={"number"}
                        onChange={evt => {
                          setCurrentOrder({
                            open_price: evt.target.value,
                          });
                        }}
                      />
                      <section className={"input-number-up-down"}>
                        <UpOutlined
                          onClick={() => {
                            if (!currentShowOrder.open_price) {
                              setCurrentOrder({
                                open_price: +(
                                  currentSymbol?.product_details?.sell +
                                  price_step
                                ).toFixed(decimals_place),
                              });
                            } else {
                              setCurrentOrder({
                                open_price: +(
                                  currentShowOrder.open_price + price_step
                                ).toFixed(decimals_place),
                              });
                            }
                          }}
                        />
                        <DownOutlined
                          onClick={() => {
                            if (!currentShowOrder.open_price) {
                              setCurrentOrder({
                                open_price: +(
                                  currentSymbol?.product_details?.sell -
                                  price_step
                                ).toFixed(decimals_place),
                              });
                            } else {
                              setCurrentOrder({
                                open_price: +(
                                  currentShowOrder.open_price - price_step
                                ).toFixed(decimals_place),
                              });
                            }
                          }}
                        />
                      </section>
                    </FormItem>
                  </Col>
                )}
                <Col span={11}>
                  <FormItem className={"input-number"} label={"数量"}>
                    <Input
                      value={currentShowOrder?.lots || undefined}
                      step={currentSymbol?.symbol_display?.lots_step}
                      min={currentSymbol?.symbol_display?.min_lots}
                      type={"number"}
                      onChange={evt => {
                        setCurrentOrder({
                          lots: +evt.target.value,
                        });
                      }}
                    />
                    <section className={"input-number-up-down"}>
                      <UpOutlined
                        onClick={() => {
                          if (!currentShowOrder.lots) {
                            setCurrentOrder({
                              lots: currentSymbol?.symbol_display?.min_lots,
                            });
                          } else {
                            setCurrentOrder({
                              lots: (
                                Number(currentShowOrder.lots) +
                                Number(currentSymbol?.symbol_display?.lots_step)
                              ).toFixed(decimals_place),
                            });
                          }
                        }}
                      />
                      <DownOutlined
                        onClick={() => {
                          if (
                            !currentShowOrder.lots ||
                            currentShowOrder.lots -
                              currentSymbol?.symbol_display?.lots_step <
                              currentSymbol?.symbol_display?.min_lots
                          ) {
                            return;
                          } else {
                            setCurrentOrder({
                              lots: (
                                Number(currentShowOrder.lots) -
                                Number(currentSymbol?.symbol_display?.lots_step)
                              ).toFixed(decimals_place),
                            });
                          }
                        }}
                      />
                    </section>
                  </FormItem>
                </Col>
              </Row>
              <Row type={"flex"} justify={"space-between"}>
                <Col span={11}>
                  <FormItem label={"止损"} className={"input-number"}>
                    <Input
                      value={currentShowOrder?.stop_loss}
                      type={"number"}
                      onChange={evt => {
                        setCurrentOrder({
                          stop_loss: +evt.target.value,
                        });
                      }}
                    />
                    <section className={"input-number-up-down"}>
                      <UpOutlined
                        onClick={() => {
                          if (!currentShowOrder.stop_loss) {
                            setCurrentOrder({
                              stop_loss: +(
                                currentSymbol?.product_details?.sell +
                                price_step
                              ).toFixed(decimals_place),
                            });
                          } else {
                            setCurrentOrder({
                              stop_loss: +(
                                currentShowOrder.stop_loss + price_step
                              ).toFixed(decimals_place),
                            });
                          }
                        }}
                      />
                      <DownOutlined
                        onClick={() => {
                          if (!currentShowOrder.stop_loss) {
                            setCurrentOrder({
                              stop_loss: +(
                                currentSymbol?.product_details?.sell -
                                price_step
                              ).toFixed(decimals_place),
                            });
                          } else {
                            setCurrentOrder({
                              stop_loss: +(
                                currentShowOrder.stop_loss - price_step
                              ).toFixed(decimals_place),
                            });
                          }
                        }}
                      />
                    </section>
                  </FormItem>
                </Col>
                <Col span={11}>
                  <FormItem label={"止盈"} className={"input-number"}>
                    <Input
                      value={currentShowOrder?.take_profit}
                      type={"number"}
                      onChange={evt => {
                        setCurrentOrder({
                          take_profit: +evt.target.value,
                        });
                      }}
                    />
                    <section className={"input-number-up-down"}>
                      <UpOutlined
                        onClick={() => {
                          if (!currentShowOrder.take_profit) {
                            setCurrentOrder({
                              take_profit: +(
                                currentSymbol?.product_details?.buy + price_step
                              ).toFixed(decimals_place),
                            });
                          } else {
                            setCurrentOrder({
                              take_profit: +(
                                currentShowOrder.take_profit + price_step
                              ).toFixed(decimals_place),
                            });
                          }
                        }}
                      />
                      <DownOutlined
                        onClick={() => {
                          if (!currentShowOrder.take_profit) {
                            setCurrentOrder({
                              take_profit: +(
                                currentSymbol?.product_details?.buy - price_step
                              ).toFixed(decimals_place),
                            });
                          } else {
                            setCurrentOrder({
                              take_profit: +(
                                currentShowOrder.take_profit - price_step
                              ).toFixed(decimals_place),
                            });
                          }
                        }}
                      />
                    </section>
                  </FormItem>
                </Col>
              </Row>
              <div className={"symbol-editor-price"}>
                <span className={"p-down"}>
                  {currentSymbol?.product_details?.sell}
                </span>
                {quoted_price === "two_price" && (
                  <>
                    <span>/</span>
                    <span className={"p-up"}>
                      {currentSymbol?.product_details?.buy}
                    </span>
                  </>
                )}
              </div>
              {this.renderActionButtons()}
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}
