import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import { SCREEN_DETAIL, SCREEN_BUY } from 'pages/Symbol/Right/config/screenList';

import utils from "utils";

const { RangePicker, } = DatePicker;
const { TabPane, } = Tabs;

export default class Detail extends BaseReact<{}, {}> {
  state ={
    type:"",
    data:null,
  }
  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.type === SCREEN_DETAIL || nextState.type ===  SCREEN_BUY ;
  }


  render() {
    const { type, data, } = this.state;
 
    const showCls = (type === SCREEN_DETAIL || type === SCREEN_BUY) &&
                      data ? 
      "show" : "";

    return (
      <div className={`symbol-tool-item symbol-detail ${showCls}`}>
123
      </div>
    );
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  //function


}
