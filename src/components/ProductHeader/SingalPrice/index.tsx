import * as React from "react";
import { Row, Col } from "antd";

export default () => {
  return (
    <Row
      className={"custom-table-title"}
      type={"flex"}
      justify={"space-between"}
    >
      <Col span={7}>{"品种 | 代码"}</Col>
      <Col span={5} className="text-right">
        {"成交价"}
      </Col>
      <Col span={5} className="text-right">
        {"涨跌幅"}
      </Col>
      <Col span={3}></Col>
    </Row>
  );
};
