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
  }

  render() {
    return (
      <Provider {...store}>
        <Router>
          <Switch>
            <Route exact path="/">
              {true ? (
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
      </Provider>
    );
  }
}

export default hot(App);