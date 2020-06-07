import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { createChart } from "lightweight-charts";
import { inject, observer } from "mobx-react";
import {
  STOCK_COLOR_MAP
} from "constant";
import utils from 'utils';

interface Trend {
  time: number;
  value: number;
}

interface TrendGraphProps {
  productCode: string;
  width: number;
  height: number;
}

interface TrendGraphState {
  detail: {
    name: string;
    change: number; // 涨跌
    chg: number; // 涨跌幅
    new_price: number; // 均价
    trend: Trend[];
  } | null;
}

@inject("market", "common")
@observer
export default class TrendGraph extends BaseReact<TrendGraphProps, TrendGraphState> {
  chart: any = null;
  container: any = null;
  areaSeries: any = null;

  constructor(props: TrendGraphProps) {
    super(props);
    this.container = React.createRef();
    this.state = {
      detail: null,
    };
  }

  async componentDidMount() {
    this.initChart(this.props.width, this.props.height);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.initChart(nextProps.width, nextProps.height);
  }

  initChart = (width: number, height: number) => {
    this.container.current.innerHTML = "";
    this.chart = createChart(this.container.current, {
      width: width,
      height: height - 100,
      layout: {
        backgroundColor: "transparent",
        textColor: "#d1d4dc",
      },
      priceScale: {
        autoScale: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        position: "left",
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        timeVisible: true,
        rightOffset: 10,
      },
      grid: {
        horzLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        vertLines: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      localization: {
        locale: "zh-CN",
        timeFormatter: this.timestampFormat,
      },
      handleScroll: false,
      handleScale: false,
    });
    this.areaSeries = this.chart.addAreaSeries({
      topColor: "rgba(21, 146, 230, 0.4)",
      bottomColor: "rgba(21, 146, 230, 0)",
      lineColor: "rgba(21, 146, 230, 1)",
      lineStyle: 0,
      lineWidth: 1,
      crosshairMarkerVisible: false,
      crosshairMarkerRadius: 3,
    });
    this.areaSeries.setData([]);
    this.getProductTrend();
    setInterval(this.getProductTrend, 60 * 1000);
  };

  getProductTrend = async () => {
    const { productCode, } = this.props;
    const res = await this.$api.market.getProductTrend(productCode);
    this.setState({
      detail: res.data,
    });
    let data = [];
    if (res.data && res.data.trend) {
      data = res.data.trend.map(item => {
        return {
          time: Number(item[0]) + 8 * 60 * 60, // trading view 的 bug ，临时手动增加八个时区
          value: item[3],
        };
      });
    }
    this.areaSeries.setData(data);
    this.chart.timeScale().fitContent();
  };

  timestampFormat = (timestamp) => {
    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    const date = new Date((timestamp - 8 * 60 * 60) * 1000);
    const hour = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    return hour + ":" + minutes;
  };

  render() {
    const { detail, } = this.state;
    const {
      width, height, common: {
        stockColorMode,
      },
    } = this.props;

    return (
      <div className="trend-graph" style={{ width: `${width}px`, height: `${height}px`, }}>
        <div className="trend-graph-title">大盘指数</div>
        {
          !detail
            ? null
            : (
              <div className="trend-graph-detail">
                <span>{detail.name}</span>
                <span className={`${utils.getStockChangeClass(detail.change, stockColorMode)}`}>{detail.new_price}</span>
                <span className={`${utils.getStockChangeClass(detail.change, stockColorMode)}`}>{detail.change}</span>
                <span
                  className={`${utils.getStockChangeClass(detail.chg, stockColorMode)}`}></span>
              </div>
            )
        }
        <div ref={this.container}/>
      </div>
    );
  }
}