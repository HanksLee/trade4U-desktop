import api from 'services';
import { action, observable, computed } from "mobx";
import BaseStore from "store/base";

class MarketStore extends BaseStore {
  @observable
  selfSelectSymbolList = [];
  @observable
  currentSelfSelectSymbol = {};

  @action
  getSelfSelectSymbolList = async config => {
    const res = await api.market.getSelfSelectSymbolList(config);
    this.setSelfSelectSymbolList(res.data.results);
  };

  @action
  setSelfSelectSymbolList = data => {
    this.selfSelectSymbolList = data;
  }

  @action
  setCurrentSelfSelectSymbol = symbol => {
    this.currentSelfSelectSymbol = symbol;
  }

  @action
  updateSelfSelectSymbolList = async config => {
    const res = await api.market.getSelfSelectSymbolList(config);
    const results = res.data.results;
    const newResults = results.map(item => {
      for (let i = 0; i < this.selfSelectSymbolList.length; i++) {
        if (item.symbol === this.selfSelectSymbolList[i].symbol) {
          return this.selfSelectSymbolList[i];
        }
      }
      return item;
    });
    this.setSelfSelectSymbolList(newResults);
  };

  @observable
  symbolList = [];
  @observable
  currentSymbol = {};

  @action
  getSymbolList = async config => {
    const res = await this.$api.market.getSymbolList(config);
    this.setSymbolList(res.data.results);
  };

  @action
  setSymbolList = data => {
    this.symbolList = data;
  }

  @action
  getCurrentSymbol = async (id, config) => {
    const res = await this.$api.market.getCurrentSymbol(id, config);
    this.setCurrentSymbol(res.data);
  }

  @computed
  get currentShowSymbol() {
    const obj = {};

    return obj;
  }

  @action
  setCurrentSymbol = (symbol, overwrite = false) => {
    if (overwrite) {
      this.currentSymbol = symbol;
    } else {
      this.currentSymbol = {
        ...this.currentSymbol,
        ...symbol,
      };
    }
  }

  @action
  searchSymbol = async (config) => {
    const res = await this.$api.market.searchSymbol(config);

    this.setCurrentSymbol(res.data);
  }

  @observable
  tradeInfo = {};

  @action
  getTradeInfo = async config => {
    const res = await this.$api.market.getTradeInfo(config);

    this.setTradeInfo(res.data);
  }

  @action
  setTradeInfo = (info, overwrite = true) => {
    if (overwrite) {
      this.tradeInfo = info;
    } else {
      this.tradeInfo = {
        ...this.tradeInfo,
        ...info,
      };
    }
  }

  @observable
  tradeList = []; // 持仓订单
  @action
  getTradeList = async (config) => {
    const res = await this.$api.market.getTradeList(config);
    this.setTradeList(res.data);
  }

  @action
  setTradeList = (list, type = 'order') => {
    if (type == 'order') {
      this.tradeList = list;
    } else {
    }
  }

  @observable
  currentTrade = {};

  @action
  getCurrentTrade = async (id) => {
    const res = await this.$api.trade.getCurrentTrade(id);
    this.setCurrentTrade(res.data);
  }

  @action
  setCurrentTrade = (trade) => {
    this.currentTrade = trade;
  }

  @observable
  sorter = 'change_rise';

  @action
  setSorter = (sorter) => {
    this.sorter = sorter;
  }
}

export default new MarketStore();