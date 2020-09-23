import Dialog from 'components/Dialog';
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { inject, observer } from "mobx-react";
import { Tabs } from 'antd';
import './index.scss';
import FilterItem from "components/FilterItem";
import SubscribeTable from "components/SubscribeTable";

const TabPane = Tabs.TabPane;

/* eslint new-cap: "off" */
@WithRoute("/dashboard/subscribe")
@inject("common")
@observer
export default class Subscribe extends BaseReact {


  state = {
    subscribeTypeList: [{ "id": "1", "name": '港股', }, { "id": "2", "name": '沪深', }],
    subscribeTypeID: '港股',
    status: 3,
    dialogModalStatus: false,
    canSubscribeHeight: '',
    isSubscribeHeight: '',

    subsctibe_columns: [
      {
        title: "状态", dataIndex: "status", width: 90, fixed: "left",
        render: (text) => <button
          onClick={() => {
            this.showDialogModal();
          }}
          className=
            {text === '可申購' ? 'canSubscribe'
              : text === '已申購' ? 'isSubscribe'
                : text === '已中簽' ? 'isWin' : 'noWin'}>
          {text}
        </button>,
      },
      { title: "品种", dataIndex: "stock_name", width: 110, },
      { title: "品种代码", dataIndex: "stock_code", width: 110, },
      { title: "申购价格", dataIndex: "public_price", width: 110, },
      { title: "申购日期", dataIndex: "subscription_date_start", width: 110, },
      { title: "截止日期", dataIndex: "subscription_date_end", width: 110, },
      { title: "上市日期", dataIndex: "public_date", width: 110, },
      { title: "每手金额", dataIndex: "lots_price", width: 110, },
      { title: "每手股数", dataIndex: "lots_size", width: 110, }
    ],
    subsctibe_dataSource: [
      {
        key: '1', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '2', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '3', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '4', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '5', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '6', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '7', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '8', status: '可申購', stock_name: '立德教育', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      },
      {
        key: '9', status: '可申購', stock_name: '立德教育9', stock_code: '01449', public_price: '30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30'
        , public_date: '2020-12-30', lots_price: '2662.00', lots_size: '10',
      }

    ],
    isSubsctibe_columns: [
      {
        title: "状态", dataIndex: "status", width: 100, fixed: "left",
        render: (text) => <button className=
          {text === '可申購' ? 'canSubscribe'
            : text === '已申購' ? 'isSubscribe'
              : text === '已中簽' ? 'isWin' : 'noWin'}>
          {text}
        </button>,
      },
      { title: "品种", dataIndex: "stock_name", width: 110, },
      { title: "品种代码", dataIndex: "stock_code", width: 110, },
      { title: "申购价格", dataIndex: "public_price", width: 110, },
      { title: "申购日期", dataIndex: "subscription_date_start", width: 150, },
      { title: "截止日期", dataIndex: "subscription_date_end", width: 150, },
      { title: "上市日期", dataIndex: "public_date", width: 150, },
      { title: "每手金额", dataIndex: "lots_price", width: 110, },
      { title: "每手股数", dataIndex: "lots_size", width: 110, },
      { title: "申购手数", dataIndex: "wanted_lots", width: 110, },
      { title: "手续费", dataIndex: "fee", width: 110, }, // 欄位英文 非正確
      { title: "入场费", dataIndex: "entrance_fee", width: 110, },
      { title: "认购金额", dataIndex: "subscription＿fee", width: 110, }, // 欄位英文 非正確
      { title: "融资比例", dataIndex: "financing_percent", width: 110, }, // 欄位英文 非正確
      { title: "融资金额", dataIndex: "financing_price", width: 110, }, // 欄位英文 非正確
      { title: "融资利息", dataIndex: "financing_interest", width: 110, }, // 欄位英文 非正確
      { title: "利息费", dataIndex: "interest＿fee", width: 110, }// 欄位英文 非正確
    ],
    isSubsctibe_dataSource: [
      {
        key: '1', status: '已申購', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '2', status: '已申購', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '3', status: '已申購', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '4', status: '已中簽', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '5', status: '未中簽', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '6', status: '已中簽', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '7', status: '已申購', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '8', status: '未中簽', stock_name: '立德教育', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      },
      {
        key: '9', status: '未中簽', stock_name: '立德教育9', stock_code: '01449', public_price: '30.30'
        , subscription_date_start: '2020-12-30', subscription_date_end: '2020-12-30', public_date: '2020-12-30'
        , lots_price: '2662.00', lots_size: '1000', wanted_lots: '2', fee: '20', entrance_fee: '24501.06'
        , subscription＿fee: '24501.06', financing_percent: '60%', financing_price: '14712.64'
        , financing_interest: '14.1', interest＿fee: '14.1',
      }

    ],
  }

  createSymbolComponentList(list, currentId, itemClick) {
    return list.map(item => {
      return (
        // --> 無資料先以name比對
        <FilterItem
          key={`symbol_type_${item.name}`}
          symbol_type_name={item.name}
          isItemActive={item.name === currentId}
          onFilterChange={itemClick}
          id={item.name}

        // 請參考 Symbol > Left > index --> 以下為原使程式碼，以id比對
        // key={`symbol_type_${item.id}`}
        // symbol_type_name={item.symbol_type_name}
        // isItemActive={item.id === currentId}
        // onFilterChange={itemClick}
        // id={item.id}
        />
      );
    });
  }

  onFilterChange = (id, symbol_type_name) => {
    this.setState({
      subscribeTypeID: id === '港股' ? '港股' : '沪深',
      symbol_type_name,
    });
  };

  hideDialogModal = () => {
    this.setState({}, () => {
      this.setState({ dialogModalStatus: false, });
    });
  };

  showDialogModal = () => {
    this.setState({ dialogModalStatus: true, });
  };

  componentDidMount() {
    this.calSubscribeTableScroll();
  }

  calSubscribeTableScroll = () => {
    let canSubscribe = document.getElementsByClassName('subscribe-detail')[0].clientHeight;
    let isSubscribe = document.getElementsByClassName('subscribe-detail')[1].clientHeight;
    this.setState({

      canSubscribeHeight:
        canSubscribe == isSubscribe
          ? canSubscribe - 100
          : canSubscribe > isSubscribe
            ? canSubscribe - 110 : isSubscribe - 110,

      isSubscribeHeight:
        canSubscribe == isSubscribe
          ? isSubscribe - 120
          : isSubscribe > canSubscribe
            ? isSubscribe - 110 : canSubscribe - 110,

    });
  }
  render() {
    const {
      subscribeTypeList
      , subscribeTypeID
      , dialogModalStatus
      , subsctibe_columns
      , subsctibe_dataSource
      , isSubsctibe_columns
      , isSubsctibe_dataSource
      , canSubscribeHeight
      , isSubscribeHeight,
    } = this.state;

    const barClass = {
      padding: "0 10px",
      borderBottom: "1px solid rgba(46,59,85,1)",
      marginBottom: "0px",
    };


    return (
      <div className="subscribe-page">
        <div className="subscribe-head">
          <Tabs
            tabBarStyle={barClass}
            className={"tabtest"}
            defaultActiveKey={"1"}
          >
            <TabPane tab="產品" key="1"></TabPane>
          </Tabs>
          <div className={"symbol-filter"}>
            {this.createSymbolComponentList(
              subscribeTypeList,
              subscribeTypeID,
              this.onFilterChange
            )}
          </div>
        </div>
        <div className="subscribe-content">
          <SubscribeTable
            titleName={'可申購'}
            scrollHeight={canSubscribeHeight}
            columns={subsctibe_columns}
            dataSource={subsctibe_dataSource}
            onClick={this.calSubscribeTableScroll}
          />
          <SubscribeTable
            titleName={'已申購'}
            scrollHeight={isSubscribeHeight}
            columns={isSubsctibe_columns}
            dataSource={isSubsctibe_dataSource}
            onClick={this.calSubscribeTableScroll}
          />
        </div>
        {dialogModalStatus && (<Dialog onCancel={this.hideDialogModal}></Dialog>)}
      </div>
    );
  }
}


