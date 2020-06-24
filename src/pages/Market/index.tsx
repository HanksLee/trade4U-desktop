import RankTable from "./RankTable";
import TrendGraph from "./TrendGraph";
import ForexTable from "./ForexTable";
import WithRoute from "components/@shared/WithRoute";
import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { inject, observer } from "mobx-react";
import { Col, Row } from "antd";
import "./index.scss";

interface MarketState {
  currentSymbolTypeCode: string;
  width: number;
  height: number;
  symbleTypeList: any[];
}

const symbolTypeMap = {
  HK: ["IXIXHSI", "IXIXHSCEI", "HSCCI"],
};

/* eslint new-cap: "off" */
@WithRoute("/dashboard/market")
@inject("market", "common")
@observer
export default class Market extends BaseReact<any, MarketState> {
  container: any = null;
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {
      currentSymbolTypeCode: undefined,
      width: 0,
      height: 0,
      symbleTypeList: [],
    };
  }

  componentDidMount() {
    this.getSymbolTypeList();
    this.computeTrendGraphStyle();
    setTimeout(() => {
      this.computeTrendGraphStyle();
    }, 2000);

    window.onresize = () => {
      this.computeTrendGraphStyle();
    };
  }

  getSymbolTypeList = async () => {
    const res = await this.$api.market.getSymbolTypeList();

    if (res.status == 200) {
      this.setState({
        symbleTypeList: res.data.results,
        currentSymbolTypeCode: res.data.results[0].symbol_type_code,
      });
    }
  };

  computeTrendGraphStyle = () => {
    if (this.container.current) {
      const containerWidth = this.container.current.offsetWidth;
      const width = Math.floor(
        (containerWidth - 20) /
        symbolTypeMap[this.state.currentSymbolTypeCode].length
      );
      const height = width;
      this.setState({
        width,
        height,
      });
    }
  };

  switchCurrentSymbolTypeCode = symbolTypeCode => {
    this.setState({ currentSymbolTypeCode: symbolTypeCode, });
  };

  render() {
    const { currentSymbolTypeCode, symbleTypeList, width, height, } = this.state;

    return (
      <div className="market-page">
        <ul className="symbol-type-list">
          {symbleTypeList.map(item => (
            <li
              className={
                currentSymbolTypeCode === item.symbol_type_code
                  ? "selected-symbol-type"
                  : ""
              }
              onClick={() => {
                this.switchCurrentSymbolTypeCode(item.symbol_type_code);
              }}
            >
              {item.symbol_type_name}
            </li>
          ))}
        </ul>
        {currentSymbolTypeCode === "HK" && (
          <>
            <div className="trend-graph-panel" ref={this.container}>
              {symbolTypeMap[currentSymbolTypeCode].map(item => (
                <TrendGraph productCode={item} width={width} height={height} />
              ))}
            </div>
            <RankTable symbolTypeCode={currentSymbolTypeCode} />
          </>
        )}
        {currentSymbolTypeCode && currentSymbolTypeCode !== "HK" && (
          <>
            <ForexTable symbolTypeCode={currentSymbolTypeCode} />
          </>
        )}
      </div>
    );
  }
}
