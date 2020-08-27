import React from "react";

import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";
import { Row, Col } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";

import moment from "moment";

import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";
import utils from "utils";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1795058_4vgdb4lgh5.js",
});


@inject("other")
@observer
export default class extends React.Component<any, any> {
  state = {
    name: "----"
  };
  other = null;
  constructor(props) {
    super(props);
    this.other = this.props.other;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const { name } = this.state;
    const { sell, chg, change, } = this.other.productInfo;

    const sign = Math.sign(change);
    const priceObj = this.props.getPriceTmp(sign);
    const priceCss = priceObj ? `${priceObj.color}` : "";
    return (
      <div className={`symbol-tool-header`}>
        <h2>{name}</h2>
        <div className="symbol-header-price" >
          <span className={`${priceCss} symbol-header-price-main`}>
            {sell} {this.getPriceIcon(sign)}{" "}
          </span>
          <span className={`${priceCss} symbol-header-price-item`}>
            {utils.setSignStirng(change)}
          </span>
          <span className={`${priceCss}  symbol-header-price-item`}>
            {utils.setSignStirng(chg)}%
          </span>
        </div>
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
  getPriceIcon(sign) {
    let type = sign > 0 ? "icon-arrow-up" : "icon-arrow-down";

    return <IconFont type={type} className="symbol-chart-priceIcon" />;
  }
}
