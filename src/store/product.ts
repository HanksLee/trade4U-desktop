import api from "services";
import { action, observable, computed, autorun, toJS } from "mobx";
import BaseStore from "store/base";
import { SELF, NONE } from "pages/Symbol/Left/config/channelConfig";
import {
  REFRESH,
  SCROLL,
  SCROLL_DOWN
} from "pages/Symbol/Left/config/symbolTypeStatus";

class ProductStore extends BaseStore {
  isInit = false;
  
  setInit =()=>{
    this.isInit = true;
  };

  @observable
  symbolTypeList = [
    {
      id: 0,
      category: SELF,
      symbol_type_code: "SELF",
      symbol_type_name: "自选",
      page: 1,
      page_size: 20,
      cmd: REFRESH,
    }
  ];

  @action
  async fetchSymbolTypeList() {
    const res = await api.market.getSymbolTypeList({});

    if (res.status == 200) {
      return res.data.results;
    }
  }

  @action
  async fetchSymbolTypeLoad() {
    //const selfList = await this.fetchSelfSelectSymbolList(page, page_size, "");
    const typeList = await this.fetchSymbolTypeList();

    this.setSymbolTypeLoad(typeList);
    this.setCurrentId(this.symbolTypeList[0]);
  }

  
  @action
  setSymbolTypeLoad(typeList) {
    let { symbolTypeList, } = this;
    if (symbolTypeList.length > 1) {
      const deletCount = symbolTypeList.length - 1;
      symbolTypeList.splice(1, deletCount);
    }

    typeList.map(type => {
      type.category = NONE;
      const newType = this.createSymbolTypeItem(type);
      symbolTypeList.push(newType);
    });
  }

  createSymbolTypeItem(type = {}) {
    const tmp = {
      id: -1,
      symbol_type_code: "",
      symbol_type_name: "",
      category: "",
      page: 1,
      page_size: 20,
      cmd: REFRESH,
    };

    return {
      ...tmp,
      ...type,
    };
  }

  selfSelectSymbolList = [];
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
  async setSelfSelectSymbolList(page: number, page_size: number) {
    const list = await this.fetchSelfSelectSymbolList(page, page_size);
    // this.selfSelectSymbolList = this.createSymbolList(list);
  }

  checkSymbolPageStatua(count, current_page, page_size) {
    const hasMore = count - current_page * page_size > 0;
    const dataLoading = true;
    const error = false;
    return {
      hasMore,
      dataLoading,
      error,
    };
  }

  createSymbolList(list) {
    return list.map((item, i) => {
      const {
        id,
        name,
        spread,
        decimals_place,
        spread_mode_display,
        profit_currency_display,
        max_lots,
        purchase_fee,
        contract_size,
        margin_currency_display,
        lots_step,
        min_lots,
        selling_fee,
      } = item.symbol_display;
      const { trader_status, is_self_select, } = item;
      const { symbol_type_code, } = this.currentSymbolType;
      const deleteID = item.symbol;
      const addID = item.id;
      const nowRealID = is_self_select === 1 ? item.symbol : item.id;

      const { symbol, sell, buy, change, chg, } = item.product_details
        ? item.product_details
        : {
          symbol: "-----",
          sell: 0,
          buy: 0,
          change: 0,
          chg:0,
        };

      return {
        key: `${id}-${name}`,
        id: id,
        rowInfo: {
          id,
          name,
          spread,
          change,
          chg,
          sell,
          buy,
          symbol,
          deleteID,
          addID,
          nowRealID,
          symbol_type_code,
          trader_status,
        },
        detailInfo: {
          decimals_place,
          spread_mode_display,
          profit_currency_display,
          max_lots,
          purchase_fee,
          contract_size,
          margin_currency_display,
          lots_step,
          min_lots,
          selling_fee,
        },
      };
    });
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

  @observable
  currentSymbolType = {
    ...this.symbolTypeList[0],
  };

  @action
  setCurrentId(d) {
    const { id, page, cmd, } = d;
    const nowType = this.symbolTypeList.filter(item => {
      return item.id === id;
    })[0];
    if (page) nowType.page = page;
    
    this.currentSymbolType = {
      ...this.currentSymbolType,
      ...nowType,
      cmd,
    };
  }

  originCurrentList = this.originCurrentListInit();


  originCurrentListInit() {
    return {
      symbol_type_name: "",
      count: 0,
      page: 0,
      page_size: 0,
      current_page: 0,
      results: [],
    };
  }

  @observable
  currentList = {
    status:{
      hasMore: false,
      dataLoading: false,
      error: false,
    },
    symbolList: [],
  };

  @computed
  get allProductListId() {
    const { symbolList, } = this.currentList;
    return symbolList.map(item => {
      return item.rowInfo.addID;
    });
  }

  @action
  setCurrentSymbolList(d) {
    this.currentList = {
      ...this.currentList,
      ...d,
    };
  }


  creareSubscribeList(list) {
    return list.map(item => {
      return item.rowInfo.id;
    });
  }
  filterSubscribe(list, start, end) {
    return list.filter((item, i) => {
      return start >= i && end <= i;
    });
  }
  @action
  updateCurrentSymbolList(updateList) {
    updateList.forEach(uItem => {
      const selectedItem = this.originCurrentList.results.filter(cItem => {
        const { product_details, } = cItem;
        return (
          product_details &&
          uItem.symbol === product_details.symbol &&
          product_details.timestamp < uItem.timestamp
        );
      });

      if (selectedItem.length === 0) return;
      let { product_details, } = selectedItem[0];
      product_details = {
        ...product_details,
        ...uItem,
      };
      selectedItem[0].product_details = {
        ...product_details,
      };
    });

    const symbolList = this.createSymbolList(this.originCurrentList.results);
    this.setCurrentSymbolList({
      symbolList,
    });
  }

  cancelTrackCurrentSymbolType = autorun(async () => {
    const {
      id,
      symbol_type_name,
      page,
      page_size,
      cmd,
    } = this.currentSymbolType;

    if(!this.isInit)
      return;
    if(cmd === REFRESH) {
      this.setOpenSymbol(-1);
    }
    
    let tmpList = this.originCurrentListInit();


    switch (id) {
      case 0:
        tmpList = await this.fetchSelfSelectSymbolList(page, page_size);
        break;
      default:
        tmpList = await this.fetchSymbolList(page, page_size, symbol_type_name);
        break;
    }
    tmpList.symbol_type_name = symbol_type_name;

    this.originCurrentList =
      this.originCurrentList.symbol_type_name === symbol_type_name &&
      cmd === SCROLL
        ? this.mergeSymbolList(tmpList, this.originCurrentList)
        : tmpList;


    const { count, } = this.originCurrentList;
    const status = this.checkSymbolPageStatua(count, page, page_size);
    const symbolList = this.createSymbolList(this.originCurrentList.results);
    this.setCurrentSymbolList({
      status,
      symbolList,
    });
  });

  mergeSymbolList(newList, oldList) {
    const results = [...oldList.results, ...newList.results];

    return {
      ...newList,
      results,
    };
  }
  @action
  async deleteSelfSelectSymbolList(symbol) {
    const d = {
      data: {
        symbol: [symbol],
      },
    };
    const res = await this.$api.market.deleteSelfSelectSymbolList(d);
    if (res.status == 204) {
      return true;
    }
  }

  @observable
  openSymbol = {
    id:-1,
    detail:null,
  };

  @action
  setOpenSymbol(id) {
    const detail = this.getOpenSymbolDetail(id);

    this.openSymbol  = {
      id,
      detail,
    };
  }

  @computed
  get getNowSymbolDetail() {
    return toJS(this.openSymbol.detail);
  }
  @computed 
  get getCurrentList(){
    return toJS(this.currentList.symbolList);
  }

  getOpenSymbolDetail(id) {
    const ret = this.currentList.symbolList.filter((item)=>{
      return item.id === id;
    });

    if(ret.length === 0)
      return null;

    return toJS(ret[0]);
  }
}

export default new ProductStore();
