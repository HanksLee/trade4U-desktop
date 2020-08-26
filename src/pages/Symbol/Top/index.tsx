import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Row, Col } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import {
  PRODUCT_RESFRESH,
  RIGHT_SHOW,
  RIGHT_HIDE
} from "pages/Symbol/config/messageCmd";

import WSConnect from "components/HOC/WSConnect";
import channelConfig from "./config/channelConfig";
import TrendHeader from "components/Trend/TrendHeader";
import TrendContainer from "components/Trend/TrendContainer";
import utils from "utils";

/* eslint new-cap: "off" */
const WS_TrendContainer = WSConnect(
  channelConfig[0],
  channelConfig,
  TrendContainer
);

@inject("trend", "common")
@observer
export default class extends BaseReact<{}, {}> {
  state = {
    info: null,
  };
  trend = null;
  cancelTrackMessageListener = null;

  constructor(props) {
    super(props);

    this.trend = props.trend;
    this.setMessageListener();
  }

  render() {
    const { info, } = this.state;
    const { getPriceTmp, } = this.props;
    const symbol = info ? info.nowRealID : null;

    return (
      <Col span={24} className={"symbol-chart"}>
        <TrendHeader {...info} getPriceTmp={getPriceTmp} />
        <WS_TrendContainer nowRealID={symbol} unit={"1m"} />
      </Col>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function

  setMessageListener = () => {
    this.cancelTrackMessageListener = reaction(
      () => this.props.common.message,
      this.messageListener
    );
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
    const { rowInfo, } = d;
    this.setState({
      info: rowInfo,
    });
  };
}
