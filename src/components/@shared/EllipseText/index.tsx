import React, { Component } from 'react';
import Truncate from 'react-truncate';
import './index.scss';
import { Icon } from 'antd';

export interface IReadMoreProps {
  lines?: number;
  more?: string;
  less?: string;
  width?: number;
}

export interface IReadMoreState {

}

class ReadMore extends Component<IReadMoreProps, IReadMoreState> {
  state = {
    expanded: false,
    truncated: false,
  }
  static defaultProps = {
    lines: 3,
    more: '更多',
    less: '收起 >',
  }

  handleTruncate = (truncated) => {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated,
      });
    }
  }

  toggleLines = (event) => {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const {
      children,
      more,
      less,
      lines,
      width,
    } = this.props;

    const {
      expanded,
      truncated,
    } = this.state;

    return (
      <div className='ellipsis-text'>
        <Truncate
          width={width}
          lines={!expanded && lines}
          ellipsis={(
            <span>...<a href='#' onClick={this.toggleLines} className='expand-text'>{more} <Icon type="down" /></a></span>
          )}
          onTruncate={this.handleTruncate}
        >
          <div style={{ width, }}>
            {children}
          </div>
        </Truncate>
        {!truncated && expanded && (
          <span> <a href='#' className='expand-text' onClick={this.toggleLines}>{less}</a></span>
        )}
      </div>
    );
  }
}

export default ReadMore;