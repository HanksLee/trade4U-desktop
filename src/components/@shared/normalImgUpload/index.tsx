import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import './index.scss';
import { Icon, Upload } from 'antd';

interface NormalUploadProps {
  className?: string; // upload css类
  accept?: string; // 接手上传的图片类型 逗号隔开 如：image/png,image/jpg
  fileList: any[]; // 已经上传的文件列表
  customRequest(info): void; // 自定义上传行为
  onRemove(info): void; // 点击移除文件回调
  tip?: string; // 说明文字
}

interface NormalUploadState {}

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传图片</div>
  </div>
);

class NormalUpload extends BaseReact<NormalUploadProps, NormalUploadState> {
  state = {}

  static defaultProps = {
    className: '',
    accept: 'image/*',
    tip: '',
  }

  render() {
    const { className, accept, fileList, customRequest, onRemove, tip, } = this.props;

    return (
      <div className="upload-wrapper">
        <Upload
          className={className}
          accept={accept}
          listType="picture-card"
          fileList={fileList}
          customRequest={(info) => customRequest(info)}
          onRemove={(info) => onRemove(info)}
          beforeUpload={file => {
            if (accept && accept !== 'image/*') {
              const isCorrectFormat = file.type === accept;

              if (!isCorrectFormat) {
                this.$msg.error(`请上传${accept}格式图片`);
              }

              return isCorrectFormat;
            }
            return true;
          }}
        >
          {uploadButton}
        </Upload>
        <span className='form-upload-tip'>
          {tip}
        </span>
      </div>
    );
  }
}

export default NormalUpload;