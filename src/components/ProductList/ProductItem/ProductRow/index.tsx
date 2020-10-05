import * as React from "react";
import { Col, Row, Tabs } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";
import utils from "utils";

export default class ProductRow extends React.PureComponent {
  state = {
    symbol_type_code: "",
    name: "",
    symbol: "",
    sell: 0,
    buy: 0,
    chg: 0,
    priceType: null,
    symbolId:-1,
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
      sell,
      buy,
      priceType,
      symbol_type_code,
      symbolId,
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
                    symbolId,
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
