import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { observer, inject } from "mobx-react";
import { autorun } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import OrderTabContent from "components/OrderTabContent";

import WSConnect from "components/HOC/WSConnect";
import moment from "moment";

import { IN_TRANSACTION, PENDING, FINISH } from "./config/tabConfig";

import channelConfig from "./config/channelConfig";
import utils from "utils";

const { RangePicker, } = DatePicker;
const { TabPane, } = Tabs;

/* eslint new-cap: "off" */
const WS_OrderTabContent = WSConnect(
  channelConfig[0],
  channelConfig,
  OrderTabContent
);

@inject("order", "common")
@observer
export default class Bottom extends BaseReact<{}, {}> {
  order = null;
  constructor(props) {
    super(props);
    this.order = props.order;
    this.order.setInit();
  }

  render() {
    const { foldTabs, orderTabKey, } = this.order.info;
    const foldCls = foldTabs ? "fold-tabs" : "unfold-tabs";
    const { getPriceTmp, } = this.props;
    const tabBarExtraContent = this.getTabBarExtraContent(
      orderTabKey,
      foldTabs
    );
    // console.log("Bottom render");
    return (
      <Col span={24} className={`symbol-order ${foldCls}`}>
        <Tabs
          tabBarExtraContent={tabBarExtraContent}
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
        <WS_OrderTabContent getPriceTmp={getPriceTmp} />
      </Col>
    );
  }

  componentDidMount() {
    const { orderTabKey, } = this.order.info;
    this.order.setInfo({
      orderTabKey,
    });
  }

  componentDidUpdate() {
    
  }

  //function
  toggleFoldTabs = foldTabs => {
    this.order.setInfo({
      foldTabs: !foldTabs,
    });
  };

  onTabChange = orderTabKey => {
    this.order.setInfo({
      orderTabKey,
    });
  };

  getTabBarExtraContent = (key, foldTabs) => {
    const showPickerStyle =
      key !== FINISH
        ? {
          display: "none",
        }
        : null;
    return (
      <Col span={24}>
        <RangePicker
          style={showPickerStyle}
          format="YYYY-MM-DD"
          disabledDate={this.disabledDate}
          onChange={this.onDateChange}
        />
        <span
          onClick={() => this.toggleFoldTabs(foldTabs)}
          className="rect-dock"
        />
      </Col>
    );
  };

  disabledDate = current => {
    const startDay = moment().subtract(3, "M");
    return current > moment().endOf("day") || current < startDay.endOf("day");
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

  cancelTrackMessageListener = autorun(() => {
    const c = this.props.common.count;
    // console.log("Bottom Message!", c.test);
  });
}
