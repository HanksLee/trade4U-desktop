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

export const COMPONENT_ROUTES = {

};

export default {
};