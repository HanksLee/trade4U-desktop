import api from "services";
import { action, observable, computed, autorun, toJS } from "mobx";
import BaseStore from "store/base";

import moment from "moment";
import {
  IN_TRANSACTION,
  PENDING,
  FINISH
} from "pages/Symbol/Center/OrderInfo/config/tabConfig";
import {
  META_FUND,
  ORDER_OPEN,
  ORDER_CLOSE,
  ORDER_PROFIT,
  PENDING_ORDER_CLOSE
} from "pages/Symbol/Center/OrderInfo/config/wsType";

import {
  orderMap,
  historyMap
} from "pages/Symbol/Center/OrderInfo/config/columnMapConfig";

class OrderStore extends BaseStore {
  isInit = false;

  setInit = () => {
    this.isInit = true;
  };

  @observable
  foldTabs = false;
  @action
  setFoldTabs(foldTabs) {
    this.foldTabs = foldTabs;
  }

  @action
  setFoldTabsClick = () => {
    this.foldTabs = !this.foldTabs;
  };

  @observable
  info = {
    orderTabKey: IN_TRANSACTION,
    search: {
      page_size: 5,
      close_start_time: moment()
        .subtract(3, "M")
        .unix(),
      close_end_time: moment().unix(),
    },
  };

  @action
  setInfo(d) {
    this.info = {
      ...this.info,
      ...d,
    };
  }

  @computed
  get getOrderTabKey() {
    return this.info.orderTabKey;
  }
  @observable
  tradeInfo = {
    colMap: {},
    result: {},
  };

  @action
  getTradeInfo = async config => {
    const res = await this.$api.market.getTradeInfo(config);

    this.setTradeInfo({
      result: res.data,
    });
  };

  @action
  setTradeInfo = d => {
    this.tradeInfo.colMap = d.colMap || this.tradeInfo.colMap;
    this.tradeInfo.result = d.result || this.tradeInfo.result;
  };

  @action
  setTardeInfoMeta = d => {
    const { tradeInfo, tradeList, } = this;
    const transList = toJS(tradeList[IN_TRANSACTION]);
    const newMeta = {
      ...tradeInfo.result,
      ...d,
    };
    const newMetaResults = this.calcTradeInfo(newMeta, transList);

    this.setTradeInfo({
      result: newMetaResults,
    });
  };

  @observable
  tradeList = {
    isLoading: true,
    [IN_TRANSACTION]: [],
    [PENDING]: [],
  };

  @action
  getTradeList = async status => {
    const config = {
      params: {
        status,
      },
    };
    this.setTradeList({ isLoading: true, });
    const res = await this.$api.market.getTradeList(config);
    this.setTradeList({
      isLoading: false,
      [status]: res.data,
    });
  };

  @action
  setTradeList = d => {
    this.tradeList = {
      ...this.tradeList,
      ...d,
    };
  };

  @action
  setPendingList = list => {
    const { tradeList, } = this;
    const pendingList = toJS(tradeList[PENDING]);

    this.removeTradeList(pendingList, list);
    this.setTradeList({
      [PENDING]: pendingList,
    });
  };

  @action
  setInTransactionList = (type, list) => {
    const { tradeList, } = this;
    const transList = toJS(tradeList[IN_TRANSACTION]);

    if (type === ORDER_CLOSE) {
      this.removeTradeList(transList, list);
    } else {
      this.addTradeList(transList, list);
    }

    this.setTradeList({
      [IN_TRANSACTION]: transList,
    });
  };

  @computed
  get isTradeLoading() {
    return this.tradeList.isLoading;
  }

  @observable
  historyList = {
    isLoading: true,
    result: {},
  };

  @action
  getHistoryList = async (
    page,
    page_size,
    close_start_time = 0,
    close_end_time = 0
  ) => {
    let params = {
      page,
      page_size,
    };
    if (close_start_time !== 0 && close_end_time !== 0) {
      params = {
        ...params,
        close_start_time,
        close_end_time,
      };
    }
    const config = {
      params,
    };
    this.setHistoryList({ isLoading: true, });
    const res = await this.$api.market.getTradeHistoryList(config);
    this.setTradeInfo({
      result: res.data.total_data,
    });
    this.setHistoryList({
      isLoading: false,
      result: res.data,
    });
  };

  @action
  setHistoryList = d => {
    this.historyList = {
      ...this.historyList,
      ...d,
    };
  };

  @action
  updateTrade = buffer => {
    const { tradeInfo, tradeList, } = this;
    const pendingList = toJS(tradeList[PENDING]);
    const transList = toJS(tradeList[IN_TRANSACTION]);

    const pendingCloseList = buffer[PENDING_ORDER_CLOSE];
    this.removeTradeList(pendingList, pendingCloseList);

    const orderCloseList = buffer[ORDER_CLOSE];
    this.removeTradeList(transList, orderCloseList);

    const orderOpenList = buffer[ORDER_OPEN];
    this.addTradeList(transList, orderOpenList);

    const orderProfitList = buffer[ORDER_PROFIT];
    this.addTradeList(transList, orderProfitList);

    const newMeta = {
      ...tradeInfo.result,
      ...buffer[META_FUND],
    };

    const newMetaTotal = this.calcTradeInfo(newMeta, transList);

    this.setTradeInfo({
      result: newMetaTotal,
    });

    this.setTradeList({
      [PENDING]: pendingList,
      [IN_TRANSACTION]: transList,
    });
  };

  calcTradeInfo = (meta, list) => {
    const { balance, margin, } = meta;
    const profit = list.reduce((acc, cur) => acc + cur.profit, 0);
    const equity = list.reduce((acc, cur) => acc + cur.profit, 0) + balance;
    const free_margin = equity - margin;
    const margin_level = equity / margin;

    return {
      ...meta,
      profit,
      equity,
      free_margin,
      margin_level,
    };
  };
  addTradeList = (originlist, addList) => {
    addList.map(aItem => {
      const { order_number, timestamp, } = aItem;
      const i = originlist.findIndex(oItem => {
        return oItem.order_number === order_number;
      });

      const originTimestamp = originlist[i].timestamp;
      if (i === -1) {
        originlist.push(aItem);
      } else if (originTimestamp < timestamp) {
        originlist[i] = aItem;
      }
    });
  };
  removeTradeList = (originlist, removeList) => {
    removeList.map(rItem => {
      const { order_number, } = rItem;
      const i = originlist.findIndex(oItem => {
        return (oItem.order_number = order_number);
      });
      if (i === -1) return;
      originlist.splice(i, 1);
    });
  };

  cancelTrade = autorun(() => {
    const { foldTabs, orderTabKey, search, } = this.info;
    const { page_size, close_start_time, close_end_time, } = search;

    if (!this.isInit) return;

    if (foldTabs) return;

    switch (orderTabKey) {
      case FINISH:
        this.getHistoryList(1, page_size, close_start_time, close_end_time);
        this.setTradeInfo({
          colMap: historyMap,
        });
        break;
      case IN_TRANSACTION:
      case PENDING:
        this.setTradeInfo({
          colMap: orderMap,
        });
        this.getTradeInfo({});
        this.getTradeList(orderTabKey);
        break;
    }
  });
}

export default new OrderStore();
