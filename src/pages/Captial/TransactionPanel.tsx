import * as React from 'react';
import moment from 'moment';
import { BaseReact } from 'components/@shared/BaseReact';
import { DatePicker, Row, Table } from 'antd';
import './index.scss';

const { RangePicker, } = DatePicker;

export default class TransactionPanel extends BaseReact {
  state = {
    totalData: {},
    transactionList: [],
  }

  componentDidMount() {
    this.getTransactionList();
  }

  getTransactionList = async (params = {}) => {
    const res = await this.$api.captial.getTransactionList({
      params: {
        type: 'deposit_and_withdraw',
        ...params,
      },
    });
    this.setState({
      transactionList: res.data.results,
      totalData: res.data.total_data,
    });
  }

  getColumns = () => {
    return [
      {
        title: '时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'left',
        render: (text, record) => moment(text * 1000).format('YYYY.MM.DD HH:mm:ss'),
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'right',
        // render: (text) => {
        //   switch (text) {
        //     case 'recharge_success':
        //       return '充值成功';
        //     case 'withdraw_pending':
        //       return '财务审核';
        //     case 'withdraw_failed':
        //       return '出金驳回';
        //     case 'withdraw_success':
        //       return '提款成功';
        //     default:
        //       return '其他';
        //   }
        // },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        width: 300,
        render: (text, record) => {
          return text == 0
            ? 0
            : (record.in_or_out === 0
              ? <span style={{ color: 'red', }}>{`-${text}`}</span>
              : <span style={{ color: 'green', }}>{`+${text}`}</span>);
        },
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
        align: 'right',
        width: 400
      }
    ];
  }

  handleDateChange = (value) => {
    this.getTransactionList({
      create_time_start: value && value[0] ? value[0].unix() : undefined,
      create_time_end: value && value[1] ? value[1].unix() : undefined,
    });
  }

  render() {
    const { totalData, transactionList, } = this.state;
    return (
      <div className="transaction-panel">
        <Row justify="end">
          <RangePicker onChange={this.handleDateChange} />
        </Row>
        <div className="transaction-summary">
          <div>
            <span>入金总额</span>
            <span>{totalData.topup || 0}</span>
          </div>
          <div>
            <span>出金总额</span>
            <span>{totalData.withdraw || 0}</span>
          </div>
          <div>
            <span>净资产</span>
            <span>{totalData.balance || 0}</span>
          </div>
        </div>
        <div className="transaction-detail">
          <Table
            dataSource={transactionList}
            columns={this.getColumns()}
          />
        </div>
      </div>
    );
  }
}