import * as React from "react";
import { Col, Row, Tabs } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";
import utils from "utils";

export default class ProductDetail extends React.PureComponent {
  state = {
    decimals_place: 0,
    spread_mode_display: 0,
    profit_currency_display: 0,
    max_lots: 0,
    purchase_fee: 0,
    contract_size: 0,
    margin_currency_display: 0,
    lots_step: 0,
    min_lots: 0,
    selling_fee: 0,
    isActive:false,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const {
      decimals_place,
      spread_mode_display,
      profit_currency_display,
      max_lots,
      purchase_fee,
      contract_size,
      margin_currency_display,
      lots_step,
      min_lots,
      selling_fee,
      isActive,
    } = this.state;
   
    const detailOpenClass =  "";
    return (
      <Col
        className={`symbol-sidebar-info ${detailOpenClass}`}
        span={24}
      >
        <Row type={"flex"} justify={"space-around"}>
          <Col span={12}>
            <div className={"symbol-item-info"}>
              <span>小数点位</span>
              <span>{decimals_place}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>点差</span>
              <span>{spread_mode_display}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>获利货币</span>
              <span>{profit_currency_display}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>最大交易手数</span>
              <span>{max_lots}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>买入库存费</span>
              <span>{purchase_fee}</span>
            </div>
          </Col>
          <Col span={12}>
            <div className={"symbol-item-info"}>
              <span>合约大小</span>
              <span>{contract_size}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>预付款货币</span>
              <span>{margin_currency_display}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>交易数步长</span>
              <span>{lots_step}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>最小交易手数</span>
              <span>{min_lots}</span>
            </div>
            <div className={"symbol-item-info"}>
              <span>卖出库存费</span>
              <span>{selling_fee}</span>
            </div>
          </Col>
        </Row>
      </Col>
    );
  }
}
