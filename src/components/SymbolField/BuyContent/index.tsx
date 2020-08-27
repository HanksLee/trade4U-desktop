import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import { SYMBOL_RESFRESH, RIGHT_SHOW, RIGHT_HIDE } from 'pages/Symbol/config/messageCmd';

import utils from "utils";

const { RangePicker, } = DatePicker;
const { TabPane, } = Tabs;

@inject("common")
@observer
export default class BuyContent extends BaseReact<{}, {}> {
  order = null;
  constructor(props) {
    super(props);
  }

  render() {
    const { isShow, } = this.props;
    const showCls = isShow ? "show" : "";
    return (
      <div className={`symbol-tool-item symbol-buy-content ${showCls}`}>

      </div>
    );
  }

  componentDidMount() {

  }

  componentDidUpdate() {}

  //function


}
