import api from "services";
import { action, observable, computed, autorun, toJS, runInAction } from "mobx";
import BaseStore from "store/base";
import { SELF, NONE } from "pages/Symbol/Left/config/channelConfig";
import { REFRESH, SCROLL } from "pages/Symbol/Left/config/symbolTypeStatus";
import moment from "moment";

class OtherStore extends BaseStore {
  @observable
  topScreen = {
    type: null,
    data:null,
  };

  @action
  setTopScreen = (now)=>{
    this.topScreen = {
      ...now,
    };
  }


  @observable
  productInfo = {
    name: "----",
    chg: 0,
    change: 0,
    sell: 0,
  }

  @action
  setProductInfo = (d)=>{
    this.productInfo = {
      ...this.productInfo,
      ...d,
    };
  }

  @observable
  mainInfo={
    high:0,
    low:0,
    close:0,
    open:0,
    volume:0,
    max_trading_volume:0
  }

  @action
  setMainInfo = d => {
    this.mainInfo = {
      ...this.mainInfo,
      ...d,
    };
  };
}

export default new OtherStore();
