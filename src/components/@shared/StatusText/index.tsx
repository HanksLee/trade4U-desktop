import * as React from 'react';
import './index.scss';

const typeMap = {
  hot: 'hot',
  normal: 'normal',
  wait: 'wait',
  block: 'block',
};

export default class StatusText extends React.Component<any> {
  render() {
    const { text, type, } = this.props;


    return (
      <span className={`status-text ${typeMap[type]}`}>
        <span className={`status-text-dot ${typeMap[type]}`}></span>
        <span>{text}</span>
      </span>
    );
  }
}