import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Col, Row } from "antd";


export default class DialogTitle extends BaseReact {

  render() {
    const { subscribe_data, } = this.props;
    return (
      <>
        <Row type={"flex"} justify={"space-around"} className={"dialog-title"}>
          <Col span={24} >
            <div className="dialog-title-text">
              <span>{subscribe_data.stock_name}</span>
              <span>{subscribe_data.stock_code}</span>
            </div>
          </Col>
          <Col span={12} >
            <div className={"dialog-title-text-right"}>
              <span>申購價：</span>
              <span className={"price-green"}>{subscribe_data.public_price}</span>
            </div>
          </Col>
          <Col span={12} >
            <div className={"dialog-title-text-left"}>
              <span>每股手數：</span>
              <span>{subscribe_data.lots_size}</span>
            </div>
          </Col>
        </Row>
      </>

    );
  }
}
