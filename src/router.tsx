import * as React from 'react';
import loadable from '@loadable/component';

/**
 * @description 按需加载页面级别组件
 */
const routes: any[] = [
  {
    component: loadable(() => import(/* webpackChunkName: "symbol" */ './pages/Symbol')),
  },
];

export default function AppRouter(props) {
  return (
    <>
      {routes.map((route, index) => <route.component key={index} />)}
    </>
  );
}