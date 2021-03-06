import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Form, Input, Select, Button, message, Spin, InputNumber } from "antd";
import closeModalIcon from "assets/img/close-modal-icon.svg";
import { LoadingOutlined } from "@ant-design/icons";
import "./index.scss";

export default class DepositPanel extends BaseReact {
  paymentWindow: any = null;
  timer: any = null;
  formRef = React.createRef();

  state = {
    withdrawableBalance: 0,
    paymentMethods: [],
    isPaying: false,
    orderNumber: "",
    showLoading: false,
    currentPayment: undefined,
  };

  componentDidMount() {
    this.getWithdrawableBalance();
    this.getPaymentMethods();
  }

  getWithdrawableBalance = async () => {
    const res = await this.$api.captial.getWithdrawableBalance();
    this.setState({
      withdrawableBalance: res.data.withdrawable_balance,
    });
  };

  getPaymentMethods = async () => {
    const res = await this.$api.captial.getPaymentMethods();
    this.setState({
      paymentMethods: res.data,
    });
  };

  selectCurrentPayment = value => {
    const { paymentMethods, } = this.state;

    {
      paymentMethods.map(item => {
        if (item.id == value) {
          this.setState({ currentPayment: item, });
        }
      });
    }
  }

  deposit = async values => {
    if (!this.state.isPaying) {
      try {
        const res = await this.$api.captial.deposit({
          payment: values.payment,
          expect_amount: Number(values.expect_amount),
        });
        if (res.status === 201 && res.data.gopayurl) {
          this.setState({
            isPaying: true,
            orderNumber: res.data.order_number,
            showLoading: true,
          }, () => {
            this.paymentWindow = window.open(res.data.gopayurl);
            this.checkDepositStatus();
          });
        } else {
          throw new Error();
        }
      } catch (error) {
        message.error("支付失败");
      }
    } else {
      message.warning("请完成支付");
    }
  };

  checkDepositStatus = async () => {
    if (!this.state.showLoading) return;
    const res = await this.$api.captial.checkDepositStatus({
      params: { order_number: this.state.orderNumber, },
    });
    if (res.data.status === 1) {
      this.getWithdrawableBalance();
      clearInterval(this.timer);
      this.paymentWindow.close();
      message.success("充值成功");
      this.setState({
        isPaying: false,
        orderNumber: "",
        showLoading: false,
      });
      this.resetForm();
    } else {
      this.checkDepositStatus();
    }
  };

  resetForm = () => {
    this.formRef.current.resetFields();
  };

  hideLoading = () => {
    this.setState({
      showLoading: false,
    });
  };

  render() {
    const { withdrawableBalance, paymentMethods, showLoading, currentPayment, } = this.state;

    return (
      <div className="deposit-panel">
        <Form
          layout="vertical"
          onFinish={this.deposit}
          hideRequiredMark={true}
          ref={this.formRef}
        >
          <Form.Item name="balance" label="净资产">
            <span className="withdrawable-balance">{withdrawableBalance}</span>
          </Form.Item>
          <Form.Item
            name="payment"
            label="选择支付通道"
            rules={[{ required: true, message: "请输入支付通道", }]}
          >
            <Select className="line-selector" style={{ width: "500px", }} onChange={this.selectCurrentPayment}>
              {paymentMethods.map(item => {
                return (
                  <Select.Option value={item.id}>{item.name}</Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {currentPayment && <Form.Item
            name="expect_amount"
            label={
              <>
                金额{" "}
                <span className="expect-amount-tips">
                  ＊提示：手续费{currentPayment.fee}%，入金上限 {currentPayment.max_deposit} / 下限 {currentPayment.min_deposit} ＊
                </span>
              </>
            }
            rules={[{ required: true, message: "请输入金额", }]}
          >
            <InputNumber
              min={currentPayment.min_deposit}
              max={currentPayment.max_deposit}
              className="line-input"
              placeholder="输入金额"
              style={{ width: "500px", }}
            />
          </Form.Item>}
          <div className="panel-btn-group">
            <Button onClick={this.resetForm}>清除资料</Button>
            <Button htmlType="submit">充值</Button>
          </div>
        </Form>
        {showLoading && (
          <div className="paying-dialog">
            <img
              className="paying-dialog-close"
              src={closeModalIcon}
              onClick={this.hideLoading}
              alt="关闭"
            />
            <div className="paying-dialog-content">
              <div>充值中</div>
              <Spin indicator={<LoadingOutlined />} />
            </div>
          </div>
        )}
      </div>
    );
  }
}
