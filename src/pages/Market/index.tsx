import RankTable from './RankTable';
import TrendGraph from './TrendGraph';
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Col, Row } from 'antd';
import './index.scss';

interface MarketState {
  currentSymbolTypeCode: string;
  width: number;
  height: number;
}

const symbolTypeMap = {
  HK: ['IXIXHSI', 'IXIXHSCEI', 'HSCCI'],
};

/* eslint new-cap: "off" */
@WithRoute("/dashboard/market")
export default class Market extends BaseReact<any, MarketState> {
  container: any = null
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {
      currentSymbolTypeCode: 'HK',
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    this.computeTrendGraphStyle();
    setTimeout(() => {
      this.computeTrendGraphStyle();
    }, 2000);

    window.onresize = () => {
      this.computeTrendGraphStyle();
    };
  }

  computeTrendGraphStyle = () => {
    const containerWidth = this.container.current.offsetWidth;
    const width = Math.floor((containerWidth - 20) / symbolTypeMap[this.state.currentSymbolTypeCode].length);
    const height = width;
    this.setState({
      width,
      height,
    });
  }
  
  render() {
    const { currentSymbolTypeCode, width, height, } = this.state;

    return (
      <div className="market-page">
        <ul className="symbol-type-list">
          <li className={ currentSymbolTypeCode === 'HK' ? 'selected-symbol-type' : ''}>港股</li>
        </ul>
        <div className="trend-graph-panel" ref={this.container}>
          {
            symbolTypeMap[currentSymbolTypeCode].map(item => (
              <TrendGraph
                productCode={item}
                width={width}
                height={height}
              />
            ))
          }
        </div>
        <RankTable symbolTypeCode={currentSymbolTypeCode} />
      </div>
    );
  }
}