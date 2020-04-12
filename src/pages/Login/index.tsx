import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import WithRoute from 'components/@shared/WithRoute';
import './index.scss';

export interface ILoginProps {

}

export interface ILoginState {
  loginUrl: string;
}
/* eslint new-cap: "off" */
@WithRoute('/login')
export default class Login extends BaseReact<ILoginProps, ILoginState> {

  state = {
    loginUrl: '',
  }
  async componentDidMount() {
  }


  render() {
    return (
      <div className='login'>
        <div className='form-wrapper'>
          <h1 className='brand'>
            {/* <img src={login} alt="logo" /> */}
          </h1>
          <div className='form'>
            <h2>登录</h2>
          </div>
        </div>

      </div>
    );
  }
}
