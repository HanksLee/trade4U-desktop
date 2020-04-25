import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { createChart } from 'lightweight-charts';

interface Trend {
  time: number;
  value: number;
}

interface TrendGraphProps {
  productCode: string;
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

export default class TrendGraph extends BaseReact<TrendGraphProps, TrendGraphState> {
  chart: any = null
  container: any = null
  areaSeries: any = null

  constructor(props: TrendGraphProps) {
    super(props);
    this.container = React.createRef();
    this.state = {
      detail: null,
    };
  }

  async componentDidMount() {
    this.chart = createChart(this.container.current, {
      width: 390,
      height: 300,
      layout: {
        backgroundColor: 'transparent',
        textColor: '#d1d4dc',
      },
      priceScale: {
        autoScale: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        position: 'left',
        borderVisible: false,
      },
      timeScale: {
        visible: true,
        timeVisible: true,
      },
      grid: {
        horzLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        vertLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      localization: {
        locale: 'zh-CN',
        timeFormatter: this.timestampFormat,
      },
      handleScroll: false,
      handleScale: false,
    });
    this.areaSeries = this.chart.addAreaSeries({
      topColor: 'rgba(21, 146, 230, 0.4)',
      bottomColor: 'rgba(21, 146, 230, 0)',
      lineColor: 'rgba(21, 146, 230, 1)',
      lineStyle: 0,
      lineWidth: 1,
      crosshairMarkerVisible: false,
      crosshairMarkerRadius: 3,
    });
    this.areaSeries.setData([]);
    this.getProductTrend();
    setInterval(this.getProductTrend, 60 * 1000);
  }

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
          time: Number(item[0]),
          value: item[3],
        };
      });
    }
    this.areaSeries.setData(data);
    this.chart.timeScale().fitContent();
  }

  timestampFormat = (timestamp) => {
    function addZero(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }

    const date = new Date(timestamp * 1000);
    const hour = addZero(date.getHours());
    const minutes = addZero(date.getMinutes());
    return hour + ':' + minutes;
  }
  
  render () {
    const { detail, } = this.state;
    return (
      <div className="trend-graph">
        <div className="trend-graph-title">大盘指数</div>
        {
          !detail
            ? null
            : (
              <div className="trend-graph-detail">
                <span>{detail.name}</span>
                <span className={detail.change >= 0 ? 'data-up' : 'data-down'}>{detail.change}</span>
                <span className={detail.chg >= 0 ? 'data-up' : 'data-down'}>{detail.chg === 0 ? 0 : detail.chg + '%'}</span>
              </div>
            )
        }
        <div ref={this.container} />
      </div>
    );
  }
}