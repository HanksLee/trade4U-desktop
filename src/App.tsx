import * as React from 'react';
import store from 'store';
import Index from 'pages/Index';
import Login from 'pages/Login';
import utils from 'utils';
import zhCN from 'antd/es/locale/zh_CN';
import { Alert } from 'antd';
import { BaseReact } from 'components/@shared/BaseReact';
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { Provider } from 'mobx-react';
import { hot } from 'react-hot-loader/root';
import './app.scss';

const isProd = process.env.NODE_ENV === 'production';
(window as any).$origin = `${window.location.origin}${isProd ? '' : '/#'}`;

const basename = '/';
const Router: any = !isProd
  ? HashRouter
  : BrowserRouter;

class App extends BaseReact {
  state = {
    token: undefined,
  }

  async componentDidMount() {
    this.init();
  }

  private init = async (): Promise<any> => {
    // @todo 一进入页面调起获取用户信息接口
    const token = utils.getLStorage('MOON_DESKTOP_TOKEN');
    this.setState({ token, });
  }

  render() {
    const { token, } = this.state;

    return (
      <Alert.ErrorBoundary>
        <Provider {...store}>
          <ConfigProvider locale={zhCN}>
            <Router>
              <Switch>
                <Route exact path="/">
                  {!!token ? (
                    <Redirect to="/dashboard" />
                  ) : (
                    <Redirect to="/login" />
                  )}
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
          </ConfigProvider>
        </Provider>
      </Alert.ErrorBoundary>
    );
  }
}

export default hot(App);