import * as React from 'react';
import DatafeedProvider from './DatafeedProvider';
import utils from 'utils';
import './index.scss';

interface TVChartContainerProps {
  symbol: string;
};

export default class TVChartContainer extends React.PureComponent<TVChartContainerProps> {
  tvWidget = null;
  containerId = 'tv_chart_container_' + (new Date()).getTime()
  isReady = false

  componentDidMount() {
    const widgetOptions = {
      symbol: this.props.symbol || utils.getLStorage("LATEST_SYMBOL") || '000',
      datafeed: new DatafeedProvider(),
      interval: '1D',
      container_id: this.containerId,
      library_path: '/assets/charting_library/',
      autosize: true,
      locale: 'zh',
      disabled_features: [
        'header_compare',
        'header_screenshot',
        'header_undo_redo',
        'header_screenshot',
        'control_bar',
        'header_symbol_search',
        'header_settings',
        'header_fullscreen_button',
        'go_to_date',
        'adaptive_logo',
        'main_series_scale_menu',
        'timeframes_toolbar',
        'volume_force_overlay'
      ],
      theme: 'Dark',
      debug: true,
    };
    // eslint-disable-next-line new-cap
    this.tvWidget = new window.TradingView.widget(widgetOptions);
    this.tvWidget.onChartReady(() => {
      this.isReady = true;
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.symbol !== nextProps.symbol && this.isReady) {
      // console.log('setSymbol', this.props.symbol, nextProps.symbol);
      this.tvWidget.setSymbol(nextProps.symbol, '1D');
    }
  }

  componentWillUnmount() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
  }

  render() {
    return (
      <div id={this.containerId} className="TVChartContainer" />
    );
  }
}
