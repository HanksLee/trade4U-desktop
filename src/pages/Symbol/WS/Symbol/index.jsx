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
@inject("common")
class Symbol extends React.Component {
  state = {
    chart: null,
    chartOption: null,
  };
  reactionList = [];
  constructor(props) {
    super(props);

   
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
      this.setCurrentSymbolTypeInfoListener()
    ];
    this.props.setReceiveMsgLinter(this.receiveMsgLinter);
  }

  componentWillUnmount(){
    for(let cancel of this.this.reactionList){
      cancel();
    }
  }
  //function
  receiveMsgLinter = (d) => {
    // update list
    const sortList = Array.isArray(d)? [d] : this.sortList(d);
    const filterList = this.filterBufferList(sortList);
    this.props.symbol.updateCurrentSymbolListFromSubscribeDate(filterList);

    const {currentSymbolInfo , setCurrentSymbolInfo } = this.props.symbol;
    const { symbolId , symbolCode } = currentSymbolInfo;

    // update current symbol 
    if (symbolId === -1) return;
    if (this.checkIdExist(filterList, symbolCode)) {
      const infoList = filterList.filter((item, i) => {
        return item.symbol === symbolCode;
      });

      if (infoList.length === 0) return;
      const info = infoList[infoList.length - 1];
      setCurrentSymbolInfo(info);
    }
  };

  //ws
  // setCurrentSymbolInfoListener = () => {
  //   return reaction(
  //     () => this.props.symbol.currentSymbolInfo,
  //     (currentSymbolInfo) => {
  //       const {
  //         subscribeSymbol,
  //         selectedSymbolTypeInfo,
  //         setSelectedSymbolInfo,
  //       } = this.props.common;

  //       const { symbol_type_code } = currentSymbolInfo;

  //       if (code === SELF) {
  //         return;
  //       }

  //       const symbolTypeCode = selectedSymbolTypeInfo.code;
  //       const nowProgress = this.props.getProgress();
  //       if (nowProgress === DISCONNECTED) {
  //         this.replaceWSUrl(code);
  //       }
  //     }
  //   );
  // };

  setSubscribeListener = () => {
    return reaction(
      () => this.props.symbol.subscribeSymbol,
      (subscribeSymbol) => {
        const { list } = subscribeSymbol;
        this.trackSymbol(list, SUBSCRIBE);
      }
    );
  };

  setUnsubscribeListener = () => {
    return reaction(
      () => this.props.symbol.unSubscribeSymbol,
      (unSubscribeSymbol) => {
        const { list } = unSubscribeSymbol;
        this.trackSymbol(list, UNSUBSCRIBE);
      }
    );
  };

  setCurrentSymbolTypeInfoListener = () => {
    return reaction(
      () => this.props.symbol.currentSymbolInfo.symbol_type_code,
      (symbol_type_code) => {
        this.replaceWSUrl(symbol_type_code);
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

    this.props.sendMsg(o);
  };

  replaceWSUrl = (code) => {
    let tarUrl = "";
    switch (code) {
      case "self":
        tarUrl = "self-select-symbol";
        break;
      default:
        tarUrl = `${code}/symbol`;
        break;
    }
    this.props.replaceUrl(tarUrl);
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

export default WSConnect(channelConfig[0], channelConfig, Symbol);
