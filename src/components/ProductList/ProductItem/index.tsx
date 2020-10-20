import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { Row, Col } from "antd";
import { StarFilled } from "@ant-design/icons";

import utils from 'utils';

export default class ProductItem extends BaseReact {
  state = {
    priceInfo: null,
    priceType: null,
    isActive: false,
    symbolId: -1,
    symbol_type_code: "",
    symbolCode: "",
    name: "",
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const {
      priceInfo,
      priceType,
      isActive,
      symbolId,
      symbol_type_code,
      symbolCode,
      name,
    } = this.state;
    const { sell, buy, chg } = priceInfo;
    const sellValue = utils.numberPrecisionFormat(sell);
    const activeCls = isActive
      ? "custom-table-item active"
      : "custom-table-item";
    const priceTypeClass = `${priceType.color} ${priceType.gif} self-select-sell-block`;
    const favorIcon =
      symbol_type_code === "SELF"
        ? {
          color: "#f2e205",
          cursor: "pointer",
        }
        : {
          cursor: "pointer",
        };
    return (
      <Row
        className={activeCls}
        key={symbolId}
        type={"flex"}
        justify={"space-between"}
        onClick={e => {
          this.onSingleClick(symbolId, isActive);
        }}
        onDoubleClick={e => {
          this.onDoubleClick();
        }}
      >
        <Col span={24}>
          <Row type={"flex"} justify={"space-between"}>
            <Col span={4}>
              <span
                style={{
                  color: "#838D9E",
                }}
              >
                {name}
              </span>
            </Col>
            <Col span={4}>
              <span
                style={{
                  color: "#FFF",
                }}
              >
                {symbolCode}
              </span>
            </Col>
            <Col span={5} className={"self-select-sell-container"}>
              <span className={priceTypeClass}>{sellValue}</span>
            </Col>
            <Col span={5} className={"self-select-buy-container"}>
              <span className={priceTypeClass}>{chg}%</span>
            </Col>
            <Col span={2}>
              <div className={"symbol-order-favorite"}>
                <StarFilled
                  onClick={e => {
                    this.props.onFavorite(symbol_type_code, symbolId, name);
                    e.stopPropagation();
                  }}
                  style={favorIcon}
                />
              </div>
            </Col>
            <Col span={1}></Col>
          </Row>
        </Col>
      </Row>
    );
  }

  //function
  onSingleClick(symbolId, isActive) {
    this.props.setOpenItem(isActive ? -1 : symbolId);
  }

  onDoubleClick() {}
}
