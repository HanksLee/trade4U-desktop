import * as React from "react";
import { Col, Row, Tabs } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";
import utils from "utils";

export default class ProductRow extends React.PureComponent {
  state = {
    id: 0,
    symbol_type_code: "",
    name: "",
    symbol: "",
    spread: 0,
    sell: 0,
    buy: 0,
    chg: 0,
    priceType: null,
    addID: 0,
    deleteID: 0,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const {
      name,
      symbol,
      spread,
      sell,
      buy,
      priceType,
      symbol_type_code,
      id,
      addID,
      deleteID,
    } = this.state;
    const priceTypeClass = `${priceType.color} ${priceType.gif} self-select-sell-block`;
    const favorIcon = symbol_type_code === "SELF" ? 
      {
        color: "#f2e205",
        cursor: "pointer",
      } :
      {
        cursor: "pointer",
      };
    return (
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
              {symbol}
            </span>
          </Col>
          <Col span={2} className={"self-select-dot-container"}>
            <span
              style={{
                color: "#838D9E",
              }}
            >
              {spread}
            </span>
          </Col>
          <Col span={5} className={"self-select-sell-container"}>
            <span className={priceTypeClass}>{sell}</span>
          </Col>
          <Col span={5} className={"self-select-buy-container"}>
            <span className={priceTypeClass}>{buy}</span>
          </Col>
          <Col span={2}>
            <div className={"symbol-order-favorite"}>
              <StarFilled
                onClick={e => {
                  this.props.onFavorite(
                    symbol_type_code,
                    addID,
                    deleteID,
                    name
                  );
                  e.stopPropagation();
                }}
                style={favorIcon}
              />
            </div>
          </Col>
          <Col span={1}></Col>
        </Row>
      </Col>
    );
  }
}
