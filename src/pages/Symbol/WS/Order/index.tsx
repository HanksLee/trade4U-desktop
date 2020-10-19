import React from "react";
import { inject, observer } from "mobx-react";
import WSConnect from "components/HOC/WSConnect";

import { channelConfig } from "./config/channelConfig";
import moment from "moment";
import { FINISH } from "pages/Symbol/Center/OrderInfo/config/tabConfig";
import {
  META_FUND,
  ORDER_CLOSE,
  ORDER_OPEN,
  ORDER_PROFIT,
  PENDING_ORDER_CLOSE
} from "pages/Symbol/Center/OrderInfo/config/wsType";


@inject("order")
@observer
class OrderWSControl extends React.PureComponent {
  order = null;

  constructor(props) {
    super(props);
    this.order = props.order;
  }

  render() {
    return <></>;
  }

  componentDidMount() {
    this.props.wsControl.setReceiveMsgLinter(this.receiveMsgLinter);
  }

  //function
  receiveMsgLinter = d => {
    const { isTradeLoading, } = this.order;
    const { orderTabKey, } = this.order.info;

    if (isTradeLoading || orderTabKey === FINISH) {
      return;
    }

    const { type, data, } = d;

    if (type === META_FUND) {
      this.order.setTardeInfoMeta(data);
    } else if (type === PENDING_ORDER_CLOSE) {
      this.order.setPendingList(data);
    } else {
      this.order.setInTransactionList(type, data);
    }
  };
}

/* eslint new-cap: "off" */
export default WSConnect([channelConfig], OrderWSControl);
