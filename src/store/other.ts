import api from "services";
import { action, observable, computed, autorun, toJS, runInAction } from "mobx";
import BaseStore from "store/base";
import { SELF, NONE } from "pages/Symbol/Left/config/channelConfig";
import { REFRESH, SCROLL } from "pages/Symbol/Left/config/symbolTypeStatus";
import moment from "moment";
import { IContractInfo, IPriceInfo } from "pages/Symbol/config/interface";

class OtherStore extends BaseStore {
  
}

export default new OtherStore();
