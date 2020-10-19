import api from "services";
import { action, observable, computed, toJS } from "mobx";
import BaseStore from "store/base";
import { SEARCH, SELF } from "pages/Symbol/config/symbolTypeCategory";
import { ISymbolItem, IPriceInfo } from "pages/Symbol/config/interface";
import { PAGE_SIZE } from "constant";

class SymbolStore extends BaseStore {
  @observable
  currentSymbolInfo: ISymbolItem = this.initCurrentSymbolInfo();

  @action
  setCurrentSymbolInfoById = (symbolId, name) => {
    const tmp = this.currentSymbolList.results.filter(item => {
      return item.symbolId === symbolId;
    });

    const current =
      tmp.length === 0
        ? this.initCurrentSymbolInfo(SEARCH, {
          id: symbolId,
          symbol_display: { name, },
        })
        : tmp[0];

    this.currentSymbolInfo = current;
  };

  @action
  setCurrentSymbolInfo = (
    symbolInfoItem: ISymbolItem = this.initCurrentSymbolInfo()
  ) => {
    this.currentSymbolInfo = symbolInfoItem;
  };

  @observable
  currentSymbolList = {
    page: -1,
    nexPage: -1,
    results: [],
  };

  @action
  setCurrentSymbolList(d) {
    this.currentSymbolList = {
      ...this.currentSymbolList,
      ...d,
    };
  }
  @action
  clearCurrentSymbolList = () => {
    this.currentSymbolList = {
      page: -1,
      nexPage: -1,
      results: [],
    };
  };

  @action
  addCurrentSymbolList = async (
    page,
    category,
    symbol_type_code,
    symbol_type_name
  ) => {
    const now = await this.fetchNowSymbolList(
      page,
      PAGE_SIZE,
      category,
      symbol_type_name
    );

    const { count, results, } = now;
    const nextPage = this.getSymbolNextPage(count, page, PAGE_SIZE);
    const newList = this.createSymbolList(results, symbol_type_code);
    const oldSymbolList = toJS(this.currentSymbolList.results);
    const symbolList = [...oldSymbolList, ...newList];
    this.setCurrentSymbolList({
      page,
      nextPage,
      results: symbolList,
    });
  };

  @action
  updateCurrentSymbolListFromSubscribeDate = updateList => {
    updateList.forEach(update => {
      const {
        symbol,
        sell,
        buy,
        change,
        chg,
        high,
        low,
        close,
        open,
        volume,
        amount,
        amplitude,
        timestamp,
      } = update;
      const { results, } = this.currentSymbolList;
      const updateTargets = results.filter((item: ISymbolItem) => {
        return item.symbolCode === symbol;
      });
      if (updateTargets.length === 0) return;
      updateTargets[0].priceInfo = {
        symbol,
        sell,
        buy,
        change,
        chg,
        high,
        low,
        close,
        open,
        volume,
        amount,
        amplitude,
        timestamp,
      };
    });
  };
  getSymbolNextPage = (count, current_page, page_size) => {
    const nextPage =
      count - current_page * page_size > 0 ? current_page + 1 : -1;
    return nextPage;
  };

  @action
  fetchNowSymbolList = async (
    page: number,
    page_size: number,
    symbol_type_name: string,
    category: string
  ) => {
    let ret = null;
    switch (category) {
      case SELF:
        ret = await this.fetchSelfSelectSymbolList(page, page_size);
        break;
      default:
        ret = await this.fetchSymbolList(page, page_size, symbol_type_name);
        break;
    }

    return ret;
  };

  @action
  async fetchSelfSelectSymbolList(
    page: number,
    page_size: number,
    type_name: string = ""
  ) {
    const res = await api.market.getSelfSelectSymbolList({
      page,
      page_size,
      type_name,
    });

    if (res.status === 200) {
      return res.data;
    }
  }

  @action
  async fetchSymbolList(
    page: number,
    page_size: number,
    type__name: string = ""
  ) {
    const d = {
      params: {
        type__name: type__name,
        exclude_self_select: true,
      },
      page,
      page_size,
    };
    const res = await api.market.getSymbolList(d);

    if (res.status === 200) {
      return res.data;
    }
  }

  initCurrentSymbolInfo(symbol_type_code = "", item = {}) {
    const {
      trader_status = "",
      product_details,
      symbol_display = {},
      symbol = -1,
      id = -1,
    } = item;
    const { name = "-----", } = symbol_display;
    const priceInfo: IPriceInfo = {
      symbol: "-----",
      sell: 0,
      buy: 0,
      change: 0,
      chg: 0,
      high: 0,
      low: 0,
      close: 0,
      open: 0,
      volume: 0,
      amount: 0,
      amplitude: 0,
      timestamp: 0,
    };

    const symbolCode = product_details ? product_details.symbol : "------";
    const symbolId = symbol_type_code === SELF ? symbol : id;
    const symbolKey = `${symbolId}-${name}`;
    return {
      symbol_type_code,
      symbolKey,
      symbolCode,
      symbolId,
      name,
      trader_status,
      priceInfo,
    };
  }

  createSymbolList(list: any, symbol_type_code: string): ISymbolItem[] {
    return list.map((item, i) => {
      return this.initCurrentSymbolInfo(symbol_type_code, item);
    });
  }
}

export default new SymbolStore();
