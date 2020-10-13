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
  
}
