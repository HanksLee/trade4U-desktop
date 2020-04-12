import * as React from 'react';
import './index.scss';

const typeMap = {
  hot: 'hot',
  normal: 'normal',
  wait: 'wait',
  block: 'block',
};

export default class StatusTag extends React.Component<any> {
  render() {
    const { onTagClick, active, text, type, } = this.props;

    return (
      <span className={`status-tag ${active ? 'active' : ''} ${typeMap[type]}`} onClick={onTagClick}>
        {text}
      </span>
    );
  }
}