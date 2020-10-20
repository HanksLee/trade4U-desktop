import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { BaseReact } from "components/@shared/BaseReact";
import { BasicChart, AreaSeries } from "components/Chart";

import utils from "utils";
import moment from 'moment';
import { ISymbolItem } from 'pages/Symbol/config/interface';

const REFRESH_CHART_TIME = 60000;
@inject("trend")
@observer
export default class extends BaseReact<{}, {}> {
  state = {};

  trend = null;
  chartRef = null;

  timeId = -1;
  constructor(props) {
    super(props);

    this.trend = props.trend;
    this.chartRef = React.createRef();
  }

  reactionList = [];
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { trendChartInfo, } = this.trend;
    const { symbolId, list, } = trendChartInfo;
    return (
      <div
        ref={ref => (this.chartRef = ref)}
        className="symbol-chart-container"
      >
        <BasicChart  autoSize >
          <AreaSeries symbol={symbolId} initList={list} />
        </BasicChart>
      </div>
    );
  }

  componentDidMount() {
    this.reactionList = [this.setOnCurrentSymbolChange()];
  }

  componentDidUpdate(prevProps, prevState) {
    const { trendChartInfo, } = this.trend;
    const { symbolId, updateTime, } = trendChartInfo;
    if(symbolId === -1) {
      window.clearTimeout(this.timeId);
      return;
    }
    const diffSecond = moment().diff(moment(updateTime), "second");
    if(diffSecond * 1000 <  REFRESH_CHART_TIME && this.timeId !== -1) return;
    this.timeId = window.setTimeout(()=>{
      this.trend.fetchCurrentTrendList(symbolId, "1m");
      this.timeId = -1;
    }, REFRESH_CHART_TIME);
  }

  componentWillUnmount() {
    for(let cancel of  this.reactionList) {
      cancel();
    }
  }
  //function
  //reaction
  setOnCurrentSymbolChange = () => {
    return reaction(
      () => this.props.trend.trendChartInfo.symbolId,
      (symbolId) => {
        window.clearTimeout(this.timeId);
      }
    );
  };
}
