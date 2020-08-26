import React from "react";

import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";
import { Row, Col } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";

import { traderStatusMap } from "constant";
import moment from "moment";

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1795058_4vgdb4lgh5.js"
});

@inject("trend")
@observer
export default class extends React.Component<any, any> {
  state = {
    name: "----",
    chg: 0,
    change: 0,
    trader_status: "",
    sell: 0,
    btnOpen: false
  };
  trend = null;
  constructor(props) {
    super(props);
    this.trend = this.props.trend;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { name, sell, chg, change, trader_status, btnOpen } = this.state;
    const status = traderStatusMap[trader_status];

    const sign = Math.sign(change);
    const priceObj = this.props.getPriceTmp(sign);
    const priceCss = priceObj ? `${priceObj.color}` : "";

    const btnCss = btnOpen ? "close" : "open";
    return (
      <Row
        className={"symbol-chart-info"}
        type={"flex"}
        justify={"space-between"}
        align={"middle"}
      >
        <Col span={24}>
          <div className={"symbol-chart-title"}>
            <span className="symbol-chart-main">{name}</span>
            <span className={`${priceCss} symbol-chart-main`}>
              {sell} {this.getPriceIcon(sign)}{" "}
            </span>
            <span className={`${priceCss} symbol-chart-price `}>
              {this.setSignStirng(change)}
            </span>
            <span className={`${priceCss} symbol-chart-price `}>
              {this.setSignStirng(chg)}%
            </span>
            <span className={`symbol-chart-title-status ${trader_status}`}>
              {status}
            </span>
            <span className={`symbol-right-btn ${btnCss}`}></span>
          </div>
        </Col>
      </Row>
    );
  }

  componentDidUpdate() {}

  //function
  setSignStirng(number) {
    const sign = Math.sign(number);
    return sign > 0 ? `+${number}` : number;
  }

  getPriceIcon(sign) {
    let type = sign > 0 ? "icon-arrow-up" : "icon-arrow-down";

    return <IconFont type={type} className="symbol-chart-priceIcon" />;
  }
}
