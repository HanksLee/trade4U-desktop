import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Col, Row, Tabs } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";
import utils from "utils";

import { observer, inject } from "mobx-react";
import OrderItem from "./OrderItem";
import order from "store/order";

@inject("order")
@observer
export default class TotalOrderList extends BaseReact<{}, {}> {
  state = {

  };

  order = null;
  constructor(props) {
    super(props);
    this.order = props.order;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { getPriceTmp, } = this.props;
    const { tradeInfo, } = order;
    const { result, colMap, } = tradeInfo;
    const list = this.createOrderInfoComponentList(
      result,
      colMap,
      getPriceTmp
    );
    return (
      <div className={"symbol-order-info"}>
        <Row type={"flex"} justify={"space-between"}>
          {list}
        </Row>
      </div>
    );
  }

  createOrderInfoComponentList = (d, keymap, getPriceTmp) => {
    if (!keymap) return;
    const keyList = Object.keys(keymap);
    return keyList.map(key => {
      const tmpValue = d[key];
      const value = tmpValue ? tmpValue.toFixed(2) : "---";
      const title = keymap[key];
      const { name, sign, } = title;
      const signType = sign || Math.sign(value);
      const priceTypeObj = getPriceTmp(signType);
      const span = 24 / keyList.length;
      return (
        <OrderItem
          key={key}
          title={name}
          value={value}
          priceType={priceTypeObj}
          span={span}
        />
      );
    });
  };
}
