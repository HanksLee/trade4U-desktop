import marketSVG from 'assets/img/market.svg';
import marketActiveSVG from 'assets/img/market-active.svg';
import symbolSVG from 'assets/img/symbol.svg';
import symbolActiveSVG from 'assets/img/symbol-active.svg';
import capitalSVG from 'assets/img/capital.svg';
import capitalActiveSVG from 'assets/img/capital-active.svg';
import subscribeSVG from 'assets/img/subscribe.svg';
import subscribeActiveSVG from 'assets/img/subscribe-active.svg';
import newsSVG from 'assets/img/news.svg';
import newsActiveSVG from 'assets/img/news-active.svg';

export const FORMAT_TIME = 'YYYY.MM.DD HH:mm:ss';

export const STOCK_COLOR_MAP = {
  // 绿涨红跌
  1: {
    up: 'stock-green',
    down: 'stock-red',
    balance: 'stock-white',
  },
  2: {
    up: 'stock-red',
    down: 'stock-green',
    balance: 'stock-white',
  },
};

export const STOCK_COLOR_GIF_MAP = {
  // 绿涨红跌
  1: {
    up: 'stock-green-gif',
    down: 'stock-red-gif',
    balance: '',
  },
  2: {
    up: 'stock-red-gif',
    down: 'stock-green-gif',
    balance: '',
  },
};

export const PAGE_ROUTES = [
  {
    title: '产品',
    path: '/dashboard/symbol',
    isShow:'',
    icon: symbolSVG,
    activeIcon: symbolActiveSVG,
  },
  // {
  //   title: '行情',
  //   path: '/dashboard/market',
  //   icon: marketSVG,
  //   activeIcon: marketActiveSVG,
  // },
  {
    title: '资金',
    path: '/dashboard/captial',
    isShow:'',
    icon: capitalSVG,
    activeIcon: capitalActiveSVG,
  },
  {
    title: '申購',
    path: '/dashboard/subscribe',
    isShow:'function_ipo',
    icon: subscribeSVG,
    activeIcon: subscribeActiveSVG,
  },
  {
    title: '新聞',
    path: '/dashboard/news',
    isShow:'function_news',
    icon: newsSVG,
    activeIcon: newsActiveSVG,
  }
];

export const SUBMENU_ROUTES = [
  '/dashboard/customer',
  '/dashboard/activity'
];

export const traderStatusMap = {
  in_transaction: '交易中',
  closed: '休市中',
};

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

// export const tradeTypeOptions = [
//   {
//     id: '1',
//     name: '立即执行',
//     color: '',
//   },
//   {
//     id: '2',
//     name: 'Buy Limit',
//     color: 'p-up',
//   },
//   {
//     id: '3',
//     name: 'Sell Limit',
//     color: 'p-down',
//   },
//   {
//     id: '4',
//     name: 'Buy Stop',
//     color: 'p-up',
//   },
//   {
//     id: '5',
//     name: 'Sell Stop',
//     color: 'p-down',
//   }
// ];

export const tradeTypeOptions = [
  {
    id: 'instance',
    name: '立即执行',
    color: '',
  },
  {
    id: 'future',
    name: '挂单',
    color: '',
  }
];

export const tradeFutureTypeOptions = [
  {
    id: '2',
    name: 'Buy Limit',
  },
  {
    id: '3',
    name: 'Sell Limit',
  },
  {
    id: '4',
    name: 'Buy Stop',
  },
  {
    id: '5',
    name: 'Sell Stop',
  }];

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

export const supportedResolution = ['1', '5', '15', '30', '60', '240', '1D', '7D'];


export const PAGE_SIZE = 20;