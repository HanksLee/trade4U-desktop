import api from "services";
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { inject, observer } from "mobx-react";
import './index.scss';
import SubscribeTable from "components/SubscribeTable";
import Dialog from 'components/Dialog';
import SubscribeNavBar from "./SubscribeNavBar";
import moment from "moment";
import momentTimezone from "moment-timezone";

/* eslint new-cap: "off" */
@WithRoute("/dashboard/subscribe")
@inject("common")
@observer
export default class Subscribe extends React.Component {


  state = {
    newstockList: [],
    userSubscribeList: [],
    subscribe_data: [],
    currentTab: 'HK',
    getToday: momentTimezone(Date.now()).tz("Asia/Shanghai"),
    dialogModalStatus: false,
    canSubscribeHeight: '',
    isSubscribeHeight: '',

    subscribe_columns: [
      {
        title: "状态", dataIndex: "status", width: 90, fixed: "left",
        render: (text, record, index) => <button
          onClick={() => {
            text === '可申购' &&
              this.showDialogModal(record);
          }}
          className={text === '可申购' ? 'canSubscribe' : 'noWin'}
        >
          {text}
        </button>,
      },
      { title: "股名", dataIndex: "stock_name", width: 120, },
      { title: "品种", dataIndex: "market", width: 90, },
      { title: "品种代码", dataIndex: "stock_code", width: 105, },
      { title: "申购价格", dataIndex: "public_price", width: 125, },
      { title: "起始日", dataIndex: "subscription_date_start", width: 125, },
      { title: "截止日", dataIndex: "subscription_date_end", width: 125, },
      { title: "上市日", dataIndex: "public_date", width: 125, },
      { title: "中签公布日", dataIndex: "draw_result_date", width: 125, },
      { title: "每手金额", dataIndex: "lots_price", width: 110, },
      { title: "每手股数", dataIndex: "lots_size", width: 110, },
      { title: "币种", dataIndex: "currency", width: 110, }
    ],
    isSubscribe_columns: [
      {
        title: "状态", dataIndex: "status", width: 90, fixed: "left",
        render: (text) => <button
          className={
            text === '已申购' ? 'isSubscribe'
              : text === '已中籤' ? 'isWin' : 'noWin'
          }>
          {text}
        </button>,
      },
      { title: "股名", dataIndex: "stock_name", width: 120, },
      { title: "品种", dataIndex: "market", width: 90, },
      { title: "品种代码", dataIndex: "stock_code", width: 105, },
      { title: "申购价格", dataIndex: "public_price", width: 125, },
      { title: "起始日", dataIndex: "subscription_date_start", width: 125, },
      { title: "截止日", dataIndex: "subscription_date_end", width: 125, },
      { title: "上市日", dataIndex: "public_date", width: 125, },
      { title: "中签公布日", dataIndex: "draw_result_date", width: 125, },
      { title: "每手金额", dataIndex: "amount_per_lot", width: 110, },
      { title: "每手股数", dataIndex: "lots_size", width: 110, },
      { title: "币种", dataIndex: "currency", width: 110, },
      { title: "申购手数", dataIndex: "wanted_lots", width: 110, },
      { title: "中籤数量", dataIndex: "real_lots", width: 110, },
      { title: "手续费", dataIndex: "hand_fee", width: 110, },
      { title: "入场费", dataIndex: "entrance_fee", width: 110, },
      { title: "认购金额", dataIndex: "total_subscription_amount", width: 110, },
      { title: "融资比例", dataIndex: "loan_proportion", width: 110, },
      { title: "融资金额", dataIndex: "loan", width: 110, },
      { title: "融资利率", dataIndex: "interest_rate", width: 110, },
      { title: "融资利息", dataIndex: "interest", width: 110, }
    ],
    subscribe_dataSource: [],
    isSubscribe_dataSource: [],
  }

  componentDidMount() {
    const { currentTab, } = this.state;
    this.calSubscribeTableScroll();
    this.onTabChange(currentTab);
  }

  onTabChange = (currentTabID) => {
    this.setState({ currentTab: currentTabID, });
    this.setState(
      { subscribe_dataSource: [], isSubscribe_dataSource: [], newstockList: [], userSubscribeList: [], },
      async () => {
        await this.getNewstockList();
        await this.getUserSubscribeList();
        await this.newstockListMap();
        this.newstock_data_modal();
      });
  }

  dateFormat = (theDate) => theDate && moment(theDate).format('YYYY-MM-DD') || '';

  getNewstockList = async () => {
    const { currentTab, } = this.state;
    const res = await api.subscribe.getNewstockList({});
    const newstockList = res.data.filter(list => currentTab.includes(list.market)).reverse();

    // 排序截止日（ 新到舊 ）
    const sortnNewstockList = this.sortNewstockList(newstockList);
    if (res.status === 200) {
      this.setState({
        newstockList: sortnNewstockList,
      });
    }
  }

  getUserSubscribeList = async () => {
    const { currentTab, } = this.state;
    const res = await api.subscribe.getUserSubscribeList({});
    if (res.status === 200) {
      const newstock_data = res.data.results.map(list => list.newstock_data);
      const newstock_data_mapMarket = newstock_data.filter(item => currentTab.includes(item.market));
      let userSubscribeList_key = [];
      newstock_data.map((data, key) => {
        newstock_data_mapMarket.map(market => {
          if (data === market) { userSubscribeList_key.push(key); }
        });
      });
      const userSubscribeList_data = userSubscribeList_key.map(key => res.data.results[key]);

      // 排序截止日（ 新到舊 ）
      const sortSubscribeDateEnd = userSubscribeList_data.sort((a, b) =>
        new Date(b.newstock_data.subscription_date_end).valueOf() - new Date(a.newstock_data.subscription_date_end).valueOf());
      const sortUserSubscribeList = this.sortNewstockList(sortSubscribeDateEnd);
      this.setState({
        userSubscribeList: sortUserSubscribeList,
      });
    }
  }

  sortNewstockList = (data) => {
    const mainList = [];
    const otherList = [];
    data.filter(item => {
      let itemProperty = item.hasOwnProperty('newstock_data') ? item.newstock_data : item;
      itemProperty.status === '2' ? mainList.push(item) : otherList.push(item);
    });
    return [...mainList, ...otherList];
  }

  newstockListMap = () => {
    const { newstockList, userSubscribeList, } = this.state;
    const stockcodeList = userSubscribeList.map(item => item.newstock_data.stock_code);
    const map_newstockList = newstockList.filter(item => !stockcodeList.includes(item.stock_code)); // 取得未申購的資料
    this.setState({
      newstockList: map_newstockList,
    });
  }


  newstock_data_modal = () => {
    const { newstockList, userSubscribeList, } = this.state;

    // 未申購
    const newstockList_data = [];
    newstockList.map(item => {
      let publicPriceMax = Math.max(...item.public_price.split('~'));
      let lotsPrice = Number(publicPriceMax * item.lots_size).toFixed(2);
      let public_date = item.public_date && moment(item.public_date).format('YYYY-MM-DD') || '上市日未公佈';
      let buttonText = { '1': '未开始', '2': '可申购', '3': '已截止', '4': '已截止', };

      let data = {
        key: item.id
        , status: buttonText[item.status]
        , stock_name: item.stock_name
        , market: item.market
        , stock_code: item.stock_code
        , public_price: item.public_price
        , subscription_date_start: this.dateFormat(item.subscription_date_start)
        , subscription_date_end: this.dateFormat(item.subscription_date_end)
        , public_date: public_date
        , draw_result_date: this.dateFormat(item.draw_result_date)
        , lots_price: lotsPrice
        , lots_size: item.lots_size
        , currency: item.currency
        , new_stock_hand_fee: item.new_stock_hand_fee
        , interest_mul_days: item.interest_mul_days,
      };
      newstockList_data.push(data);
    });

    // 已申購
    const userSubscribeList_data = [];
    userSubscribeList.map(item => {
      let newstock_data = item.newstock_data;
      let draw_result_date = this.dateFormat(newstock_data.draw_result_date);
      let public_date = item.public_date && moment(item.public_date).format('YYYY-MM-DD') || '上市日未公佈';
      let real_lots_text = item.real_lots === 0 ? '未中籤' : '已中籤';
      let buttonText = newstock_data.status === '4' ? real_lots_text : '已申购';

      let data = {
        key: item.id
        , status: buttonText
        , stock_name: newstock_data.stock_name
        , market: newstock_data.market
        , stock_code: newstock_data.stock_code
        , public_price: newstock_data.public_price
        , draw_result_date: draw_result_date
        , subscription_date_start: this.dateFormat(newstock_data.subscription_date_start)
        , subscription_date_end: this.dateFormat(newstock_data.subscription_date_end)
        , public_date: public_date
        , amount_per_lot: newstock_data.amount_per_lot
        , lots_size: newstock_data.lots_size
        , currency: newstock_data.currency
        , wanted_lots: item.wanted_lots
        , real_lots:item.real_lots
        , hand_fee: item.hand_fee
        , entrance_fee: item.entrance_fee
        , total_subscription_amount: item.total_subscription_amount
        , loan_proportion: Number(item.loan_proportion) * 100 + '%'
        , loan: item.loan
        , interest_rate: item.interest_rate + '%'
        , interest: item.interest,
      };
      userSubscribeList_data.push(data);
    });

    this.setState({
      subscribe_dataSource: newstockList_data,
      isSubscribe_dataSource: userSubscribeList_data,
    });
  }

  hideDialogModal = () => {
    this.setState({}, () => {
      this.setState({
        dialogModalStatus: false,
        subscribe_data: [],
      });
    });
  };

  showDialogModal = (detail) => {
    const { subscribe_dataSource, } = this.state;
    const subscribeDetail = subscribe_dataSource.filter(item => detail.stock_code === item.stock_code)[0];
    this.setState({
      dialogModalStatus: true,
      subscribe_data: subscribeDetail,
    });
  };


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
      dialogModalStatus
      , subscribe_columns
      , subscribe_dataSource
      , isSubscribe_columns
      , isSubscribe_dataSource
      , canSubscribeHeight
      , isSubscribeHeight
      , subscribe_data,
    } = this.state;

    return (
      <div className="subscribe-page">
        <SubscribeNavBar tabChange={this.onTabChange} />
        <div className="subscribe-content">
          <SubscribeTable
            titleName={'未申购'}
            scrollHeight={canSubscribeHeight}
            columns={subscribe_columns}
            dataSource={subscribe_dataSource}
            onClick={this.calSubscribeTableScroll}
          />
          <SubscribeTable
            titleName={'已申购'}
            scrollHeight={isSubscribeHeight}
            columns={isSubscribe_columns}
            dataSource={isSubscribe_dataSource}
            onClick={this.calSubscribeTableScroll}
          />
        </div>
        {dialogModalStatus &&
          (<Dialog onCancel={this.hideDialogModal} subscribe_data={subscribe_data} onTabClick={this.onTabChange}></Dialog>)}
      </div>
    );
  }
}


