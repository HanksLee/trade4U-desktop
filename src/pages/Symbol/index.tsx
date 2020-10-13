import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { inject, observer } from "mobx-react";

import { Row } from "antd";

import WithRoute from "components/@shared/WithRoute";

import Left from './Left';
import Right from './Right';
import Center from './Center';

import "./index.scss";

import OrderWSControl from './WS/Order';

/* eslint new-cap: "off" */
@WithRoute("/dashboard/symbol")
@inject("symbol", "common")
@observer
export default class extends BaseReact {

  componentDidMount() {

  }

  componentWillUnmount() {
  }


  render() {
    return (
      <div className={"symbol-page"}>
        <OrderWSControl />
        <Left  />
        <Center/>
  
        <Right />
      </div>
    );
  }
}

