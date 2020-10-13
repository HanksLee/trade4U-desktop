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

@inject("other", "common", "product")
@observer
export default class extends React.PureComponent<{}, {}> {
  state = {};
  other = null;
  product = null;
  constructor(props) {
    super(props);

    this.other = props.other;
    this.product = props.product;
  }

  render() {
    return (
      <div className={`symbol-tool-item symbol-detail`}>
        <ToolHeader />
        <MainDetail />
        <ContractDetail/>
        <div className="detail-btn-container">
          <Button
            className="t4u-button-primary"
            onClick={() => {
              this.onOrderBuyClick();
            }}
          >
            下單
          </Button>
        </div>
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function

  onOrderBuyClick = () => {
    this.product.setOpenNewOrderForm();
  };
}
