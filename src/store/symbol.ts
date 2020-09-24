import { action, observable, computed, toJS } from "mobx";
import BaseStore from "store/base";
import { SELF } from "pages/Symbol/config/symbolTypeCategory";
import {
  ISymbolItem,
  IContractInfo,
  IPriceInfo
} from "pages/Symbol/config/interface";

class SymbolStore extends BaseStore {
  @observable
  currentSymbolType = {
    id: -1,
    category: "",
    symbol_type_code: "",
    symbol_type_name: "",
  };

  @action
  setCurrentSymbolType = d => {
    const s = JSON.stringify(d);
    const o = JSON.parse(s);
    this.currentSymbolType = {
      ...o,
    };
  };

  @observable
  currentSymbol = null;

  @action
  setCurrentSymbol = d => {
    let info = d === null ? this.creatNULLSymbol() : d;
    this.currentSymbol = {
      ...info,
    };
  };

  creatNULLSymbol = (): ISymbolItem => {
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
    const contractInfo: IContractInfo = {
      purchase_fee: 0,
      selling_fee: 0,
      contract_size: 0,
      profit_currency_display: 0,
      margin_currency_display: 0,
      min_lots: 0,
      max_lots: 0,
    };

    return {
      symbolCode: "-----",
      symbolId: -1,
      symbolKey: "-----",
      symbol_type_code: "",
      name: "-----",
      trader_status: "closed",
      priceInfo,
      contractInfo,
    };
  };

  @computed
  get getTrendInfo() {
    const { name, trader_status, priceInfo, symbolId, } = this.currentSymbol;
    const { chg, change, sell, } = priceInfo;
    return {
      symbolId,
      name,
      trader_status,
      chg,
      change,
      sell,
    };
  }
  @observable
  currentTransactionSymbol = {
    mode: "",
    data: null,
  };

  @action
  setCurrentTransactionSymbol = d => {
    this.currentTransactionSymbol = {
      ...this.currentTransactionSymbol,
    };
  };
}

export default new SymbolStore();
