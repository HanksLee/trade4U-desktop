import * as React from "react";
import { Col, Row, Tabs } from "antd";


export default class DialogTitle extends React.PureComponent {
   
  render() {
    return (
      <>
        <Row type={"flex"} justify={"space-around"} className={"dialog-title"}>
          <Col span={24} >
            <div>
              <span>泰格醫藥</span>
              <span>0857</span>
            </div>
          </Col>
          <Col span={12} >
            <div className={"dialog-title-text-right"}>
              <span>申購價：</span>
              <span className={"price-green"}>30.30</span> 
            </div>
          </Col>
          <Col span={12} >
            <div className={"dialog-title-text-left"}>   
              <span>每股手數：</span>
              <span>400</span>
            </div>
          </Col>
        </Row>
      </>

    );
  }
}
