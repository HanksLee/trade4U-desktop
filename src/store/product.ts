import api from "services";
import { action, observable, computed } from "mobx";
import BaseStore from "store/base";
import { SELF } from "pages/Symbol/config/symbolTypeCategory";

class ProductStore extends BaseStore {
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

  @computed
  get currentSymbolContractInfo() {
    const { symbol_display = {}, } = this.currentSymbol;
    const {
      purchase_fee,
      selling_fee,
      contract_size,
      profit_currency_display,
      margin_currency_display,
      min_lots,
      max_lots,
    } = symbol_display;
    
    return {
      purchase_fee,
      selling_fee,
      contract_size,
      profit_currency_display,
      margin_currency_display,
      min_lots,
      max_lots,
    };
  }

  initSymbolTypeItem = (
    id = -1,
    category = "",
    symbol_type_code = "",
    symbol_type_name = ""
  ) => {
    return {
      id,
      category,
      symbol_type_code,
      symbol_type_name,
    };
  };
  @observable
  currentSymbolTypeItem = this.initSymbolTypeItem();

  @action
  setCurrentSymbolTypeItem = id => {
    const { symbolTypeList, } = this;
    const tmp = symbolTypeList.filter(type => {
      return type.id === id;
    });
    const current = tmp.length === 0 ? this.initSymbolTypeItem() : tmp[0];

    this.currentSymbolTypeItem = current;
  };

  @observable
  symbolTypeList = [this.initSymbolTypeItem(0, SELF, SELF, "自选")];

  @action
  loadSymbolTypeList = async () => {
    const typeList = await this.fetchSymbolTypeList();

    this.setSymbolTypeLoad(typeList);
  };

  @action
  setSymbolTypeLoad = typeList => {
    let { symbolTypeList, } = this;
    if (symbolTypeList.length > 1) {
      const deleteCount = symbolTypeList.length - 1;
      symbolTypeList.splice(1, deleteCount);
    }

    for (let type of typeList) {
      const { id, category, symbol_type_code, symbol_type_name, } = type;
      const newType = this.initSymbolTypeItem(
        id,
        category,
        symbol_type_code,
        symbol_type_name
      );
      symbolTypeList.push(newType);
    }

    this.symbolTypeList = [...symbolTypeList];
  };

  @observable
  isOpenNewOrderForm = false;
  @action
  setOpenNewOrderForm = ()=>{
    this.isOpenNewOrderForm = true;
  }
  @action
  setCloseNewOrderForm = ()=>{
    this.isOpenNewOrderForm = false;
  }
  
  // @computed
  // get allProductListId() {
  //   const { results } = this.currentSymbolList;
  //   return results.map(item => {
  //     return item.symbolId;
  //   });
  // }

  // @action
  // updateCurrentSymbolList(updateList) {
  //   const { results } = this.currentSymbolList;
  //   updateList.forEach(uItem => {
  //     const selectedItem = results.filter(cItem => {
  //       const { priceInfo } = cItem;
  //       return (
  //         uItem.symbol === cItem.symbolCode &&
  //         priceInfo.timestamp < uItem.timestamp
  //       );
  //     });

  //     if (selectedItem.length === 0) return;
  //     let { priceInfo } = selectedItem[0];

  //     selectedItem[0].priceInfo = {
  //       ...priceInfo,
  //       ...uItem
  //     };
  //   });
  // }

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


  

  @action
  async fetchSymbolTypeList() {
    const res = await api.market.getSymbolTypeList({});

    if (res.status == 200) {
      return res.data.results;
    }
  }
}

export default new ProductStore();
