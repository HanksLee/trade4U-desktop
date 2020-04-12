// 可以解决汉字不能自定义截断行数问题

import TextTruncate from 'react-text-truncate';
import React, { Component } from 'react';
import './index.scss';
import { Icon } from 'antd';

export interface IReadMoreProps {
  lines?: number; // 截断行数
  more?: string; // 更多文字
  less?: string; // 收起文字
  width?: number;
  content?: string; // 显示的内容
}

export interface IReadMoreState {

}

class ReadMore extends Component<IReadMoreProps, IReadMoreState> {
  state = {
    expand: false,
  }

  static defaultProps = {
    lines: 3,
    more: '更多',
    less: '收起 >',
  }

  toggleLines = (event) => {
    event.preventDefault();

    this.setState({
      expand: !this.state.expand,
    });
  }

  render() {
    const { width, lines, content, more, less, } = this.props;
    const { expand, } = this.state;
    return (
      <div className="ellipsis-text">
        <TextTruncate
          width={width}
          line={!expand ? lines : 100}
          truncateText="..."
          text={content}
          textTruncateChild={(<span><a href="#" className='expand-text' onClick={this.toggleLines}>{more}<Icon type="down" /></a></span>)}
        />
        {expand && (<span><a href="#" className='expand-text' onClick={this.toggleLines}>{less}</a></span>)}
      </div>
    );
  }
}

export default ReadMore;