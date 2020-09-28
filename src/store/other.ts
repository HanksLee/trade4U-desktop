import api from "services";
import { action, observable, computed, autorun, toJS, runInAction } from "mobx";
import BaseStore from "store/base";
import { SELF, NONE } from "pages/Symbol/Left/config/channelConfig";
import { REFRESH, SCROLL } from "pages/Symbol/Left/config/symbolTypeStatus";
import moment from "moment";
import { IContractInfo, IPriceInfo } from "pages/Symbol/config/interface";

class OtherStore extends BaseStore {
  @observable
  topScreen = {
    type: null,
    data: null,
  };

  @action
  setTopScreen = now => {
    this.topScreen = {
      ...now,
    };
  };

  @observable
  productInfo = {
    name: "----",
    chg: 0,
    change: 0,
    sell: 0,
  };

  @action
  setProductInfo = d => {
    this.productInfo = {
      ...this.productInfo,
      ...d,
    };
  };

  @observable
  mainInfo = {
    high: 0,
    low: 0,
    close: 0,
    open: 0,
    volume: 0,
    max_trading_volume: 0,
  };

  @action
  setMainInfo = d => {
    this.mainInfo = {
      ...this.mainInfo,
      ...d,
    };
  };

  @observable
  headerInfo = {
    symbolId: -1,
    name: "-----",
    change: 0,
    chg: 0,
    sell: 0,
  };
  @action
  setHeaderInfo = d => {
    this.headerInfo = {
      ...d,
    };
  };

  @observable
  priceInfo: IPriceInfo = {
    symbol: "----",
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

  @action
  setPriceInfo = d => {
    this.priceInfo = {
      ...d,
    };
  };

  @observable
  contractInfo: IContractInfo = {
    purchase_fee: 0,
    selling_fee: 0,
    contract_size: 0,
    profit_currency_display: 0,
    margin_currency_display: 0,
    min_lots: 0,
    max_lots: 0,
  };

  @action
  fetchContractInfo = async symbolId => {
    const res = await api.market.getCurrentSymbol(symbolId);

    if (res.status === 200) {
      this.setContractInfo(res.data);
    }
  };

  @action
  setContractInfo = d => {
    const {
      purchase_fee,
      selling_fee,
      contract_size,
      profit_currency_display,
      margin_currency_display,
      min_lots,
      max_lots,
    } = d.symbol_display;
    this.contractInfo = {
      purchase_fee,
      selling_fee,
      contract_size,
      profit_currency_display,
      margin_currency_display,
      min_lots,
      max_lots,
    };
  };
}

export default new OtherStore();
