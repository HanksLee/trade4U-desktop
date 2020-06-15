import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Form, Input, Select, Button, Row, Col, message } from "antd";
import "./index.scss";

export default class WithdrawPanel extends BaseReact {
  formRef = React.createRef();

  state = {
    withdrawableBalance: 0,
  };

  componentDidMount() {
    this.getWithdrawableBalance();
  }

  getWithdrawableBalance = async () => {
    const res = await this.$api.captial.getWithdrawableBalance();
    this.setState({
      withdrawableBalance: res.data.withdrawable_balance,
    });
  };

  withdraw = async values => {
    await this.$api.captial.withdraw(values);
    this.getWithdrawableBalance();
    message.success("提取成功");
    this.resetForm();
  };

  resetForm = () => {
    this.formRef.current.resetFields();
  };

  render() {
    const { withdrawableBalance, } = this.state;

    return (
      <div className="deposit-panel">
        <Form
          layout="vertical"
          onFinish={this.withdraw}
          hideRequiredMark={true}
          ref={this.formRef}
        >
          <Form.Item name="balance" label="可提余额">
            <span className="withdrawable-balance">{withdrawableBalance}</span>
          </Form.Item>
          <Row gutter={48}>
            <Col span={10}>
              <Form.Item
                name="account_name"
                label="姓名"
                rules={[{ required: true, message: "请输入姓名", }]}
              >
                <Input className="line-input" placeholder="输入姓名" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="sub_branch"
                label="支行"
                rules={[{ required: true, message: "请输入支行", }]}
              >
                <Input className="line-input" placeholder="输入支行" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={10}>
              <Form.Item
                name="province"
                label="省份"
                rules={[{ required: true, message: "请输入省份", }]}
              >
                <Input className="line-input" placeholder="输入省份" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="card_number"
                label="银行卡号"
                rules={[{ required: true, message: "请输入银行卡号", }]}
              >
                <Input className="line-input" placeholder="输入银行卡号" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={10}>
              <Form.Item
                name="city"
                label="城市"
                rules={[{ required: true, message: "请输入城市", }]}
              >
                <Input className="line-input" placeholder="输入城市" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item
                name="expect_amount"
                label="提取金额"
                rules={[{ required: true, message: "请输入提取金额", }]}
              >
                <Input className="line-input" placeholder="输入提取金额" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={10}>
              <Form.Item
                name="bank"
                label="开户行"
                rules={[{ required: true, message: "请输入开户行", }]}
              >
                <Input className="line-input" placeholder="输入开户行" />
              </Form.Item>
            </Col>
            {/* <Col span={10}>
              <Form.Item
                name="remarks"
                label="备注"
              >
                <Input className="line-input" placeholder="输入备注" />
              </Form.Item>
            </Col> */}
          </Row>
          <div className="panel-btn-group">
            <Button onClick={this.resetForm}>清除资料</Button>
            <Button htmlType="submit">提取</Button>
          </div>
        </Form>
      </div>
    );
  }
}
