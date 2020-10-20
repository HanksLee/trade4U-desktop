import React from "react";

import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";
import { Row, Col } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";

import { traderStatusMap } from "constant";
import moment from "moment";
import { FULL, ZOOMOUT } from 'pages/Symbol/Center/config/containerStatus';
import utils from 'utils';

const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1795058_4vgdb4lgh5.js",
});

@inject("common", "trend", "symbol")
@observer
export default class extends React.Component<any, any> {
  state = {
    name: "----",
    trader_status: "",
    btnOpen: false,
  };
  trend = null;
  symbol = null;
  constructor(props) {
    super(props);
    this.trend = this.props.trend;
    this.symbol = this.props.symbol;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { name, trader_status, priceInfo, symbolId, } = this.symbol.currentSymbolInfo;
    const { sell, chg, change, } = priceInfo;
    const sellValue = utils.numberPrecisionFormat(sell);
 
    const status = traderStatusMap[trader_status];

    const sign = Math.sign(change);
    const priceObj = this.props.common.getPriceTmp(sign);
    const priceCss = priceObj ? `${priceObj.color}` : "";

    const { rightSide, } = this.trend.containerStatus;
    const btnCss = rightSide !== FULL && symbolId !== -1 ? "close" : "open";
    // console.log(chg);
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
              {sellValue} {this.getPriceIcon(sign)}{" "}
            </span>
            <span className={`${priceCss} symbol-chart-price `}>
              {this.setSignString(change)}
            </span>
            <span className={`${priceCss} symbol-chart-price `}>
              {this.setSignString(chg)}%
            </span>
            <span className={`symbol-chart-title-status ${trader_status}`}>
              {status}
            </span>
            <span className={`symbol-right-btn ${btnCss}`} onClick={()=>this.onRightBtnClick(rightSide, symbolId)}></span>
          </div>
        </Col>
      </Row>
    );
  }

  componentDidUpdate() { }

  //function
  setSignString(number) {
    const sign = Math.sign(number);
    return sign > 0 ? `+${number}` : number;
  }

  getPriceIcon(sign) {
    let type = sign > 0 ? "icon-arrow-up" : "icon-arrow-down";

    return <IconFont type={type} className="symbol-chart-priceIcon" />;
  }


  //event
  onRightBtnClick = (status, symbolId)=>{
    const rightSide = status === FULL && symbolId !== -1 ? ZOOMOUT : FULL;
    this.props.trend.setRightBtnOpenClick(rightSide);
  }
}
