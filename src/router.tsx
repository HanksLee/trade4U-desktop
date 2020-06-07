import * as React from 'react';
import loadable from '@loadable/component';

/**
 * @description 按需加载页面级别组件
 */
const routes: any[] = [
  {
    component: loadable(() => import(/* webpackChunkName: "symbol" */ './pages/Symbol')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "captial" */ './pages/Captial')),
  },
  {
    component: loadable(() => import(/* webpackChunkName: "market" */ './pages/Market')),
  }
];

export default function AppRouter(props) {
  return (
    <>
      {routes.map((route, index) => <route.component key={index} />)}
    </>
  );
}