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
    // const res = await this.$api.common.getUserInfo({params});
    // this.userInfo = res.data;
    // 获取用户信息后设置 cookie
    // if (!Cookies.get('uid')) {
    //   Cookies.set('uid', this.userInfo.uid);
    // }

    const key = Cookies.get('yp-webapp-jwt-token') || '';

    if (key) {
      const userInfo = jwtDecode(key);
      let empName = userInfo.empName.split(' - ');
      userInfo.name = empName[0];
      userInfo.department = empName[1];
      this.userInfo = userInfo;
      return true;
    } else {
      return false;
    }
  }

  @observable
  currentTab = '个股';
  @action
  setCurrentTab = tab => {
    this.currentTab = tab;
  }
}

export default new CommonStore();