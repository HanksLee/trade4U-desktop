import RankTable from './RankTable';
import TrendGraph from './TrendGraph';
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Col, Row } from 'antd';
import './index.scss';

interface MarketState {
  currentSymbolTypeCode: string;
}

/* eslint new-cap: "off" */
@WithRoute("/dashboard/market")
export default class Market extends BaseReact<any, MarketState> {
  constructor(props) {
    super(props);
  
    this.state = {
      currentSymbolTypeCode: 'HK',
    };
  }
  
  render() {
    const { currentSymbolTypeCode, } = this.state;

    return (
      <div className="market-page">
        <div className="trend-graph-panel">
          <TrendGraph
            productCode="IXIXHSI"
          />
          <TrendGraph
            productCode="IXIXHSCEI"
          />
          <TrendGraph
            productCode="HSCCI"
          />
        </div>
        <div>
          <ul className="symbol-type-list">
            <li className={ currentSymbolTypeCode === 'HK' ? 'selected-symbol-type' : ''}>港股</li>
          </ul>
          <RankTable symbolTypeCode={currentSymbolTypeCode} />
        </div>
      </div>
    );
  }
}