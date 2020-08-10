import * as React from "react";
import { Row, Col } from "antd";

export default () => {
  return (
    <Row
      className={"custom-table-title"}
      type={"flex"}
      justify={"space-between"}
    >
      <Col span={4}>{"品种"}</Col>
      <Col span={4}>{"品种代号"}</Col>
      <Col span={2} className="text-right">
        {"点差"}
      </Col>
      <Col span={5} className="text-right">
        {"卖出"}
      </Col>
      <Col span={5} className="text-right">
        {"买入"}
      </Col>
      <Col span={3}></Col>
    </Row>
  );
};
