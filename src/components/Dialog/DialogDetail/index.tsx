import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { inject, observer } from "mobx-react";
import { Col, Row, Input, Select, Modal } from "antd";

@inject("common")
@observer
export default class DialogTitle extends BaseReact {
  state = {
    isFinancingShow: "none",
    loanOption: [],
    wanted_lots: 1,              // 选择手数
    publicPrice: 0,              // 申购价格  
    lots_size: 0,                // 每手股数
    new_stock_hand_fee: 0,       // 手续费
    new_stock_hand_fee_base: 0,  // 基礎手续费
    entrance_fee: 0,             // 入场费 = publicPrice 申购价格＊ lots_size每手股数＊ wanted_lots选择手数  ( 如果有融資:认购金额-融资金额 )
    amount: 0,                   // 认购金额 = publicPrice 申购价格＊ lots_size每手股数＊ wanted_lots选择手数
    loan: 0,                     // 融资金额 = amount 认购金额＊ loanRatio融资比例
    loanRatio: 0,                // 融资比例
    loanInterest: 0,             // 融资利息 = interest_mul_days＊融资金额
    per_price: 0,                // publicPrice 申购价格＊ lots_size每手股数
    interest_mul_days: 0,        
    withdrawableBalance: 0,       // 可用资金

  };
  componentDidMount() {
    this.defaultData();
    this.getWithdrawableBalance();
  }

  defaultData = () => {
    const option = this.props.common.getKeyConfig('loan_options').split(',');
    const { public_price, new_stock_hand_fee, lots_size, interest_mul_days, } = this.props.subscribe_data;

    this.setState({
      loanOption: option,
      publicPrice: Math.max(...public_price.split('~')),
      lots_size: lots_size,
      new_stock_hand_fee_base: new_stock_hand_fee,
      per_price: Number(Math.max(...public_price.split('~'))) * Number(lots_size),
      interest_mul_days: interest_mul_days,
    }, () => {
      this.setDetail();
    });
  }

  getWithdrawableBalance = async () => {
    const res = await this.$api.captial.getWithdrawableBalance();
    this.setState({
      withdrawableBalance: res.data.withdrawable_balance,
    });
  };

  onFinancingChange = (value) => {
    this.setState({
      isFinancingShow: value === '0' ? 'none' : '',
      loanRatio: Number(value / 100).toFixed(2),
    }, () => {
      this.setDetail();
    });
  }

  onLotsChanged = (val) => {
    let lots = Number(this.state.wanted_lots) + Number(val);
    if (lots === 0) return;
    this.setState({ wanted_lots: lots, }
      , () => {
        this.setDetail();
      });
  };

  setDetail = async () => {
    const { per_price, wanted_lots, new_stock_hand_fee_base, loanRatio, interest_mul_days, } = this.state;
    let amount_price = (Number(per_price) * Number(wanted_lots)).toFixed(2);
    this.setState({
      new_stock_hand_fee: (Number(new_stock_hand_fee_base) * Number(wanted_lots)).toFixed(2),
      amount: amount_price,
      loan: (Number(amount_price) * Number(loanRatio)).toFixed(2),  // 融资金额 = amount 认购金额＊ loanRatio融资比例
      loanInterest: (Number(interest_mul_days) * Number(amount_price) * Number(loanRatio)).toFixed(2), //融资利息 = interest_mul_days＊融资金额
    }, () => {
      const { loan, } = this.state;
      this.setState({
        entrance_fee: (Number(amount_price) - Number(loan)).toFixed(2), // 认购金额-融资金额
      });
    });
  }

  onHandleSumit = async () => {
    const new_stock_id = this.props.subscribe_data.key;
    const market = this.props.subscribe_data.market === 'HK' ? 'HK' : 'SZSH';
    const { wanted_lots, new_stock_hand_fee, entrance_fee, loanInterest, withdrawableBalance, loan, } = this.state;
    const requiredBalance = Number(entrance_fee) + Number(new_stock_hand_fee) + Number(loanInterest);

    if (Number(withdrawableBalance) < Number(requiredBalance)) {
      Modal.confirm({
        title: "提示",
        content: "可用资金不足",
        className: "app-modal",
        centered: true,
        cancelText: "取消",
        okText: "确认",
      });
      return;
    }

    const SubscribeOrder = {
      new_stock: new_stock_id,
      entrance_fee: entrance_fee,
      wanted_lots: wanted_lots,
      loan: loan,
    };
    Modal.confirm({
      title: "提示",
      content: "确认送出申请 ?",
      className: "app-modal",
      centered: true,
      cancelText: "取消",
      okText: "确认",
      onOk: async () => {
        const res = await this.$api.subscribe.createSubscribeOrder(SubscribeOrder);
        if (res.status >= 200 && res.status <= 299) {
          const modalSuccess = Modal.success({
            content: '申购成功',
            className: "app-notice",
          });
          this.props.reloadData(market);
          setTimeout(() => {
            modalSuccess.destroy();
            this.props.onClose();
          }, 1000);
        } else {
          const modalFail = Modal.warning({
            content: '下单失败',
            className: "app-notice",
          });
          setTimeout(() => {
            modalFail.destroy();
          }, 1000);
        }
      },
    });
  }

  render() {
    const { 
      wanted_lots
      , isFinancingShow
      , loanOption
      , new_stock_hand_fee
      , entrance_fee
      , amount
      , loan
      , loanInterest
      , withdrawableBalance,
    } = this.state;

    const requiredBalance = Number(entrance_fee) + Number(new_stock_hand_fee) + Number(loanInterest);

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
                  value={wanted_lots || 1}
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
            <div className="detail-input-item-text">{new_stock_hand_fee}</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>入场费</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">{entrance_fee}</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>认购金额</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">{amount}</div>
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
            <Select className="select-option" defaultValue={"不融資"}
              onChange={this.onFinancingChange}>
              {loanOption.sort().map((item, key) =>
                <Select.Option
                  key={`loanOption_${key}`}
                  value={item}>
                  <span>{`${item === '0' ? '不融資' : item + '%'}`}</span>
                </Select.Option>)
              }
            </Select>
          </Col>
        </Row>
        <Row style={{ display: isFinancingShow, }} className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>融资金额</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">{loan}</div>
          </Col>
        </Row>
        <Row style={{ display: isFinancingShow, }} className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>融资利息</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">{loanInterest}</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>需本金</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">{requiredBalance}</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={8} className={"dialog-detail-item-titile"}>
            <div>可用资金</div>
          </Col>
          <Col span={16} className={"dialog-detail-item-text"}>
            <div className="detail-input-item-text">{withdrawableBalance}</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={24}>
            <div className="dialog-detail-item-submit-btn"
              onClick={() => this.onHandleSumit()}
            >確認申購</div>
          </Col>
        </Row>
        <Row className={"dialog-detail-item"}>
          <Col span={24} className={"dialog-detail-item-line"}></Col>
        </Row>
      </>
    );
  }
}
