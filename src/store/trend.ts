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
    list: [],
  };
  @action
  fetchCurrentTrendList = async (symbolId, unit) => {
    const res = await api.market.getProductTrend(symbolId, {
      params: {
        unit: unit,
      },
    });
    const list = res.status === 200 ? this.convertTrendList(res.data.trend, 0, 1) : [];

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
  refreshTrendChartInfo = ()=>{
    this.trendChartInfo = {
      ...this.trendChartInfo,
    };
  }

  convertTrendList = (list, key1, key2) => {
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
  containerStatus = {
    rightSide: FULL,
    bottomSide: FULL,
  };

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
