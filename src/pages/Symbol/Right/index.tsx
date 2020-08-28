import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import {
  PRODUCT_RESFRESH,
  RIGHT_SHOW,
  RIGHT_HIDE,
  PRODUCT_UPDATE
} from "pages/Symbol/config/messageCmd";
import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";
import { SymbolDetail, SymbolBuyContent } from "components/SymbolField";

import utils from "utils";

const { RangePicker, } = DatePicker;
const { TabPane, } = Tabs;

@inject("other", "common")
@observer
export default class Right extends BaseReact<{}, {}> {
  state = {};
  other = null;
  cancelTrackMessageListener = null;

  constructor(props) {
    super(props);

    this.other = props.other;
    this.setMessageListener();
  }

  render() {
    const { topScreen, } = this.other;
    const { type, data, } = topScreen;

    const areaShowCls = type && data ? "show-area" : "";
    const { getPriceTmp, } = this.props;
    return (
      <div className={`symbol-right ${areaShowCls}`}>
        <SymbolDetail type={type} data={data} getPriceTmp={getPriceTmp} />
        <SymbolBuyContent type={type} data={data}  />
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function

  setMessageListener = () => {
    this.cancelTrackMessageListener = reaction(
      ()=> this.props.common.message,
      this.messageListener);
  };

  messageListener = (message, reaction) => {
    const { cmd, data, } = message;
    const d = toJS(data);
    switch (cmd) {
      case PRODUCT_RESFRESH:
        this.openProductDetail(d);
        break;
      case PRODUCT_UPDATE:
        this.refreshHeader(d.rowInfo);
        this.refreshMain(d.setMainInfo);
        break;
    }
  };

  openProductDetail = d => {
    const { topScreen, } = this.other;
    const { type, } = topScreen;

    const newType = type ? type : SCREEN_DETAIL;
    this.other.setTopScreen({
      type: newType,
      data: d,
    });
    this.other.setProductInfo({
      chg: 0,
      change: 0,
      sell: 0,
    });
  };

  refreshHeader = d =>{
    this.other.setProductInfo(d);
  }
  refreshMain = d =>{
    this.other.setMainInfo(d);
  }
}
