import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "antd";

import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";
import ToolHeader from "components/SymbolTool/ToolHeader";
import MainDetail from "components/SymbolTool/MainDetail";
import ContractDetail from "components/SymbolTool/ContractDetail";
import utils from "utils";
import api from "services";

import classNames from "classnames/bind";
import { inject, observer } from "mobx-react";
import { reaction, toJS } from "mobx";
import { OnePriceNewOrderForm } from "../NewOrderForm";

@inject("other", "common", "symbol")
@observer
export default class extends React.PureComponent<{}, {}> {
  state = {
    showCls: "",
  };
  other = null;
  symbol = null;
  constructor(props) {
    super(props);

    this.other = props.other;
    this.symbol = props.symbol;
    this.setOnCurrentTransactionSymbolChange();
  }

  render() {
    const { showCls, } = this.state;

    return (
      <div className={`symbol-tool-item symbol-buy-content ${showCls}`}>
        <ToolHeader />
   
        <OnePriceNewOrderForm />
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
  setOnCurrentTransactionSymbolChange = () => {
    reaction(
      () => this.props.symbol.currentTransactionSymbol,
      currentTransactionSymbol => {
        const { symbolId, } = currentTransactionSymbol;
        const showCls = symbolId === -1 ? "" : "show";

        this.setState({ showCls, });
      }
    );
  };
}
