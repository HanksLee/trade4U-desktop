import api from "services";
import { action, observable, computed, autorun, toJS, runInAction } from "mobx";
import BaseStore from "store/base";

import moment from "moment";

class TrendStore extends BaseStore {
  @observable
  trendList = [];

  @action
  fetchTrendList = async (id, unit) => {
    const res = await api.market.getProductTrend(id, {
      params: {
        unit: unit
      }
    });

    if (res.status === 200) {
      this.setTrendList(res.data.trend);
    }
  };

  @action
  setTrendList = list => {
    const newList = this.converTrendList(list, 0, 1);
    this.trendList = [...newList];
  };

  @observable
  trendUpdateList = [];

  @action
  setTrendUpdateList = list => {
    const newList = this.converTrendList(list, "time", "sell");
    this.trendUpdateList = [...newList];
  };

  converTrendList = (list, key1, key2) => {
    return list.map(item => {
      const date = item[key1];
      const sell = item[key2];
      return {
        time: date,
        value: sell
      };
    });
  };

  @observable
  trendInfo = {
    name: "----",
    chg: 0,
    change: 0,
    trader_status: "",
    sell: 0,
    btnOpen: false
  };

  @action
  setTrendInfo = d => {
    this.trendInfo = {
        ...this.trendInfo ,
        ...d
    };
  };
}

export default new TrendStore();
