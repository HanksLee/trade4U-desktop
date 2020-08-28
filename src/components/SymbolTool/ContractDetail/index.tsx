import React from "react";

import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Row, Col } from "antd";

import moment from "moment";
import classNames from "classnames/bind";

import css from "../index.module.scss";

import utils from "utils";

const cx = classNames.bind(css);

@inject("other")
@observer
export default class extends React.Component<any, any> {
  state = {
    name: "----"
  };
  other = null;
  constructor(props) {
    super(props);
    this.other = this.props.other;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const {
      high,
      low,
      close,
      open,
      volume,
      max_trading_volume
    } = this.other.mainInfo;

    return (
      <div className={cx("symbol-descript")}>
        <h2>合约资讯</h2>
        <div className={cx("symbol-descript-content")}>
          <Row className={cx("symbol-descript-row")}>
            <Col span={12}>
              <span className={cx("symbol-descript-title")}>合约大小</span>
              <span className={cx("symbol-descript-value")}>{high}</span>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
              <span className={cx("symbol-descript-title")}>预付款货币</span>
              <span className={cx("symbol-descript-value")}>{low}</span>
            </Col>
          </Row>
          <Row className={cx("symbol-descript-row")}>
            <Col span={12}>
              <span className={cx("symbol-descript-title")}>获利货币</span>
              <span className={cx("symbol-descript-value")}>{open}</span>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
              <span className={cx("symbol-descript-title")}>最大交易手数</span>
              <span className={cx("symbol-descript-value")}>{close}</span>
            </Col>
          </Row>
          <Row className={cx("symbol-descript-row")}>
            <Col span={12}>
              <span className={cx("symbol-descript-title")}>最小交易手数</span>
              <span className={cx("symbol-descript-value")}>{volume}</span>
            </Col>
            <Col span={1}></Col>
            <Col span={11}>
              <span className={cx("symbol-descript-title")}>买入库存费</span>
              <span className={cx("symbol-descript-value")}>
                {max_trading_volume}
              </span>
            </Col>
          </Row>
          <Row className={cx("symbol-descript-row")}>
            <Col span={12}>
              <span className={cx("symbol-descript-title")}>卖出库存费</span>
              <span className={cx("symbol-descript-value")}>1</span>
            </Col>
            <Col span={12}></Col>
          </Row>
        </div>
      </div>
    );
  }

  componentDidMount() {}

  componentDidUpdate() {}

  //function
}
