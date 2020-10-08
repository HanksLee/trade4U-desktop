import React from "react";
import { inject, observer } from "mobx-react";
import { reaction, toJS } from "mobx";
import { useState, useEffect } from "react";
import produce from "immer";
import { Button, Input, InputNumber } from "antd";
import { NewOrderRule } from "./NewOrderRule";
import utils from "utils";
import api from "services";

import classNames from "classnames/bind";
import styles from "./index.module.scss";
const cx = classNames.bind(styles);

export interface OnePriceNewOrderFormProps {}

export interface OnePriceNewOrderFormState {}
const toFixedNumber = (input, digits) => {
  return Number(Number(input).toFixed(digits));
};
const directionOptionMap = {
  "1": { "zh-cn": "作多", },
  "-1": { "zh-cn": "作空", },
};

@inject("other", "common", "symbol")
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
      leverage: null,
      takeProfit: null,
      stopLoss: null,
    },
    validation: {
      minStopLossStep: null,
      minTakeProfitStep: null,
      takeProfitTargetPriceMap: {},
      stopLossTargetPriceMap: {},
      minMarginValue: null,
      maxMarginValue: null,
      marginValueStep: 100,
      sellStep: 0.01,
    },
    currentSymbol: {},
  };
  componentDidMount() {
    this.fetchCurrentSymbol(37061);
  }
  fetchCurrentSymbol = async id => {
    const res = await api.market.getCurrentSymbol(id);
    this.setState({ currentSymbol: res.data, });
    this.initValidationState();
    this.initFormState();
  };
  initFormState = () => {
    const {
      symbol_display = {},
      product_details = {},
    } = this.state.currentSymbol;
    const { sell, } = product_details;
    const { min_margin_value, } = symbol_display;

    this.setState(
      produce(draft => {
        draft.form.marginValue = Number(min_margin_value);
        draft.form.stopLoss = null;
        draft.form.takeProfit = null;
        draft.form.direction = "1";
      })
    );
  };
  initValidationState = () => {
    const {
      symbol_display = {},
      product_details = {},
    } = this.state.currentSymbol;
    const { sell, } = product_details;
    const {
      min_margin_value,
      max_margin_value,
      stop_loss_point,
      take_profit_point,
    } = symbol_display;
    const minStopLossStep = Number(stop_loss_point / 100) * Number(sell);
    const minTakeProfitStep = Number(take_profit_point / 100) * Number(sell);
    // 1: 作多的止盈目标价，-1: 作空的止盈目标
    const takeProfitTargetPriceMap = {
      1: Number(sell) + minTakeProfitStep,
      "-1": Number(sell) - minTakeProfitStep,
    };
    // 1: 作多的止损目标价，-1: 作空的止损目标价
    const stopLossTargetPriceMap = {
      1: Number(sell) - minStopLossStep,
      "-1": Number(sell) + minStopLossStep,
    };
    this.setState(
      produce(draft => {
        draft.validation.minStopLossStep = minStopLossStep;
        draft.validation.minTakeProfitStep = minTakeProfitStep;
        draft.validation.stopLossTargetPriceMap = stopLossTargetPriceMap;
        draft.validation.takeProfitTargetPriceMap = takeProfitTargetPriceMap;
        draft.validation.minMarginValue = min_margin_value;
        draft.validation.maxMarginValue = max_margin_value;
      })
    );
  };
  handlePositionTypeChange = (e, value) => {
    this.initFormState();
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
        draft.form.takeProfit = toFixedNumber(val, 2);
      })
    );
  };
  handleTakeProfitAdjust = (sign = 1) => {
    const { sellStep, } = this.state.validation;
    this.setState(
      produce(draft => {
        const val = Number(draft.form.takeProfit) + Number(sellStep) * sign;
        draft.form.takeProfit = toFixedNumber(val, 2);
      })
    );
  };
  handleStopLossChange = val => {
    this.setState(
      produce(draft => {
        draft.form.stopLoss = toFixedNumber(val, 2);
      })
    );
  };

  handleStopLossAdjust = (sign = 1) => {
    const { sellStep, } = this.state.validation;
    this.setState(
      produce(draft => {
        const val = Number(draft.form.stopLoss) + Number(sellStep) * sign;
        draft.form.stopLoss = toFixedNumber(val, 2);
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
  handleSubmit = () => {
    console.log("this.state.form :>> ", this.state.form);
    console.log("this.state.validation :>> ", this.state.validation);
    const {
      symbol_display = {},
      product_details = {},
    } = this.state.currentSymbol;
    const { direction, stopLoss, takeProfit, } = this.state.form;
    const { sell, } = product_details;
    const { minStopLossStep, minTakeProfitStep, } = this.state.validation;

    try {
      if (takeProfit) {
        this.validateTakeProfit(takeProfit, minTakeProfitStep, sell, direction);
      }
      if (stopLoss) {
        this.validateStopLoss(stopLoss, minStopLossStep, sell, direction);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  render() {
    // console.log("this.state.currentSymbol :>> ", this.state.currentSymbol);
    const {
      symbol_display = {},
      product_details = {},
    } = this.state.currentSymbol;
    const { leverage: symbol_display_leverage, position_type, } = symbol_display;
    // console.log("this.state.form :>> ", this.state.form);
    // console.log("symbol_display_leverage :>> ", symbol_display_leverage);
    // const positionTypeOption = position_type ? position_type : [];
    const positionTypeOption = ["T+0", "T+1"];
    const directionOption =
      this.state.form.positionType === "T+0" ? ["-1", "1"] : ["1"];
    const leverageOption = symbol_display_leverage
      ? symbol_display_leverage.split(",")
      : [];
    // console.log("leverageOption :>> ", leverageOption);
    const { marginValue, leverage, } = this.state.form;
    const totalAmount = Number(leverage) * Number(marginValue);
    return (
      <form className={cx("form")}>
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
          <div className={cx("control")}>{totalAmount || "-"}</div>
        </div>
        <div className={cx("form-item")}>
          <div className={cx("label")}>买入数量</div>
          <div className={cx("control")}>{"-"}</div>
        </div>
        <div className={cx("form-item")} data-name="take-profit">
          <div className={cx("label")}>止盈价</div>
          <div className={cx("control")}>
            <InputButtonSet
              onIncrement={() => this.handleTakeProfitAdjust(1)}
              onDecrement={() => this.handleTakeProfitAdjust(-1)}
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
              onIncrement={() => this.handleStopLossAdjust(1)}
              onDecrement={() => this.handleStopLossAdjust(-1)}
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
        <div className={cx("form-item")} data-name="stop-loss">
          <div className={cx("submit-button-wrap")}>
            <Button className="t4u-button-primary" onClick={this.handleSubmit}>
              下单
            </Button>
          </div>
        </div>
        <NewOrderRule />
      </form>
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

function InputButtonSet(props) {
  const { onIncrement, onDecrement, children, ...restProps } = props;
  return (
    <div className={cx("input-button-set")} {...restProps}>
      <button
        onClick={onDecrement}
        className={cx("input-button", "input-button-left")}
      >
        -
      </button>
      {children}
      <button
        onClick={onIncrement}
        className={cx("input-button", "input-button-right")}
      >
        +
      </button>
    </div>
  );
}
