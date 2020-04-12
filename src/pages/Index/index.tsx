import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import AppRouter from '../../router';
import { Layout, Menu, Icon, Tag, Input } from 'antd';
import UserDropdown from 'components/UserDropdown';
import { PAGE_ROUTES, SUBMENU_ROUTES } from 'constant';
import { withRouter } from "react-router-dom";
import './index.scss';
import { inject, observer } from 'mobx-react';


const { Header, Sider, Content, } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

export interface IIndexProps {

}

export interface IIndexState {
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
  showContainer: boolean;
}

// 用于计算出侧边栏的展开路径的数组
function computedPathLevel(path: string) {
  let
    pathElems = path.split('/').slice(1),
    total = '',
    ret = [];

  for (var i = 0; i < pathElems.length; i++) {
    total += '/' + pathElems[i];
    ret.push(total);
  }

  return ret;
}

function exactFromSidebarPath(pathlist) {
  const list = [];

  function walk(pathlist) {
    pathlist.forEach(item => {
      list.push(item.path);

      if (item.children instanceof Array) {
        walk(item.children);
      }
    });
  }

  walk(pathlist);
  return list;
}

/* eslint new-cap: "off" */
// @ts-ignore
@withRouter
@inject('common')
@observer
export default class Index extends BaseReact<IIndexProps, IIndexState> {
  // 保存折叠前展开的subMenu
  preOpenKeys = [];
  state = {
    collapsed: false,
    openKeys: [],
    selectedKeys: [],
    showContainer: true,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { pathname, },
    } = nextProps;

    const pathlist = exactFromSidebarPath(PAGE_ROUTES);
    let selectedKeys = [];
    pathlist.forEach(item => {
      if (pathname.split('/').slice(0, 5).join('/').indexOf(item) >= 0) {
        selectedKeys = [item];
      }
    });

    return {
      selectedKeys,
    };
  }

  async componentDidMount() {
    const {
      location: { pathname, },
    } = this.props;
    // openKeys初始化
    const allPaths = computedPathLevel(pathname);
    const openKeys = SUBMENU_ROUTES.filter((item) => allPaths.includes(item));

    this.setState({ openKeys, });
  }

  toggle = () => {
    // 收起菜单时openKeys置空，保存之前展开的子项，展开菜单时，恢复子项
    const { collapsed, openKeys, } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
    if (!collapsed) {
      this.preOpenKeys = openKeys;
      this.setState({
        openKeys: [],
      });
    } else {
      this.setState({
        openKeys: this.preOpenKeys,
      });
    }
  }

  onMenuItemClick = (item) => {
    // 选中菜单子项后收起其他展开的所有菜单
    if (item.keyPath.length > 1) {
      this.setState({
        openKeys: [item.keyPath[1]],
      });
    }
    this.props.history.push(item.key);
  }

  onOpenChange = (openKeys) => {
    this.setState({ openKeys, });
  }

  renderMenu = (): JSX.Element => {
    const { selectedKeys, openKeys, } = this.state;
    const { computedSidebar, } = this.props.common;

    return (
      <Menu
        theme="dark"
        mode="inline"
        openKeys={openKeys}
        onOpenChange={this.onOpenChange}
        onClick={this.onMenuItemClick}
        selectedKeys={selectedKeys}
      >
        {computedSidebar.map(route => this.renderMenuItem(route))}
      </Menu>
    );
  }


  renderMenuItem = (route: any): JSX.Element => {
    if (route.children && route.children.length > 0) {
      return (
        <SubMenu key={route.path} title={
          <span>
            <Icon type={route.icon} />
            <span>{route.title}</span>
          </span>
        } >
          {route.children.map(subRoute => this.renderMenuItem(subRoute))}
        </SubMenu>
      );
    }

    return (
      <MenuItem key={route.path}>
        <Icon type={route.icon} />
        <span>{route.title}</span>
      </MenuItem>
    );
  }

  render() {
    const { showContainer, } = this.state;
    const { location, } = this.props;

    return (
      <Layout className='layout'>
        {
          showContainer && (
            <Header className='header'>
              <Input placeholder={'输入交易品种进行搜索'} style={{width: 200, marginLeft: 30}}/>
              <h2>MetaTrader 4</h2>
              <p className='header-right'>
                <span>消息</span>
                <span>设定</span>
              </p>
            </Header>
          )
        }

        <Layout>
          {
            // 响应式布局
            showContainer && (
              <Sider
                breakpoint="sm"
                onBreakpoint={broken => {
                  if (broken) {
                    this.setState({ collapsed: true, });
                  }
                }}
                onCollapse={(collapsed, type) => {
                  if (type === 'responsive' && collapsed === false) {
                    this.setState({ collapsed: false, });
                  }
                  if (type === 'clickTrigger') {
                    if (collapsed === false) {
                      this.setState({ collapsed: false, });
                    } else {
                      this.setState({ collapsed: true, });
                    }
                  }
                }}
                // collapsible
                collapsed={this.state.collapsed}
              >
                {this.renderMenu()}
              </Sider>
            )
          }
          <Layout style={{ padding: '0 24px 24px' }}>
            <Content
              className='content'
            >
              {
                (location.pathname === '/dashboard' || location.pathname === '/dashboard/')
                  ? (
                    <p style={{ fontSize: 30, fontWeight: 500, margin: 20, }}>Welcome to WeTrade 桌面端</p>
                  ) : null
              }
              <AppRouter />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}
