import React from "react";
import { inject, observer } from "mobx-react";
import { reaction, toJS, autorun, IReactionDisposer } from "mobx";
import { useState, useEffect } from "react";
import produce from "immer";
import { Button, Input, InputNumber, message } from "antd";
import { NewOrderRule } from "./NewOrderRule";
import { InputButtonSet } from "./InputButtonSet";
import utils from "utils";
import api from "services";

import classNames from "classnames/bind";
import styles from "./index.module.scss";
const cx = classNames.bind(styles);

export interface OnePriceNewOrderFormProps {}

export interface OnePriceNewOrderFormState {
  form: {
    positionType: string;
    direction: "-1" | "1";
    marginValue: number;
    leverage: string | "";
    takeProfit: string | "";
    stopLoss: string | "";
  };
  validation: {
    minStopLossStep: number | null;
    minTakeProfitStep: number | null;
    minMarginValue: number | null;
    maxMarginValue: number | null;
    marginValueStep: number;
    sellStep: number;
  };
  effectDisposer: Set<IReactionDisposer>;
}

const preciseNumber = input => {
  return Number(input.toPrecision(15));
};

const directionOptionMap = {
  "1": { "zh-cn": "作多", },
  "-1": { "zh-cn": "作空", },
};
@inject("product")
@observer
export class OnePriceNewOrderForm extends React.Component<
OnePriceNewOrderFormProps,
OnePriceNewOrderFormState
> {
  state = {
    form: {
      positionType: "T+0",
      direction: "1",
      marginValue: 0,
      leverage: "",
      takeProfit: "",
      stopLoss: "",
    },
    validation: {
      minStopLossStep: null,
      minTakeProfitStep: null,
      minMarginValue: null,
      maxMarginValue: null,
      marginValueStep: 100,
      sellStep: 0.01,
      sellDigits: Math.log10(1 / 0.01),
    },
    effectDisposers: new Set(),
  };
  componentDidMount() {
    const effectDisposer = autorun(() => {
      const currentSymbol = this.props.product.currentSymbol;
      this.initValidationState();
      this.initFormState();
    });
    this.state.effectDisposers.add(effectDisposer);
  }
  componentWillUnmount() {
    this.state.effectDisposers.forEach((disposer: IReactionDisposer) =>
      disposer()
    );
  }
  initFormState = () => {
    const {
      symbol_display = {},
      product_details = {},
    } = this.props.product.currentSymbol;
    const { min_margin_value, } = symbol_display;

    this.setState(
      produce(draft => {
        draft.form.positionType = "T+0";
        draft.form.direction = "1";
        draft.form.marginValue = Number(min_margin_value);
        draft.form.leverage = "";
        draft.form.stopLoss = "";
        draft.form.takeProfit = "";
      })
    );
  };
  initValidationState = () => {
    const {
      symbol_display = {},
      product_details = {},
    } = this.props.product.currentSymbol;
    const { sell, } = product_details;
    const {
      min_margin_value,
      max_margin_value,
      stop_loss_point,
      take_profit_point,
    } = symbol_display;
    const minStopLossStep = Number(stop_loss_point / 100) * Number(sell);
    const minTakeProfitStep = Number(take_profit_point / 100) * Number(sell);
    this.setState(
      produce(draft => {
        draft.validation.minStopLossStep = minStopLossStep;
        draft.validation.minTakeProfitStep = minTakeProfitStep;
        draft.validation.minMarginValue = min_margin_value;
        draft.validation.maxMarginValue = max_margin_value;
      })
    );
  };
  handlePositionTypeChange = (e, value) => {
    this.initFormState(); // 持仓类型改变时要重置表单
    this.setState(
      produce(draft => {
        draft.form.positionType = value;
      })
    );
  };
  handleDirectionOptionChange = (e, value) => {
    this.setState(
      produce(draft => {
        draft.form.direction = value;
      })
    );
  };
  handleMarginValueChange = value => {
    this.setState(
      produce(draft => {
        draft.form.marginValue = Number(value);
      })
    );
  };
  handleMarginValueIncrement = () => {
    const { maxMarginValue, marginValueStep, } = this.state.validation;
    const nextValue = this.state.form.marginValue + marginValueStep;
    if (nextValue > maxMarginValue) return;
    this.setState(
      produce(draft => {
        draft.form.marginValue = nextValue;
      })
    );
  };
  handleMarginValueDecrement = () => {
    const { minMarginValue, marginValueStep, } = this.state.validation;
    const nextValue = this.state.form.marginValue - marginValueStep;
    if (nextValue < minMarginValue) return;
    this.setState(
      produce(draft => {
        draft.form.marginValue = nextValue;
      })
    );
  };
  handleTakeProfitChange = val => {
    this.setState(
      produce(draft => {
        draft.form.takeProfit = val;
      })
    );
  };
  handleStopLossChange = val => {
    this.setState(
      produce(draft => {
        draft.form.stopLoss = val;
      })
    );
  };

  handleTakeProfitAdjust = amount => {
    this.setState(
      produce(draft => {
        const val = preciseNumber(
          Number(draft.form.takeProfit) + Number(amount)
        );
        draft.form.takeProfit = String(val);
      })
    );
  };
  handleStopLossAdjust = amount => {
    this.setState(
      produce(draft => {
        const val = preciseNumber(Number(draft.form.stopLoss) + Number(amount));
        draft.form.stopLoss = String(val);
      })
    );
  };

  handleLeverageChange = (e, value) => {
    this.setState(
      produce(draft => {
        draft.form.leverage = value;
      })
    );
  };
  validateTakeProfit = (takeProfit, minTakeProfitStep, sell, direction) => {
    if (direction === "1" && takeProfit < sell + minTakeProfitStep) {
      throw new Error("作多止盈价不合法");
    } else if (direction === "-1" && takeProfit > sell - minTakeProfitStep) {
      throw new Error("作空止盈价不合法");
    }
  };
  validateStopLoss = (stopLoss, minStopLossStep, sell, direction) => {
    if (direction === "1" && stopLoss > sell - minStopLossStep) {
      throw new Error("作多止损价不合法");
    } else if (direction === "-1" && stopLoss < sell + minStopLossStep) {
      throw new Error("作空止损价不合法");
    }
  };
  calculateOrderAmount = () => {
    const { marginValue, leverage, } = this.state.form;
    const totalAmount = Number(leverage) * Number(marginValue);
    return totalAmount;
  };
  calculateOrderLots = () => {
    const {
      symbol_display = {},
      product_details = {},
    } = this.props.product.currentSymbol;
    const { marginValue, leverage, } = this.state.form;
    const { sell, } = product_details;
    const { contract_size, } = symbol_display;
    const amountPerLot = Number(sell) * Number(contract_size);
    const lots = Math.floor(
      (Number(marginValue) * Number(leverage)) / Number(amountPerLot)
    );
    return lots;
  };

  handleSubmit = async () => {
    const {
      symbol_display = {},
      product_details = {},
      id,
    } = this.props.product.currentSymbol;
    const { sell, } = product_details;
    const {
      marginValue,
      positionType,
      leverage,
      direction,
      stopLoss,
      takeProfit,
    } = this.state.form;
    const { minStopLossStep, minTakeProfitStep, } = this.state.validation;

    try {
      if (!direction || !leverage) throw new Error("请正确填写下单资料");
      if (takeProfit) {
        this.validateTakeProfit(takeProfit, minTakeProfitStep, sell, direction);
      }
      if (stopLoss) {
        this.validateStopLoss(stopLoss, minStopLossStep, sell, direction);
      }

      const orderAction =
        direction === "1" ? "0" : direction === "-1" ? "1" : null;
      const lots = this.calculateOrderLots();
      // TODO: 港股没有 lots 与 trading_volume，但 api 会验证
      const payload = {
        symbol: id,
        open_price: sell,
        position_type: positionType,
        margin_value: marginValue,
        lots,
        trading_volume: lots,
        leverage,
        action: orderAction,
        stopLoss,
        takeProfit,
      };
      const res = await api.market.createOrder(payload);
      message.success("下单成功");
    } catch (err) {
      const content = err.message;
      message.error(content);
    }
  };
  render() {
    const {
      symbol_display = {},
      product_details = {},
    } = this.props.product.currentSymbol;
    const { sellStep, } = this.state.validation;
    const { leverage: symbol_display_leverage, position_type, } = symbol_display;
    const positionTypeOption = position_type ? position_type : [];
    const directionOption =
      this.state.form.positionType === "T+0" ? ["-1", "1"] : ["1"];
    const leverageOption = symbol_display_leverage
      ? symbol_display_leverage.split(",")
      : [];
    const orderAmount = this.calculateOrderAmount();
    const orderLots = this.calculateOrderLots();

    return (
      <div className={cx("form")}>
        <div className={cx("form-item")} data-name="position-type">
          <div className={cx("label")}>持仓类型</div>
          <div className={cx("control")}>
            {positionTypeOption.map(each => {
              const { positionType, } = this.state.form;
              const isActive = positionType === each;
              return (
                <OptionButton
                  isActive={isActive}
                  onClick={e => this.handlePositionTypeChange(e, each)}
                >
                  {each}
                </OptionButton>
              );
            })}
          </div>
        </div>
        <div className={cx("form-item")} data-name="direction">
          <div className={cx("label")}>方向</div>
          <div className={cx("control")}>
            {directionOption.map(each => {
              const directionDisplayName = directionOptionMap[each]["zh-cn"];
              const { direction, } = this.state.form;
              const isActive = direction === each;
              return (
                <OptionButton
                  isActive={isActive}
                  onClick={e => this.handleDirectionOptionChange(e, each)}
                >
                  {directionDisplayName}
                </OptionButton>
              );
            })}
          </div>
        </div>
        <div className={cx("form-item")} data-name="margin-value">
          <div className={cx("label")}>操作资金</div>
          <div className={cx("control")}>
            <InputButtonSet
              onIncrement={this.handleMarginValueIncrement}
              onDecrement={this.handleMarginValueDecrement}
            >
              <InputNumber
                onChange={this.handleMarginValueChange}
                value={this.state.form.marginValue}
                min={this.state.validation.minMarginValue}
                max={this.state.validation.maxMarginValue}
              />
            </InputButtonSet>
          </div>
        </div>
        <div className={cx("form-item")} data-name="leverage">
          <div className={cx("label")}>杠杆倍数</div>
          <div className={cx("control")}>
            {leverageOption.map(each => {
              const { leverage, } = this.state.form;
              const isActive = leverage === each;
              return (
                <OptionButton
                  isActive={isActive}
                  onClick={e => this.handleLeverageChange(e, each)}
                >
                  {each}
                </OptionButton>
              );
            })}
          </div>
        </div>
        <div className={cx("form-item")}>
          <div className={cx("label")}>操盘资金</div>
          <div className={cx("control")}>{orderAmount}</div>
        </div>
        <div className={cx("form-item")}>
          <div className={cx("label")}>买入数量</div>
          <div className={cx("control")}>{orderLots}</div>
        </div>
        <div className={cx("form-item")} data-name="take-profit">
          <div className={cx("label")}>止盈价</div>
          <div className={cx("control")}>
            <InputButtonSet
              onIncrement={() => this.handleTakeProfitAdjust(+sellStep)}
              onDecrement={() => this.handleTakeProfitAdjust(-sellStep)}
            >
              <Input
                type="number"
                placeholder="未设置"
                value={this.state.form.takeProfit}
                onChange={e => this.handleTakeProfitChange(e.target.value)}
              />
            </InputButtonSet>
          </div>
        </div>
        <div className={cx("form-item")} data-name="stop-loss">
          <div className={cx("label")}>止损价</div>
          <div className={cx("control")}>
            <InputButtonSet
              onIncrement={() => this.handleStopLossAdjust(+sellStep)}
              onDecrement={() => this.handleStopLossAdjust(-sellStep)}
            >
              <Input
                type="number"
                placeholder="未设置"
                value={this.state.form.stopLoss}
                onChange={e => this.handleStopLossChange(e.target.value)}
              />
            </InputButtonSet>
          </div>
        </div>
        <div className={cx("form-item")}>
          <div className={cx("submit-button-wrap")}>
            <Button className="t4u-button-primary" onClick={this.handleSubmit}>
              下单
            </Button>
          </div>
        </div>
        <NewOrderRule />
      </div>
    );
  }
}
function OptionButton(props) {
  const { isActive, onClick, children, className, ...restProps } = props;
  const mergedClassName = cx(
    "option-button",
    {
      "option-button--active": isActive,
    },
    className
  );
  return (
    <div className={mergedClassName} onClick={onClick} {...restProps}>
      {children}
    </div>
  );
}
