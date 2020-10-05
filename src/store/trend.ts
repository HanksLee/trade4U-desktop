import api from "services";
import { action, observable, computed, autorun, toJS, runInAction } from "mobx";
import BaseStore from "store/base";

import moment from "moment";
import { FULL, ZOOMOUT } from 'pages/Symbol/Center/config/containerStatus';

class TrendStore extends BaseStore {
  @observable
  trendChartInfo = {
    symbolId: -1,
    unit: "1m",
    option: {
      width: 0,
      height: 500,
    },
    list: [],
  };
  @action
  fetchCurrentTrendList = async (symbolId, unit) => {
    const res = await api.market.getProductTrend(symbolId, {
      params: {
        unit: unit,
      },
    });
    const list = res.status === 200 ? this.converTrendList(res.data.trend, 0, 1) : [];

    this.setTrendChartInfo({
      symbolId,
      unit,
      list,
    });
  };

  @action
  setTrendChartInfo = d => {
    this.trendChartInfo = {
      ...this.trendChartInfo,
      ...d,
    };
  };

  @action
  setTrendChartOption = d => {
    const { option, } =     this.trendChartInfo ;
    const newOption = {
      ...option,
      ...d,
    };
    // console.log("setTrendChartOption", toJS(newOption), d);
    this.trendChartInfo = {
      ...this.trendChartInfo,
      option:newOption,
    };
  };
  converTrendList = (list, key1, key2) => {
    return list.map(item => {
      const date = item[key1];
      const sell = item[key2];
      return {
        time: date,
        value: sell,
      };
    });
  };

  @observable
  trendInfo = {
    symbolId: -1,
    name: "----",
    trader_status: "",
    chg: 0,
    change: 0,
    sell: 0,
  };

  @action
  setTrendInfo = d => {
    this.trendInfo = {
      ...this.trendInfo,
      ...d,
    };
  };

  @observable
  containerStatus = {
    rightSide: FULL,
    bottomSide: FULL,
  };
  btnRgithOpen = false;

  @action
  setRightBtnOpenClick = rightSide => {
    this.containerStatus = {
      ...this.containerStatus,
      rightSide,
    };
  };

  @action
  setBottomBtnOpenClick = bottomSide =>{
    this.containerStatus = {
      ...this.containerStatus,
      bottomSide,
    };
  };
}

export default new TrendStore();
