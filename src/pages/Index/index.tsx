import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import AppRouter from "../../router";
import { Layout, Menu, Icon, Input, Select } from "antd";
import { PAGE_ROUTES, SUBMENU_ROUTES } from "constant";
import { withRouter } from "react-router-dom";
import MessageModal from "components/MessageModal";
import SettingsModal from "components/SettingsModal";
import GuideModal from 'components/GuideModal';
// import messageIcon from "assets/img/message-icon.svg";
// import settingsIcon from "assets/img/settings-icon.svg";
// import MessageModal from "components/MessageModal";
// import SettingsModal from "components/SettingsModal";
import logoSVG from "assets/img/Trade4U Logo.svg";
import messageSVG from "assets/img/message.svg";
import settingsSVG from "assets/img/settings.svg";
import guideSVG from "assets/img/guide-icon.svg";
import serviceSVG from "assets/img/service.svg";
import logoutSVG from "assets/img/logout.svg";
import "./index.scss";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";
import debounce from "lodash/debounce";
import ws from "utils/ws";
import utils from "utils";
const { Header, Sider, Content, } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

export interface IIndexProps { }

export interface IIndexState {
  collapsed: boolean;
  selectedKeys: string[];
  openKeys: string[];
  showContainer: boolean;
  messageModalStatus: boolean;
  settingsModalStatus: boolean;
  currentTab: string;
  symbolOptions: any[];
}

// 用于计算出侧边栏的展开路径的数组
function computedPathLevel(path: string) {
  let pathElems = path.split("/").slice(1),
    total = "",
    ret = [];

  for (var i = 0; i < pathElems.length; i++) {
    total += "/" + pathElems[i];
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
@inject("common", "symbol")
@observer
export default class Index extends BaseReact<IIndexProps, IIndexState> {
  wsConnect = null;
  interval = null;
  // 保存折叠前展开的subMenu
  preOpenKeys = [];
  state = {
    collapsed: false,
    openKeys: [],
    selectedKeys: [],
    showContainer: true,
    symbolOptions: [],
    messageModalStatus: false,
    settingsModalStatus: false,
    currentTab: "个股",
  };

  constructor(props) {
    super(props);
    this.searchSymbol = debounce(this.searchSymbol, 500);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { pathname, },
    } = nextProps;

    const pathlist = exactFromSidebarPath(PAGE_ROUTES);
    let selectedKeys = [];
    pathlist.forEach(item => {
      if (
        pathname
          .split("/")
          .slice(0, 5)
          .join("/")
          .indexOf(item) >= 0
      ) {
        selectedKeys = [item];
      }
    });

    return {
      selectedKeys,
    };
  }

  async componentDidMount() {
    this.props.history.push("/dashboard/symbol");
    await this.props.common.getSystemConfig();
    await this.props.common.getUserInfo();
    this.getQuoteColor();
    // this.connectWebsocket();
  }

  getQuoteColor = () => {
    const { configMap, } = this.props.common;

    if (localStorage.getItem("trade4U_PC_color_mode") &&
      localStorage.getItem("trade4U_PC_color_mode") !== "hk_style" &&
      localStorage.getItem("trade4U_PC_color_mode") !== "standard") {
      localStorage.removeItem("trade4U_PC_color_mode")
    }

    if (!localStorage.getItem("trade4U_PC_color_mode")) {
      const colorMode = configMap["color_mode"] ? configMap["color_mode"] : "standard";
      localStorage.setItem("trade4U_PC_color_mode", colorMode);
    }
    this.props.common.setQuoteColor();
  }

  connectWebsocket = () => {
    this.wsConnect = ws('account/status');
    const that = this;

    // setTimeout(function () {
    //   setInterval(function () {
    //     that.wsConnect.send(`{"type":"ping"}`);
    //   }, 3000);
    // }, 30000);


    this.wsConnect.onmessage = evt => {
      const message = JSON.parse(evt.data);
      const data = message.data;
      if (message.type === 'pong') {
        clearInterval(this.interval);

        // 如果一定时间没有调用clearInterval，则执行重连
        this.interval = setInterval(function () {
          this.connectWebsocket();
        }, 4000);
      }
      if (message.type && message.type !== 'pong') { // 消息推送
        // code ...    

        this.props.common.setUserInfo(data);
      }
    };

    // this.wsConnect.onclose = (evt) => {
    //   setInterval(function () { that.connectWebsocket() }, 3000)
    // }
  }

  componentWillUnmount() {
    if (this.wsConnect) {
      this.wsConnect = null;
    }
  }

  hideModal = () => {
    this.setState({}, () => {
      this.setState({ messageModalStatus: false, settingsModalStatus: false, });
    });
  };

  showMessageModal = () => {
    this.setState({ messageModalStatus: true, });
  };

  showSettingsModal = () => {
    this.setState({ settingsModalStatus: true, });
  };

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
  };

  onSearch = evt => {
    this.searchSymbol(evt.target.value);
  };

  searchSymbol = async val => {
    this.props.market.searchSymbol({
      params: {
        search: val,
      },
    });
  };

  render() {
    const {
      showContainer,
      symbolOptions,
      messageModalStatus,
      settingsModalStatus,
    } = this.state;
    const { location, } = this.props;
    const {
      computedUserInfo,
      toggleGuideModalVisible,
      computedSidebar, guideModalVisible, settingsModalVisible, } = this.props.common;

    return (
      <div className={"home"}>
        <div className="home-header">
          <Select
            size={"large"}
            showSearch
            allowClear
            style={{
              width: 240,
              marginLeft: 70,
            }}
            // value={this.state.searchValue}
            placeholder={"输入交易品种进行搜索"}
            filterOption={false}
            onFocus={async () => {
              // const res = await this.$api.market.searchSymbol({});
              // if (res.status == 200) {
              //   this.setState({
              //     symbolOptions: res.data,
              //   })
              // }
            }}
            onSearch={debounce(async value => {
              const res = await this.$api.market.searchSymbol({
                params: {
                  search: value,
                },
              });

              let searchResult = [];
              res.data.map(item => {
                if (!utils.isEmpty(item.data)) {
                  return searchResult.push(item);
                }
              });

              if (res.status == 200) {
                this.setState({
                  symbolOptions: searchResult,
                });
              }
            }, 500)}
            onChange={(value, elem) => {
              this.props.symbol.setCurrentSymbolInfoById(value, elem.children);
              // this.props.market.getCurrentSymbol(value);
              if (this.props.history.pathname !== "/dashboard/symbol") {
                this.props.history.push("/dashboard/symbol");
                // this.setState({
                //   currentTab: "个股",
                // });

                this.props.common.setCurrentTab('个股');
              }
            }}
            notFoundContent={null}
          >
            {symbolOptions.map(item => (
              <OptGroup key={item.id} label={item.name}>
                {item.data.map(subItem => (
                  <Option key={subItem.id}>{subItem.name}</Option>
                ))}
              </OptGroup>
            ))}
          </Select>
          <h2 className='logoText'>
            <img src={logoSVG} alt="" />
            <span>Trade4U</span>
          </h2>
          <p className="home-header-right">
            <span
              onClick={() => {
                this.showMessageModal();
              }}
            >
              <img src={messageSVG} alt="" />
              消息
              {messageModalStatus && (
                <MessageModal onCancel={this.hideModal}></MessageModal>
              )}
            </span>
            <span
              onClick={(evt) => {
                // this.showSettingsModal();
                if (settingsModalVisible) return false;
                this.props.common.toggleSettingsModalVisible();
              }}
            >
              <img src={settingsSVG} alt="" />
              设定
              {settingsModalVisible && (
                <SettingsModal onCancel={(evt) => {
                  evt.stopPropagation();
                  this.props.common.toggleSettingsModalVisible();
                  // this.hideModal()
                }}></SettingsModal>
              )}
            </span>
            <span onClick={() => {
              this.props.common.toggleGuideModalVisible();
            }}>
              <img src={guideSVG} alt="" />
              指引
            </span>
            {guideModalVisible && (
              <GuideModal onCancel={(evt) => {
                evt.stopPropagation();
                this.props.common.toggleGuideModalVisible();
              }}></GuideModal>
            )}
            <span
              onClick={() => {
                // @todo
              }}
            >
              <img src={serviceSVG} alt="" />
              联系客服
            </span>
            <span
              onClick={async () => {
                // @todo

                localStorage.removeItem("MOON_DESKTOP_TOKEN");

                setTimeout(() => {
                  (window as any).location.href =
                    process.env.NODE_ENV === "production"
                      ? "/login"
                      : window.location.origin + "/#/login";
                }, 500);
              }}
            >
              <img src={logoutSVG} alt="" />
              登出
            </span>
          </p>
        </div>
        <div className={"home-content"}>
          {// 响应式布局
            showContainer && (
              <div className={"home-sidebar"}>
                {computedSidebar.map(item => (
                  (item.isShow === '' ? true : utils.parseBool(this.props.common.getKeyConfig(item.isShow)))
                  &&
                  (<div
                    key={item.path}
                    className={`sidebar-row ${
                      this.props.common.currentTab == item.title ? "active" : ""
                      }`}
                    onClick={() => {
                      if (computedUserInfo?.user_status <= 2 && item.title == '资金') {
                        // 未入金
                        return toggleGuideModalVisible();
                      }

                      this.props.common.setCurrentTab(item.title);
                      this.props.history.push(item.path);
                    }}
                  >
                    <img
                      src={
                        this.props.common.currentTab == item.title
                          ? item.activeIcon
                          : item.icon
                      }
                      alt=""
                    />
                    <p>{item.title}</p>
                  </div>)
                ))}
              </div>
            )}
          <div className={"home-panel"}>
            {location.pathname === "/dashboard" ||
              location.pathname === "/dashboard/" ? (
                <p style={{ fontSize: 30, fontWeight: 500, margin: 20, }}>
                  Welcome to WeTrade 桌面端
                </p>
              ) : null}
            <AppRouter />
          </div>
        </div>
      </div>
    );
  }
}
