export const FORMAT_TIME = 'YYYY.MM.DD HH:mm:ss';

export const PAGE_ROUTES = [
  {
    title: '个股',
    path: '/dashboard/symbol',
    icon: 'coffee',
  },
  {
    title: '行情',
    path: '/dashboard/market',
    icon: 'appstore',
  },
  {
    title: '资金',
    path: '/dashboard/captial',
    icon: 'team',
  }
];

export const SUBMENU_ROUTES = [
  '/dashboard/customer',
  '/dashboard/activity'
];

export const symbolMarkets = [{
  id: 0,
  title: '全部',
}, {
  id: 1,
  title: '港股',
}, {
  id: 2,
  title: '美股',
}, {
  id: 3,
  title: '沪深',
}];

export const actionsType = [
  {
    id: 'add',
    title: '添加',
  },
  {
    id: 'close',
    title: '平仓',
  },
  {
    id: 'update',
    title: '修改',
  },
  {
    id: 'delete',
    title: '删除',
  }
];

export const tradeTypeOptions = [
  {
    id: '1',
    name: '立即执行',
    color: '',
  },
  {
    id: '2',
    name: 'Buy Limit',
    color: 'p-up',
  },
  {
    id: '3',
    name: 'Sell Limit',
    color: 'p-down',
  },
  {
    id: '4',
    name: 'Buy Stop',
    color: 'p-up',
  },
  {
    id: '5',
    name: 'Sell Stop',
    color: 'p-down',
  }
];

export const tradeActionMap = {
  0: 'buy',
  1: 'sell',
  2: 'buy limit',
  3: 'sell limit',
  4: 'buy stop',
  5: 'sell stop',
};

export const COMPONENT_ROUTES = {

};

export default {
};