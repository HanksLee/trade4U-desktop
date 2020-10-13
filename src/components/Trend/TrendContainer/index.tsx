import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { BaseReact } from "components/@shared/BaseReact";
import { BasicChart, AreaSeries } from "components/Chart";

import utils from "utils";

@inject("trend")
@observer
export default class extends BaseReact<{}, {}> {
  state = {};

  trend = null;
  chartRef = null;

  constructor(props) {
    super(props);

    this.trend = props.trend;
    this.chartRef = React.createRef();
  }

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

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
  }

  //function

}
