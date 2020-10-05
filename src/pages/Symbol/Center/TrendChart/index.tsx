import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Row, Col } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";

import TrendHeader from "components/Trend/TrendHeader";
import TrendContainer from "components/Trend/TrendContainer";
import utils from "utils";
import { ISymbolItem } from "pages/Symbol/config/interface";

/* eslint new-cap: "off" */
@inject("trend", "common", "symbol")
@observer
export default class extends BaseReact<{}, {}> {
  state = {};
  trend = null;
  constructor(props) {
    super(props);

    this.trend = props.trend;
  }

  render() {
    return (
      <Col span={24} className={"symbol-chart"}>
        <TrendHeader />
        <TrendContainer  />
      </Col>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
}
