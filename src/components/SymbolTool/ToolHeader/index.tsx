import React from "react";

import { observer, inject } from "mobx-react";
import { createFromIconfontCN } from "@ant-design/icons";

import utils from "utils";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_1795058_4vgdb4lgh5.js",
});

@inject("common", "symbol")
@observer
export default class extends React.Component<any, any> {
  state = {
    name: "----",
  };
  symbol = null;
  constructor(props) {
    super(props);
    this.symbol = props.symbol;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const { children, } = this.props;
    const { name, priceInfo, } = this.symbol.currentSymbolInfo;
    const { change, chg, sell, } = priceInfo;
    const sign = Math.sign(change);
    const priceObj = this.props.common.getPriceTmp(sign);
    const priceCss = priceObj ? `${priceObj.color}` : "";
    return (
      <div className={`symbol-tool-header`}>
        <h2>{name}</h2>
        <div className="symbol-header-price">
          <span className={`${priceCss} symbol-header-price-main`}>
            {sell} {this.getPriceIcon(sign)}{" "}
          </span>
          <span className={`${priceCss} symbol-header-price-item`}>
            {utils.setSignString(change)}
          </span>
          <span className={`${priceCss}  symbol-header-price-item`}>
            {utils.setSignString(chg)}%
          </span>
        </div>
        <div className="symbol-header-tool">
          {React.Children.map(children, child => {
            return React.cloneElement(child);
          })}
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
