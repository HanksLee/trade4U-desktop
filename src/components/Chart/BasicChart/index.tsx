import * as React from "react";
import { createChart } from "lightweight-charts";
import defaultChartOption from "./config/option";

const BASICSTEP = 15;
export default class BasicChart extends React.Component {
  state = {
    chart: null,
    chartOption: null,
  };
  containerRef = null;
  chartStyle = {
    width: "100%",
    height: "100%",
  };

  basic = {
    start: null,
    end: null,
  };
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
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
    const { chartStyle, setBasicInfo, } = this;
    const { chart, } = this.state;
    const { children, } = this.props;
    return (
      <div
        ref={(ref) => {
          this.containerRef = ref;
        }}
        style={chartStyle}
      >
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, { chart, setBasicInfo, });
        })}
      </div>
    );
  }

  componentDidMount() {
    const { clientWidth, clientHeight, } = this.containerRef;

    const chartOption = {
      ...defaultChartOption,
      width: clientWidth,
      height: clientHeight,
    };

    const chart = createChart(this.containerRef, chartOption);

    chart
      .timeScale()
      .subscribeVisibleLogicalRangeChange((newVisibleLogicRange) => {
        if(!newVisibleLogicRange) return;
        const timeScale = chart.timeScale();
        const { from, to, } = newVisibleLogicRange;
        const { start, end, } = this.basic;
        if(from > end) return;
        // console.log(newVisibleLogicRange);
        if(start === null || end === null) {
          return;
        }
        const leftStep =  BASICSTEP * -1;
        if (from  < start + leftStep) {
          timeScale.setVisibleLogicalRange({
            from: leftStep,
            to: to,
          });
        }

        const rightStep = BASICSTEP;
        if(to > end + rightStep) {
          timeScale.setVisibleLogicalRange({
            from: from,
            to: end + rightStep,
          });
        }
      });
    this.setState({
      chart,
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const { chartOption, } = this.state;
    const prevChartOption = prevState.chartOption;
    if (
      chartOption &&
      (chartOption.width !== prevChartOption.width ||
        chartOption.height !== prevChartOption.height)
    ) {
      this.state.chart.applyOptions(chartOption);
    }
  }

  //function
  createChartOption = (defaultOption, option) => {
    for (let key in defaultOption) {
      const value = option[key];

      if (value) {
        defaultOption[key] = value;
      }
    }

    return defaultOption;
  };

  setBasicInfo = (start, end) => {
    this.basic = {
      start,
      end,
    };
    this.setTimeLineRangeResize(start, end);
  };

  setTimeLineRangeResize = (from, to) => {
    // console.log("Change");
    this.state.chart.timeScale().setVisibleLogicalRange({
      from: from + BASICSTEP * -1,
      to: to + BASICSTEP,
    });
  };
}
