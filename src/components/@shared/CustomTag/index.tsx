import * as React from 'react';
import './index.scss';
import { Tag } from 'antd';
import { BaseReact } from 'components/@shared/BaseReact';

interface CustomTagProps {
  checked: boolean;
  value: any;
  onChange(checked: boolean, value: any): void;
  onClose(value: any): void;
}

interface CustomTagState {
  checked: boolean;
}

export default class CustomTag extends BaseReact<CustomTagProps, CustomTagState> {
  state = {
    checked: this.props.checked,
  }

  private onChange = (checked: boolean) => {
    this.props.onChange(checked, this.props.value);
  }

  private onClose = (e) => {
    this.props.onClose(this.props.value, e);
  };

  render () {
    const { checked, } = this.props;
    return (
      <Tag
        closable
        className={'c-tag' + (checked ? ' c-tag-checked' : '')}
        onClose={this.onClose}
      >
        <Tag.CheckableTag
          className='c-tag-checkbox'
          checked={checked}
          onChange={this.onChange}
        >{this.props.children}</Tag.CheckableTag>
      </Tag>
    );
  }
}