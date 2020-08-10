import * as React from "react";
import { Col, Row, Tabs } from "antd";
import { StarFilled, createFromIconfontCN } from "@ant-design/icons";
import utils from "utils";

export default class OrderItem extends React.PureComponent {
  state = {
    span: 0,
    title: 0,
    value: 0,
    priceType: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { span, title, value, priceType, } = this.state;
    const priceTypeClass = `${priceType.color} `;

    return (
      <Col span={span}>
        <p>
          <strong>{title}</strong>
        </p>
        <p className={priceTypeClass}>{value}</p>
      </Col>
    );
  }
}
