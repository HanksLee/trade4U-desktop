import api from "services";
import { action, observable, computed, autorun, toJS } from "mobx";
import BaseStore from "store/base";
import { SELF, NONE } from "pages/Symbol/config/symbolTypeCategory";
import {
  IContractInfo,
  IPriceInfo,
  ISymbolItem
} from "pages/Symbol/config/interface";
import { current } from "immer";
const PAGE_SIZE = 20;

class ProductStore extends BaseStore {
  isInit = false;
  setInit = () => {
    this.isInit = true;
  };

  // 使用者目前选中的 symbol
  @observable
  currentSymbol = {};
  
  @action
  fetchCurrentSymbol = async symbolId => {
    const res = await api.market.getCurrentSymbol(symbolId);
    if (res.status === 200) {
      this.setCurrentSymbol(res.data);
    }
  };

  @action
  setCurrentSymbol = data => {
    this.currentSymbol = data;
  };

  //
  @observable
  symbolTypeList = [
    {
      id: 0,
      category: SELF,
      symbol_type_code: SELF,
      symbol_type_name: "自选",
    }
  ];

  @action
  loadSymbolTypeList = async () => {
    const typeList = await this.fetchSymbolTypeList();

    this.setSymbolTypeLoad(typeList);
  };

  @action
  setSymbolTypeLoad = typeList => {
    let { symbolTypeList, } = this;
    if (symbolTypeList.length > 1) {
      const deletCount = symbolTypeList.length - 1;
      symbolTypeList.splice(1, deletCount);
    }

    for (let type of typeList) {
      const newType = this.createSymbolTypeItem(type);
      symbolTypeList.push(newType);
    }

    this.symbolTypeList = [...symbolTypeList];
  };

  createSymbolTypeItem = (type = {}) => {
    const tmp = {
      id: -1,
      symbol_type_code: "",
      symbol_type_name: "",
      category: NONE,
    };

    return {
      ...tmp,
      ...type,
    };
  };

  createSymbolList(list: any, symbol_type_code: string): ISymbolItem[] {
    return list.map((item, i) => {
      const { trader_status, product_details, symbol_display, } = item;
      const {
        name,
        profit_currency_display,
        max_lots,
        purchase_fee,
        contract_size,
        margin_currency_display,
        min_lots,
        selling_fee,
      } = symbol_display;

      const contractInfo: IContractInfo = {
        purchase_fee,
        selling_fee,
        contract_size,
        profit_currency_display,
        margin_currency_display,
        min_lots,
        max_lots,
      };
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
      const symbolId = symbol_type_code === SELF ? item.symbol : item.id;
      const symbolKey = `${symbolId}-${name}`;
      return {
        symbol_type_code,
        symbolKey,
        symbolCode,
        symbolId,
        name,
        trader_status,
        priceInfo,
        contractInfo,
      };
    });
  }

  @observable
  symbolListStatus = {
    page: 1,
    nextPage: -1,
    dataLoading: false,
    error: false,
  };

  getSymbolNextPage = (count, current_page, page_size) => {
    const nextPage =
      count - current_page * page_size > 0 ? current_page + 1 : -1;
    return nextPage;
  };

  @action
  setSymbolListStatus = d => {
    this.symbolListStatus = {
      ...this.symbolListStatus,
      ...d,
    };
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

  @computed
  get allProductListId() {
    const { results, } = this.currentSymbolList;
    return results.map(item => {
      return item.symbolId;
    });
  }

  @action
  updateCurrentSymbolList(updateList) {
    const { results, } = this.currentSymbolList;
    updateList.forEach(uItem => {
      const selectedItem = results.filter(cItem => {
        const { priceInfo, } = cItem;
        return (
          uItem.symbol === cItem.symbolCode &&
          priceInfo.timestamp < uItem.timestamp
        );
      });

      if (selectedItem.length === 0) return;
      let { priceInfo, } = selectedItem[0];

      selectedItem[0].priceInfo = {
        ...priceInfo,
        ...uItem,
      };
    });
  }

  // cancelTrackCurrentSymbolType = autorun(async () => {
  //   // const {
  //   //   id,
  //   //   symbol_type_name,
  //   //   page,
  //   //   page_size,
  //   //   action
  //   // } = this.currentSymbolType;
  //   // if (!this.isInit) return;
  //   // if (action === REFRESH) {
  //   //   this.setOpenSymbol(-1);
  //   // }
  //   // let tmpList = this.originCurrentListInit();
  //   // switch (id) {
  //   //   case 0:
  //   //     tmpList = await this.fetchSelfSelectSymbolList(page, page_size);
  //   //     break;
  //   //   default:
  //   //     tmpList = await this.fetchSymbolList(page, page_size, symbol_type_name);
  //   //     break;
  //   // }
  //   // tmpList.symbol_type_name = symbol_type_name;
  //   // this.originCurrentList =
  //   //   this.originCurrentList.symbol_type_name === symbol_type_name &&
  //   //   action === SCROLL
  //   //     ? this.mergeSymbolList(tmpList, this.originCurrentList)
  //   //     : tmpList;
  //   // const { count } = this.originCurrentList;
  //   // const status = this.getSymbolPageStatus(count, page, page_size);
  //   // const symbolList = this.createSymbolList(this.originCurrentList.results);
  //   // this.setCurrentSymbolList({
  //   //   status,
  //   //   symbolList
  //   // });
  // });

  @observable
  toastMsg = {
    isRefresh: false,
    text: "",
  };
  @action
  setToastMsg = d => {
    this.toastMsg = {
      ...d,
    };
  };
  @action
  async deleteSelfSelectSymbolList(symbolId, name) {
    const d = {
      data: {
        symbol: [symbolId],
      },
    };
    const res = await this.$api.market.deleteSelfSelectSymbolList(d);
    if (res.status == 204) {
      this.setToastMsg({ isRefresh: true, text: `${name}成功移除自选`, });
    }
  }

  @action
  async addSelfSelectSymbolList(symbolId, name) {
    const d = {
      symbol: [symbolId],
    };
    const res = await this.$api.market.addSelfSelectSymbolList(d);
    if (res.status === 201) {
      this.setToastMsg({ isRefresh: true, text: `${name}成功添加到自选`, });
    }
  }

  @observable
  openSymbol = {
    id: -1,
    detail: null,
  };

  @action
  setOpenSymbol(id) {
    const detail = this.getOpenSymbolDetail(id);

    this.openSymbol = {
      id,
      detail,
    };
  }

  @computed
  get getNowSymbolDetail() {
    return toJS(this.openSymbol.detail);
  }

  @computed
  get getCurrentList() {
    return toJS(this.currentSymbolList.results);
  }

  getOpenSymbolDetail(id) {
    const ret = this.currentSymbolList.results.filter(item => {
      return item.id === id;
    });

    if (ret.length === 0) return null;

    return toJS(ret[0]);
  }

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

  @action
  async fetchSymbolTypeList() {
    const res = await api.market.getSymbolTypeList({});

    if (res.status == 200) {
      return res.data.results;
    }
  }
}

export default new ProductStore();
