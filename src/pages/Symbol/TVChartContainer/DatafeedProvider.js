import api from "services";
import ws from "utils/ws";
import { supportedResolution } from "constant";

const resolutionMap = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "1h",
  "240": "4h",
  "D": "1d",
  "1D": "1d",
  "7D": "7d"
};

export default class DatafeedProvider {
  wsConnect = null;
  lastItem = null;
  lastResolution = null;
  lastSymbolName = null;
  subscriberList = [];
  kChartData = [];
  interval = null;

  onReady = cb => {
    setTimeout(() => {
      cb({
        supported_resolutions: supportedResolution
      });
    }, 0);
  };

  resolveSymbol = async (symbol, onSymbolResolvedCallback) => {
    if (symbol === "000") return;
    const res2 = await api.market.getCurrentSymbol(symbol);
    setTimeout(function () {
      onSymbolResolvedCallback({
        name: symbol,
        ticker: symbol,
        type: res2.data.product_details.type,
        description: res2.data.symbol_display.description,
        supported_resolutions: supportedResolution,
        timezone: "Asia/Shanghai",
        session: "24x7",
        minmov: 1,
        pricescale: Math.pow(10, res2.data.symbol_display.decimals_place),
        minmove2: 0,
        has_intraday: true
      });
    }, 0);
  };

  getChartData = trend => {
    return trend.map(item => ({
      time: item[0] * 1000, //TradingView requires bar time in ms
      low: item[6],
      high: item[5],
      open: item[8],
      close: item[2],
      volume: item[4]
    }));
  };

  connectWebsocket = (symbolInfo, resolution) => {
    const that = this;
    if (this.wsConnect) this.wsConnect.close();
    this.wsConnect = ws(
      `symbol/${symbolInfo.ticker}/trend/${resolutionMap[resolution]}`
    );

    // setTimeout(function () {
    //   setInterval(function () {
    //     that.wsConnect.send(`{"type":"ping"}`);
    //   }, 3000)
    // }, 30000)

    this.wsConnect.onmessage = event => {
      const message = JSON.parse(event.data);
      const data = message.data;
      if (message.type === 'pong') {
        clearInterval(this.interval);

        // ??????????????????????????????clearInterval??????????????????
        this.interval = setInterval(function () {
          this.connectWebsocket();
        }, 4000);
      }
      if (message.type && message.type !== 'pong') { // ????????????
        // code ...      
        const formatData = {
          time: data.timestamp * 1000, //TradingView requires bar time in ms
          low: data.low,
          high: data.high,
          open: data.open,
          close: data.sell,
          volume: data.volume
        };

        this.subscriberList = this.subscriberList || [];
        for (const sub of this.subscriberList) {
          if (
            sub.symbolName !== this.lastSymbolName ||
            sub.resolution !== this.lastResolution
          ) {
            this.kChartData = [];
          } else {
            if (typeof sub.callback !== "function") return;
            sub.callback(formatData);
          }
        }
      }

    };

    // this.wsConnect.onclose = (evt) => {
    //   setInterval(function () { that.connectWebsocket() }, 3000)
    // }

  }

  getBars = async function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback
  ) {
    console.log("getBars---", symbolInfo, resolution);

    if (!symbolInfo.name) return;

    if (
      resolution !== this.lastResolution ||
      symbolInfo.name !== this.lastSymbolName
    ) {
      this.lastResolution = resolution;
      this.lastSymbolName = symbolInfo.name;
      this.kChartData = [];
      this.subscriberList = [];
    }

    const existingData = this.kChartData || [];
    if (existingData.length) {
      return;
    }

    const res = await api.market.getProductTrend(symbolInfo.ticker, {
      params: {
        unit: resolutionMap[resolution]
      }
    });

    const bars = this.getChartData(res.data.trend);
    this.kChartData = bars;
    onHistoryCallback(bars, { noData: !bars.length });

    this.connectWebsocket(symbolInfo, resolution);

  };

  subscribeBars = (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID
  ) => {
    this.subscriberList = this.subscriberList || [];
    const found = this.subscriberList.some(n => n.uid === subscriberUID);
    if (found) return;

    this.subscriberList.push({
      symbolName: symbolInfo.name,
      resolution: resolution,
      uid: subscriberUID,
      callback: onRealtimeCallback
    });
  };

  unsubscribeBars = subscriberUID => {
    this.subscriberList = this.subscriberList || [];
    const idx = this.subscriberList.findIndex(n => n.uid === subscriberUID);
    if (idx < 0) return;
    this.subscriberList.splice(idx, 1);
  };
}
