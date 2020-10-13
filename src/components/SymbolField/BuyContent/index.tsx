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
import { CloseOutlined } from '@ant-design/icons';
const closeStyle = {
  width:"17px",
  height:"17px",
};
@inject("other", "common", "product")
@observer
export default class extends React.PureComponent<{}, {}> {
  state = {
    showCls: "",
  };
  other = null;
  product = null;
  constructor(props) {
    super(props);

    this.other = props.other;
    this.product = props.product;
    this.setOnCurrentTransactionSymbolChange();
  }

  render() {
    const { showCls, } = this.state;

    return (
      <div className={`symbol-tool-item symbol-buy-content ${showCls}`}>
        <ToolHeader  >
          <CloseOutlined className="symbol-buy-content-tool" onClick={this.onCloseButtonClick}/>
        </ToolHeader>
   
        <OnePriceNewOrderForm />
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
  onCloseButtonClick = ()=>{
    this.props.product.setCloseNewOrderForm();
  }
  setOnCurrentTransactionSymbolChange = () => {
    reaction(
      () => this.props.product.isOpenNewOrderForm,
      isOpenNewOrderForm => {
        const showCls = isOpenNewOrderForm ? "show" : "";
        
        this.setState({ showCls, });
      }
    );
  };
}
