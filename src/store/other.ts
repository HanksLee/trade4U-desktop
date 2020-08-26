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
  detail = null;

  @action
  setDetail = d => {
    this.detail = {
      ...d,
    };
  };

  @action
  clearDetail = () => {
    this.detail = null;
  };

  @observable
  buy = null;
  @action
  setBuy = d => {
    this.buy = {
      ...d,
    };
  };

  @action
  clearBuy = () => {
    this.buy = null;
  };
}

export default new OtherStore();
