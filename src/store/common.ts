import { computed, action, observable } from 'mobx';
import BaseStore from 'store/base';
import Cookies from 'js-cookie';
import { PAGE_ROUTES } from 'constant';
import jwtDecode from 'jwt-decode';

class CommonStore extends BaseStore {
  // 股票涨跌颜色模式，1-绿涨红跌 2-红涨绿跌
  @observable
  stockColorMode = 1;
  @action
  setStockColorMode = mode => {
    this.stockColorMode = mode;
  }
  @observable
  paginationConfig = {
    defaultCurrent: 1,
    showSizeChanger: true,
    showQuickJumper: true,
    defaultPageSize: 10,
    showTotal: (total, range) => `共 ${total} 条`,
    pageSizeOptions: ['10', '20', '30', '40', '50'],
  }

  @observable
  userInfo: any = {}

  @observable
  sidebar: any[] = PAGE_ROUTES;

  @computed
  get computedSidebar() {
    return this.sidebar;
  }

  @action
  getUserInfo = async (params) => {
    const res = await this.$api.common.getUserInfo({ params, });
    this.setUserInfo(res.data, true);
  }
  @action
  setUserInfo = (userInfo, overwrite = false) => {
    if (overwrite) {
      this.userInfo = userInfo;
    } else {
      this.userInfo = {
        ...this.userInfo,
        ...userInfo,
      };
    }
  }
  @computed
  get computedUserInfo() {
    const obj: any = {};

    // 计算用户审核状态
    // 0-未完善资料，或审核资料失败
    // 1-资料审核中
    // 2-资料审核通过，但未入金
    // 3-已入金，可进行交易
    const {
      inspect_status,
      recharge_status,
    } = this.userInfo;
    if (inspect_status == 0 || inspect_status == 3) {
      obj.user_status = 0;
    } else if (inspect_status == 1) {
      obj.user_status = 1;
    } else if (inspect_status == 2 && recharge_status == 0) {
      obj.user_status = 2;
    } else if (inspect_status == 2 && recharge_status == 1) {
      obj.user_status = 3;
    } else {
      obj.user_status = -1;
    }

    return {
      ...this.userInfo,
      ...obj,
    };
  }
  @observable
  currentTab = '个股';
  @action
  setCurrentTab = tab => {
    this.currentTab = tab;
  }
  @observable
  settingsModalVisible = false;
  @action
  toggleSettingsModalVisible = () => {
    this.settingsModalVisible = !this.settingsModalVisible;
  }
  @observable
  guideModalVisible = false;
  @action
  toggleGuideModalVisible = () => {
    this.guideModalVisible = !this.guideModalVisible;
  }

}

export default new CommonStore();