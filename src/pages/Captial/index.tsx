import DepositPanel from './DepositPanel';
import TransactionPanel from './TransactionPanel';
import WithdrawPanel from './WithdrawPanel';
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Tabs } from 'antd';
import './index.scss';

const TabPane = Tabs.TabPane;

/* eslint new-cap: "off" */
@WithRoute("/dashboard/captial")
export default class Captial extends BaseReact {
  render() {
    return (
      <div className="captial-page">
        <Tabs defaultActiveKey="deposit">
          <TabPane tab="入金" key="deposit">
            <DepositPanel />
          </TabPane>
          <TabPane tab="出金" key="withdraw">
            <WithdrawPanel />
          </TabPane>
          <TabPane tab="资金名细" key="transaction">
            <TransactionPanel />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}