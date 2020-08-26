import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import {
  PRODUCT_RESFRESH,
  RIGHT_SHOW,
  RIGHT_HIDE
} from "pages/Symbol/config/messageCmd";
import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";
import { SymbolDetail, SymbolBuyContent } from "components/SymbolTool";

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
    return (
      <div className={`symbol-right ${areaShowCls}`}>
        <SymbolDetail type={type} data={data} />
        <SymbolBuyContent type={type} data={data} />
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
    switch (cmd) {
      case PRODUCT_RESFRESH:
        this.openProductDetail(toJS(data));
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
  };
}
