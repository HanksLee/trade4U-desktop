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
  reactionList = [];
  trend = null;
  order = null;
  symbol = null;
  constructor(props) {
    super(props);
    this.trend = props.trend;
    this.order = props.order;
    this.symbol = props.symbol;
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

  componentDidMount() {
    this.reactionList = [
      this.setOnCurrentSymbolChange(),
      this.setOnOrderTabBtnClick()
    ];
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    for(let cancelFn of this.reactionList) {
      cancelFn();
    }
  }

  //function
  onRightTransitionEnd = e => {
    this.trend.refreshTrendChartInfo();
    // console.log("onRightTransitionEnd", option);
    e.stopPropagation();
    e.preventDefault();
  };
  onBottomTransitionEnd = e => {
    this.trend.refreshTrendChartInfo();
    // console.log("onBottomTransitionEnd", option);
    e.stopPropagation();
    e.preventDefault();
  };



  //reaction
  setOnCurrentSymbolChange = () => {
    return reaction(
      () => this.props.symbol.currentSymbolInfo,
      (currentSymbolInfo: ISymbolItem) => {
        const { symbolId, } = currentSymbolInfo;
        const selectedType = symbolId !== -1 ? ZOOMOUT : FULL;
        this.trend.setRightBtnOpenClick(selectedType);
        this.trend.fetchCurrentTrendList(symbolId, "1m");
      }
    );
  };

  setOnOrderTabBtnClick = () => {
    return reaction(
      () => this.props.order.foldTabs,
      foldTabs => {
        const isSelected = foldTabs ? ZOOMOUT : FULL;
        this.trend.setBottomBtnOpenClick(isSelected);
      }
    );
  };
}
