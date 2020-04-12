import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Menu, Dropdown, Icon } from 'antd';
import logo from 'assets/img/logo.png';
import Cookies from 'js-cookie';
import './index.scss';
import { inject, observer } from 'mobx-react';

export interface IUserDropdownProps {
  onBtnClick?(): void;
}

export interface IUserDropdownState {
  logo: string;
}

@inject('common')
@observer
export default class UserDropdown extends BaseReact<IUserDropdownProps, IUserDropdownState> {
  state = {
    logo: '',
  }

  private logout = async (): Promise<any> => {
    // @todo 登出需要os系统也清除登录状态
    Cookies.remove('uid');
    // Cookies.set('yp-webapp-jwt-token', '', { path: '/', domain: 'thejoyrun.com', expires: 0, });
    if (window.location.href.indexOf('neo.thejoyrun.com') < 0) {
      setTimeout(() => {
        (window as any).location.href = (window as any).$origin + '/login';
      }, 1000);
    } else {
      // setTimeout(() => {
      //   (window as any).location.href = `${ window.location.origin }/admin`;
      // }, 1000);
    }
  }

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>
          <a href={this.$origin + '/settings'}>
          设置
          </a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.logout}>
          登出
          </a>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { userInfo, } = this.props.common;

    return (
      <div className='user-dropdown'>
        <Dropdown overlay={this.renderMenu}>
          <div className='profile'>
            <img src={this.state.logo || logo } alt="logo"/>
            <div className='profile-info'>
              <h3>{userInfo.department}</h3>
              <p>{userInfo.name}</p>
            </div>
            <Icon type="down" />
          </div>
        </Dropdown>
      </div>
    );
  }
}