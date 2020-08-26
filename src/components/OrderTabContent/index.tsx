import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { observer, inject } from "mobx-react";

import TotalOrderList from "./TotalOrderList";
import OrderTable from "./OrderTable";
import HistoryTable from "./HistoryTable";

import {
  IN_TRANSACTION,
  PENDING,
  FINISH
} from "pages/Symbol/Bottom/config/tabConfig";
import {
  META_FUND,
  ORDER_OPEN,
  ORDER_CLOSE,
  ORDER_PROFIT,
  PENDING_ORDER_CLOSE
} from "pages/Symbol/Bottom/config/wsType";

import moment from "moment";

@inject("order")
@observer
export default class OrderTabContent extends BaseReact<{}, {}> {
  order = null;

  buffer = null;

  constructor(props) {
    super(props);
    this.order = props.order;
    this.buffer = this.initBuffer();
  }

  render() {
    // console.log("OrderTabContent render");
    const { orderTabKey, search, } = this.order.info;
    const { getPriceTmp, } = this.props;
    const tabContent = this.getCurrentTabContent(orderTabKey, {
      getPriceTmp,
      search,
    });

    return (
      <div>
        <TotalOrderList getPriceTmp={getPriceTmp} />
        {tabContent}
      </div>
    );
  }

  componentDidMount() {
    const { setReceviceMsgLinter, setStatusChangeListener, } = this.props;
    setReceviceMsgLinter(this.receviceMsgLinter);
    setStatusChangeListener(this.statusChangListener);
  }

  componentDidUpdate(prevProps, prevState) {
    this.initBuffer();
  }

  //function
  getCurrentTabContent = (key, props) => {
    let result = null;
    switch (key) {
      case FINISH:
        result = <HistoryTable {...props} />;
        break;
      case IN_TRANSACTION:
      case PENDING:
        result = <OrderTable {...props} />;
        break;
    }

    return result;
  };

  //ws fn
  receviceMsgLinter = d => {
    const { isTradeLoading, } = this.order;
    const { orderTabKey, } = this.order.info;
    const { buffer, } = this;
    const { timeId, BUFFER_TIME, } = buffer;

    if (isTradeLoading || orderTabKey === FINISH) {
      if (timeId) window.clearTimeout(timeId);
      return;
    }

    const receviceTime = moment().valueOf();
    //console.log("setReceviceMsgLinter" , d);
    const { type, data, } = d;

    if (type === META_FUND) {
      buffer[META_FUND] = data;
    } else if (
      type === ORDER_PROFIT ||
      type === ORDER_OPEN ||
      type === ORDER_CLOSE ||
      type === PENDING_ORDER_CLOSE
    ) {
      buffer[type] = [...buffer[type], ...data];
    }

    // 檢查buffer 是否有滿足更新畫面條件，沒有的話，延遲 BUFFER_TIME 定義的時間執行
    if (timeId) window.clearTimeout(timeId);
    if (!this.checkBuffer(buffer, orderTabKey, receviceTime)) {
      buffer.timeId = window.setTimeout(() => {
        this.updateContent(buffer);
      }, BUFFER_TIME);
      return;
    }

    this.updateContent(buffer);
  };

  statusChangListener = (before, next) => {};

  checkBuffer(buffer, key, receviceTime) {
    const { lastCheckUpdateTime, BUFFER_MAXCOUNT, BUFFER_TIME, } = buffer;
    let maxCount = 0;
    switch (key) {
      case IN_TRANSACTION:
        maxCount =
          buffer[ORDER_PROFIT].length +
          buffer[ORDER_OPEN].length +
          buffer[ORDER_CLOSE].length;
        break;
      case PENDING:
        maxCount = buffer[PENDING_ORDER_CLOSE].length;
        break;
    }

    if (
      receviceTime - lastCheckUpdateTime >= BUFFER_TIME ||
      maxCount >= BUFFER_MAXCOUNT
    )
      return true;
    else return false;
  }

  updateContent = buffer => {
    for (let key in buffer) {
      const value = buffer[key];

      if (
        key === META_FUND ||
        key === ORDER_CLOSE ||
        key === PENDING_ORDER_CLOSE
      )
        continue;
      const list = this.sortOrderList(value);
      buffer[key] = this.filterBufferlList(list);
    }

    this.order.updateTrade(buffer);

    this.buffer = this.initBuffer();
    // const {initMsg} = this.props;
  };

  filterBufferlList(list) {
    return list.filter((item, i, all) => {
      return (
        all.findIndex(fItem => {
          return fItem.order_number === item.order_number;
        }) === i
      );
    });
  }

  sortOrderList = list => {
    const tmp = Object.assign([], list);

    tmp.sort((a, b) => {
      if (a.order_number !== b.order_number) {
        return -1;
      }

      if (a.timestamp > b.timestamp) {
        return -1;
      }

      if (a.timestamp < b.timestamp) {
        return 1;
      }

      if (a.timestamp === b.timestamp) {
        return 0;
      }
    });

    return tmp;
  };

  initBuffer() {
    return {
      BUFFER_MAXCOUNT: 50,
      BUFFER_TIME: 2000,
      timeId: 0,
      lastCheckUpdateTime: moment().valueOf(),
      [META_FUND]: null,
      [ORDER_OPEN]: [],
      [ORDER_CLOSE]: [],
      [ORDER_PROFIT]: [],
      [PENDING_ORDER_CLOSE]: [],
    };
  }
}
