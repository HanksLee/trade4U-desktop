import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Table } from 'antd';
import './index.scss';

export default class TransactionPanel extends BaseReact {
  state = {
    totalData: {},
    transactionList: [],
  }
  
  componentDidMount() {
    this.getTransactionList();
  }

  getTransactionList = async () => {
    const res = await this.$api.captial.getTransactionList();
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
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text) => {
          switch (text) {
            case 'recharge_success':
              return '充值成功';
            case 'withdraw_pending':
              return '财务审核';
            case 'withdraw_failed':
              return '出金驳回';
            case 'withdraw_success':
              return '提款成功';
            default:
              return '其他';
          }
        },
      },
      {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
      },
      {
        title: '备注',
        dataIndex: 'remarks',
        key: 'remarks',
      }
    ];
  }
  
  render() {
    const { totalData, transactionList, } = this.state;
    return (
      <div className="transaction-panel">
        <div className="transaction-summary">
          <div>
            <span>净资产</span>
            <span>{totalData.profit || 0}</span>
          </div>
          <div>
            <span>入金总额</span>
            <span>{totalData.topup || 0}</span>
          </div>
          <div>
            <span>出金总额</span>
            <span>{totalData.withdraw || 0}</span>
          </div>
          <div>
            <span>总盈亏</span>
            <span>{totalData.balance || 0}</span>
          </div>
        </div>
        <Table
          dataSource={transactionList}
          columns={this.getColumns()}
        />
      </div>
    );
  }
}