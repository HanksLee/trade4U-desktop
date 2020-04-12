import * as React from 'react';
import { Provider } from 'mobx-react';
import { BaseReact } from 'components/@shared/BaseReact';
import store from 'store';
import Index from 'pages/Index';
import Login from 'pages/Login';
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import './app.scss';

const isProd = process.env.NODE_ENV === 'production';
(window as any).$origin = `${window.location.origin}${isProd ? '' : '/#'}`;

const basename = '/';
const Router: any = !isProd
  ? HashRouter
  : BrowserRouter;

class App extends BaseReact {
  async componentDidMount() {
    this.iniRoute();
  }

  private iniRoute = async (): Promise<any> => {
    // @todo 一进入页面调起获取用户信息接口
    const isLogin = await this.$store.common.getUserInfo();

    if (isLogin || window.location.href.indexOf('neo.thejoyrun.com') < 0) {
      const redirect = [
        '/',
        '/login'
      ].map(p => (window as any).$origin + p);

      if (redirect.some(item => item === window.location.href)) {
        window.location.href = (window as any).$origin + '/dashboard';
      }
    } else {
      const redirectUrl = encodeURIComponent('https://neo.thejoyrun.com');
      (window as any).location.href = `https://os.thejoyrun.com/toLogin?redirect=${redirectUrl}#qrcode`;
    }

    // @todo
    // if (!uid) {
    //   if (redirect.some(item => item === location.href)) {
    //     window.location.href = (window as any).$origin + '/admin';
    //   }
    // } else {
    //   window.location.href = (window as any).$origin + '/login';
    // }
  }

  render() {
    return (
      <Provider {...store}>
        <Router>
          <Switch>
            <Route exact path="/">
              {/* {!!token ? (
                      <Redirect to="/dashboard" />
                    ) : (
                      <Redirect to="/login" />
                    )} */}
            </Route>
            <Route path="/dashboard">
              <Index />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route path="*">
              <div>404</div>
            </Route>
          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default hot(App);