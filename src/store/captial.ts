import api from 'services';
import { action, observable, computed } from "mobx";
import BaseStore from "store/base";

class MarketStore extends BaseStore {
  @observable
  currentCaptialTab = "deposit";

  @action
  setCurrentTab(currentCaptialTab) {
    this.currentCaptialTab = currentCaptialTab;
  }

}

export default new MarketStore();