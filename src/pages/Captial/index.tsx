import DepositPanel from './DepositPanel';
import TransactionPanel from './TransactionPanel';
import WithdrawPanel from './WithdrawPanel';
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { inject, observer } from "mobx-react";
import { Tabs } from 'antd';
import './index.scss';

const TabPane = Tabs.TabPane;

/* eslint new-cap: "off" */
@WithRoute("/dashboard/captial")
@inject("captial", "common")
@observer
export default class Captial extends BaseReact {
  changeTab = key => {
    this.props.captial.setCurrentTab(key);
  }
  render() {
    const { currentCaptialTab, } = this.props.captial;
    return (
      <div className="captial-page">
        <Tabs activeKey={currentCaptialTab} destroyInactiveTabPane onChange={this.changeTab}>
          <TabPane tab="入金" key="deposit">
            <DepositPanel />
          </TabPane>
          <TabPane tab="出金" key="withdraw">
            <WithdrawPanel />
          </TabPane>
          <TabPane tab="资金明细" key="transaction">
            <TransactionPanel />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
