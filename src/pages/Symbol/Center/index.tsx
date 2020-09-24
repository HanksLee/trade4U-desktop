import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Row, Col } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import { ISymbolItem } from "../config/interface";
import TrendHeader from "components/Trend/TrendHeader";
import TrendContainer from "components/Trend/TrendContainer";
import OrderInfo from "./OrderInfo";
import { FULL, ZOOMOUT, ZOOMIN } from "./config/containerStatus";

@inject("symbol", "common", "trend", "order")
@observer
export default class Center extends BaseReact<{}, {}> {
  state = {
    isProductSelected: false,
  };
  trend = null;
  symbol = null;
  order = null;
  constructor(props) {
    super(props);
    this.setOnCurrentSymbolChange();
    this.setOnOrderTabBtnClick();
    this.trend = props.trend;
    this.symbol = props.symbol;
    this.order = props.order;
  }

  render() {
    const { containerStatus, } = this.trend;
    const { rightSide, bottomSide, } = containerStatus;

    const centerCls = `symbol-center ${rightSide}`;
    const chartCls = `symbol-chart ${bottomSide}`;
    return (
      <div className={centerCls} onTransitionEnd={this.onRightTransitionEnd}>
        <Row style={{ height: "100%", }}>
          <Col
            span={24}
            className={chartCls}
            onTransitionEnd={this.onBottomTransitionEnd}
          >
            <TrendHeader />
            <TrendContainer />
          </Col>
          <OrderInfo />
        </Row>
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
  onRightTransitionEnd = e => {
    const { currentTarget, } = e;
    const option = {
      width: currentTarget.clientWidth - 50,
    };
    this.trend.setTrendChartOption(option);
    // console.log("onRightTransitionEnd", option);
    e.stopPropagation();
    e.preventDefault();
  };
  onBottomTransitionEnd = e => {
    const { currentTarget, } = e;
    const option = {
      height: currentTarget.clientHeight - 150,
    };

    this.trend.setTrendChartOption(option);
    // console.log("onBottomTransitionEnd", option);
    e.stopPropagation();
    e.preventDefault();
  };
  setOnCurrentSymbolChange = () => {
    reaction(
      () => this.props.symbol.currentSymbol,
      (currentSymbol: ISymbolItem) => {
        const { symbolId, } = currentSymbol;
        const { trendInfo, } = this.trend;

        const { getTrendInfo, } = this.symbol;
        const info = {
          ...getTrendInfo,
        };
        this.trend.setTrendInfo(info);

        if (trendInfo.symbolId !== symbolId) {
          const isSelected = symbolId !== -1 ? ZOOMOUT : FULL;
          this.trend.setRightBtnOpenClick(isSelected);
          this.trend.fetchCurrentTrendList(symbolId, "1m");
        }
      }
    );
  };

  setOnOrderTabBtnClick = () => {
    reaction(
      () => this.props.order.foldTabs,
      foldTabs => {
        const isSelected = foldTabs ? ZOOMOUT : FULL;
        this.trend.setBottomBtnOpenClick(isSelected);
      }
    );
  };
}
