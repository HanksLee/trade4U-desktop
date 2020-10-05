import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { observer, inject } from "mobx-react";
import { autorun } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import OrderTabBarExtra from "components/OrderTabBarExtra";
import OrderTabContent from "components/OrderTabContent";

import moment from "moment";

import { IN_TRANSACTION, PENDING, FINISH } from "./config/tabConfig";

import utils from "utils";

const { RangePicker, } = DatePicker;
const { TabPane, } = Tabs;

/* eslint new-cap: "off" */

@inject("order", "common", "symbol")
@observer
export default class Bottom extends BaseReact<{}, {}> {
  order = null;
  symbol = null;
  constructor(props) {
    super(props);
    this.order = props.order;
    this.symbol = props.symbol;
    this.order.setInit();
  }

  render() {
    const { orderTabKey, } = this.order.info;
    const { foldTabs, } = this.order;
    const foldCls = foldTabs ? "fold-tabs" : "unfold-tabs";
    const isShowDatePicker = orderTabKey !== FINISH;

    // console.log("Bottom render");
    return (
      <Col span={24} className={`symbol-order ${foldCls}`}>
        <Tabs
          tabBarExtraContent={
            <OrderTabBarExtra
              isShowDatePicker={isShowDatePicker}
              foldTabs={foldTabs}
              onDateChange={this.onDateChange}
              onBtnBottomClick={this.toggleFoldTabs}
            />
          }
          tabBarStyle={{
            padding: "0 10px",
          }}
          activeKey={orderTabKey}
          onChange={this.onTabChange}
        >
          <TabPane tab="持仓 " key={IN_TRANSACTION}></TabPane>
          <TabPane tab="挂单" key={PENDING}></TabPane>
          <TabPane tab="历史" key={FINISH}></TabPane>
        </Tabs>
        <OrderTabContent />
      </Col>
    );
  }

  componentDidMount() {
    const { orderTabKey, } = this.order.info;
    this.order.setInfo({
      orderTabKey,
    });
  }

  componentDidUpdate() {}

  //function
  toggleFoldTabs = () => {
    this.order.setFoldTabsClick();
  };

  onTabChange = orderTabKey => {
    this.order.setInfo({
      orderTabKey,
    });
  };

  onDateChange = dateRange => {
    if (!dateRange) return;

    const close_start_time = dateRange[0].unix();
    const close_end_time = dateRange[1].unix();
    this.order.setInfo({
      search: {
        close_start_time,
        close_end_time,
      },
    });
  };
}
