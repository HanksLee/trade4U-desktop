import * as React from "react";
import { observer, inject } from "mobx-react";
import { reaction, toJS } from "mobx";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";
import { SymbolDetail, SymbolBuyContent } from "components/SymbolField";

import utils from "utils";

@inject("other", "common", "symbol")
@observer
export default class Right extends BaseReact<{}, {}> {
  state = {};
  other = null;

  constructor(props) {
    super(props);

    this.other = props.other;
    this.setOnCurrentSymbolChange();
    this.setOnCurrentTransactionSymbolChange();
  }

  render() {
    return (
      <div className={`symbol-right`}>
        <SymbolDetail />
        <SymbolBuyContent />
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
  setOnCurrentSymbolChange = () => {
    reaction(
      () => this.props.symbol.currentSymbol,
      currentSymbol => {
        this.setHeaderInfo(currentSymbol);
      }
    );
  };

  setOnCurrentTransactionSymbolChange = () => {
    reaction(
      () => this.props.symbol.currentTransactionSymbol,
      currentTransactionSymbol => {
        const { symbolId, } =  this.props.symbol.currentSymbol;

        if(symbolId  === currentTransactionSymbol.symbolId) return;
        this.setHeaderInfo(currentTransactionSymbol);
      }
    );
  };

  setHeaderInfo = (info)=>{
    const { symbolId, name, priceInfo, } = info;
    const { change, chg, sell, } = priceInfo;
    const { headerInfo, } = this.other;
    this.other.setHeaderInfo({ symbolId, name, change, chg, sell, });

    if(headerInfo.symbolId === symbolId) return;
    this.other.fetchContractInfo(symbolId);
  }
}
