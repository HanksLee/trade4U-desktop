import * as React from "react";
import { Col, Row, Input, Select } from "antd";


export default class DialogTitle extends React.PureComponent {
  state = {
    params: '',
    isFinancingShow:"none",
  };

  onFinancingChange = (value) => {
    // const { isFinancingShow } = this.state;
    this.setState({
      isFinancingShow: value == '0' ? 'none' : '',
    });
  }
  onLotsChanged = (val) => {
    // const { params } = this.state;
    val = Number(val);
    val = Number(this.state.params || 1) + val;
    val = Number(val.toFixed(2));

    this.setState({
      params: val,
    });
  };

  render() {
    const { params, isFinancingShow, } = this.state;

    return (
      <>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>选择手数</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-input"}>
            <div className="detail-input-item-btn-group">
              <div className="detail-input-item-less-btn"
                onClick={() => { this.onLotsChanged(-1); }}
              ><span>-</span></div>
              <div className="detail-input-item-input">
                <Input type="number"
                  min={1}
                  placeholder={"未设置"}
                  value={params || 1}
                />
              </div>
              <div className="detail-input-item-add-btn"
                onClick={() => { this.onLotsChanged(1); }}
              ><span>+</span></div>
            </div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>手续费</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">10</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>入场费</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">12250.53</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>认购金额</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">12250.53</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={24} className={"dialog-detail-item-line"}></Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>融资比例</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <Select className="select-option" defaultValue={"0"}
              onChange={this.onFinancingChange} >
              <Select.Option value="0"><span>不融资</span></Select.Option>
              <Select.Option value="1"><span>60%</span></Select.Option>
            </Select>
          </Col>
        </Row>
        <Row style={{ display: isFinancingShow, }} className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>融资金额</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">14712.64</div>
          </Col>
        </Row>
        <Row style={{ display: isFinancingShow, }} className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>融资利息</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">14.1</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>需本金</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">12250.53</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>可用资金</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">12250.53</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={24}>
            <div className="dialog-detail-item-submit-btn">確認申購</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={24} className={"dialog-detail-item-line"}></Col>
        </Row>

      </>

    );
  }
}
