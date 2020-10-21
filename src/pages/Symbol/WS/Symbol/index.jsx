import * as React from "react";
import { inject, observer } from "mobx-react";
import { toJS, reaction } from "mobx";
import WSConnect from "components/HOC/WSConnect";
import { START, CLOSE, RESTART } from "../config/wsCmd";
import channelConfig from "./config/channel";

import {
  STANDBY, //啟動ws之前
  CONNECTING, //已開通通路，未接收到訊息
  CONNECTED, //已接收到訊息
  DISCONNECTED, //斷線
  RECONNECT, //斷線重新連線
  URLREPLACE, // Url 切換
  ERROR, //
} from "utils/WebSocketControl/status";
import { SELF } from 'pages/Symbol/config/symbolTypeCategory';

const SUBSCRIBE = "subscribe";
const UNSUBSCRIBE = "unsubscribe";
@observer
@inject("symbol", "product")
class Symbol extends React.Component {
  state = {
    chart: null,
    chartOption: null,
  };
  reactionList = [];
  wsControl = null;
  constructor(props) {
    super(props);

    this.wsControl = props.wsControl;
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }
  render() {
    return <div></div>;
  }

  componentDidMount() {
    this.reactionList = [
      this.setSubscribeListener(),
      this.setUnsubscribeListener(),
      this.setWSActionListener(),
      this.setCurrentSymbolTypeInfoListener(),
      this.setCurrentSymbolInfoListener()
    ];
    this.wsControl.setReceiveMsgLinter(this.receiveMsgLinter);
  }

  componentWillUnmount() {
    for (let cancel of this.this.reactionList) {
      cancel();
    }
  }
  //function
  receiveMsgLinter = (d) => {
    // update list
    const sortList = !Array.isArray(d) ? d.data : this.sortList(d);
    const filterList = this.filterBufferList(sortList);
    this.props.symbol.updateCurrentSymbolListFromSubscribeDate(filterList);

    const { currentSymbolInfo, updateCurrentSymbolInfo } = this.props.symbol;
    const { symbolId, symbolCode } = currentSymbolInfo;

    // update current symbol 
    if (symbolId === -1) return;
    if (this.checkIdExist(filterList, symbolCode)) {
      const infoList = filterList.filter((item, i) => {
        return item.symbol === symbolCode;
      });

      if (infoList.length === 0) return;
      const info = infoList[infoList.length - 1];
      updateCurrentSymbolInfo(info);
    }
  };

  //ws
  setCurrentSymbolInfoListener = () => {
    return reaction(
      () => this.props.symbol.currentSymbolInfo,
      (currentSymbolInfo) => {

      },
      {
        equals: (prev, now) => {

          this.trackSymbol([prev.symbolId], UNSUBSCRIBE);
          this.trackSymbol([now.symbolId], SUBSCRIBE);
          return false
        }
      }
    );
  };

  setSubscribeListener = () => {
    return reaction(
      () => this.props.symbol.subscribeSymbolList,
      (subscribeSymbolList) => {
        this.trackSymbol(subscribeSymbolList, SUBSCRIBE);
      }
    );
  };

  setUnsubscribeListener = () => {
    return reaction(
      () => this.props.symbol.unSubscribeSymbolList,
      (unSubscribeSymbolList) => {
        this.trackSymbol(unSubscribeSymbolList, UNSUBSCRIBE);
      }
    );
  };

  setCurrentSymbolTypeInfoListener = () => {
    return reaction(
      () => this.props.product.currentSymbolTypeItem,
      (currentSymbolTypeItem) => {

        this.replaceWSUrl(currentSymbolTypeItem.symbol_type_code);
      }
    );
  };

  setWSActionListener = () => {
    return reaction(
      () => this.props.symbol.symbolWSAction,
      (symbolWSAction) => {
        const { cmd } = symbolWSAction;
        const { startWS, closeWS, reconnectWS } = this.props;
        switch (cmd) {
          case START:
            startWS();
            break;
          case CLOSE:
            closeWS();
            break;
          case RESTART:
            reconnectWS();
            break;
        }
        //this.trackSymbol(list, "unsubscribe");
      }
    );
  };

  trackSymbol = (currentList, type) => {
    const o = {
      type: type,
      data: {
        symbol_ids: currentList,
      },
    };

    this.wsControl.sendMsg(o);
  };

  replaceWSUrl = (code) => {
    let tarUrl = "";
    switch (code) {
      case SELF:
        tarUrl = "self-select-symbol";
        break;
      default:
        tarUrl = `${code}/symbol`;
        break;
    }
    this.wsControl.replaceUrl(tarUrl);
  };

  checkIdExist = (list, id) => {
    if (list.length === 0 || id === null) return false;

    const findId = list.findIndex((item) => {
      return item.symbol === id;
    });

    if (findId === -1) {
      return false;
    }

    return true;
  };

  sortList = (list) => {
    const tmp = Object.assign([], list);

    tmp.sort((a, b) => {
      if (a.symbol !== b.symbol) {
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


  filterBufferList(list) {
    return list.filter((item, i, all) => {
      return (
        all.findIndex((fItem) => {
          return fItem.symbol === item.symbol;
        }) === i
      );
    });
  }

}

export default WSConnect(channelConfig, Symbol);
