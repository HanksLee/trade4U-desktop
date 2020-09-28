import * as React from "react";
import { Col, Row } from "antd";

export default class DialogRemark extends React.PureComponent {
  state = {

  };

  render() {
    const { } = this.state;

    return (
      <>  
        <Row className={"dialog-remark-item"}>
          <Col span={5} className={"dialog-remark-item-titile"}>
            <div>备注说明</div>
          </Col>
          <Col span={19} className={"dialog-remark-item-text"}>
            <div className="remark-input-item-text">1.中籤者将接受：「入场费」＋「程序费」＋「孖仔费」</div>
            <div className="remark-input-item-text">2.未中籤者采取「程序费」＋「孖仔费」</div>
          </Col>
        </Row>
        <Row className={"dialog-remark-item"}>
          <Col span={5} className={"dialog-remark-item-titile"}>
            <div>入场费</div>
          </Col>
          <Col span={19} className={"dialog-remark-item-text"}>
            <div className="remark-input-item-text">「1.0077%为：1%的经纪佣金+0.0027%証监会征费0.005%联交所交易费」</div>
          </Col>
        </Row>
        <Row className={"dialog-remark-item"}>
          <Col span={5} className={"dialog-remark-item-titile"}>
            <div>利息费</div>
          </Col>
          <Col span={19} className={"dialog-remark-item-text"}>
            <div className="remark-input-item-text">融资额*年利率/365*佔用资金天数</div>
          </Col>
        </Row>
      </>

    );
  }
}
