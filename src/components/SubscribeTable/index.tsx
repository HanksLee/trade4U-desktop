import * as React from "react";
import { Col, Row, Table } from "antd";
import { BaseReact } from "components/@shared/BaseReact";


export default class SubscribeTable extends BaseReact {

  state = {
    isFold: true,
  }
  constructor(props) {
    super(props);
  }

  isSubscribeShow = (e) => {
    const { isFold, } = this.state;
    const targetContent = e.target.parentElement.parentElement;
    targetContent.classList.toggle('fold-tabs');

    this.setState({ isFold: !isFold, });
    this.props.onClick();
  }

  render() {
    const { isFold, } = this.state;
    return (
      <Col span={24} className={`subscribe-detail`}>
        <Row className={`subscribe-detail-title `} onClick={this.isSubscribeShow}>
          <Col span={23}>{this.props.titleName}</Col>
          <Col span={1} className={`subscribe-detail-title-isFold`}>{isFold === true ? '收起' : '展開'}</Col>
        </Row>
        <Table
          scroll={{ y:this.props.scrollHeight, }}
          columns={this.props.columns}
          dataSource={this.props.dataSource}
          pagination={false}
        >
        </Table>
      </Col>
    );
  }


}
