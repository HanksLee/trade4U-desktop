import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import {
  Form,
  Input,
  Select,
  Button,
  Upload,
  Radio,
  DatePicker,
  Modal,
  Icon,
  Tag,
  Tooltip
} from 'antd';
import './index.scss';
import Validator from 'utils/validator';
import { inject, observer } from 'mobx-react';
import utils from 'utils';
import moment from 'moment';
import { toJS } from 'mobx';
import {
  pushTypeOptions,
  pushTargetOptions,
  noticeAccountOptions,
  noticeTypeOptions, pushStatusMap
} from 'constant';
import StatusText from 'components/@shared/StatusText';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
const TextArea = Input.TextArea;

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">上传图片</div>
  </div>
);

const getFormItemLayout = (label, wrapper, offset?) => ({
  labelCol: { span: label, offset, },
  wrapperCol: { span: wrapper, },
});

export interface IAppPushEditorProps {

}

export interface IAppPushEditorState {
  previewImage: string;
  previewVisible: boolean;
  bgFlag: boolean;
  pushTargetFile: any;
  inputValue: string;
  selectVisible: boolean;
  mode: string;
}

// @ts-ignore
@Form.create()
@inject('common', 'growth')
@observer
export default class AppPushEditor extends BaseReact<IAppPushEditorProps, IAppPushEditorState> {
  private $selectRef = null;
  state = {
    mode: 'add',
    previewImage: '',
    previewVisible: false,
    selectVisible: false,
    bgFlag: false,
    pushTargetFile: null,
    inputValue: undefined,
  }

  async componentDidMount() {
    this.init();
    // console.log('userInfo', this.props.common.userInfo);
  }

  componentWillUnmount() {
    this.props.growth.setCurrentPush({}, true, false);
  }

  init = async () => {
    const search = this.$qs.parse(this.props.location.search);

    this.setState({
      mode: search.id == 0 ? 'add' : 'edit',
    }, async () => {
      const currentPush = utils.getLStorage('currentPush');

      if (currentPush) {
        confirm({
          title: '推送记录恢复操作',
          content: '检测到您存在未提交的推送记录，请问是否从上次编辑的推送中恢复状态？',
          onOk: () => {
            this.props.growth.setCurrentPush(currentPush);
          },
          onCancel: () => {
            this.init();
            utils.rmLStorage('currentPush');
          },
        });
      } else {
        if (this.state.mode === 'edit') {
          await this.$store.growth.getCurrentPush({
            params: {
              taskId: search.id,
            },
          });
        } else {
          this.props.growth.setCurrentPush({}, true, false);
        }
      }
    });
  }

  renderEditor = () => {
    const { getFieldDecorator, } = this.props.form;
    const { setCurrentPush, currentShowPush, } = this.props.growth;
    const { mode, } = this.state;

    return (
      <Form className='editor-form'>
        {
          mode == 'edit' && (
            <FormItem
              label={'推送状态'}
              {...getFormItemLayout(2, 6)}
            >
              <StatusText text={pushStatusMap[currentShowPush.pushStatus]} type={currentShowPush.pushStatus != 4 ? 'block' : 'normal'} />
            </FormItem>
          )
        }
        <FormItem
          label='推送类型'
          className='push-type-select'
          {...getFormItemLayout(2, 6)}
          required
        >
          {
            getFieldDecorator('category', {
              initialValue: currentShowPush && currentShowPush.category,
            })(
              <Select
                // @ts-ignore
                getPopupContainer={() => document.getElementsByClassName('push-type-select')[0]}
                placeholder='请选择推送类型'
                onChange={(value, elem: any) => {
                  setCurrentPush({
                    category: value,
                  }, false);
                }}
              >
                {
                  pushTypeOptions.map(item => (
                    // @ts-ignore
                    <Option key={item.value}>
                      {item.title}
                    </Option>
                  ))
                }
              </Select>
            )
          }
        </FormItem>
        {
          (!currentShowPush.category || currentShowPush.category == 1 || currentShowPush.category == 2) && this.renderPushInfo()
        }
        {
          this.renderPushTarget()
        }
        {
          (!currentShowPush.category || currentShowPush.category == 1 || currentShowPush.category == 3) && this.renderNoticeInfo()
        }
        <FormItem
          label='备注'
          {...getFormItemLayout(2, 6)}
        >
          {
            getFieldDecorator('remark', {
              initialValue: currentShowPush && currentShowPush.remark,
            })(
              <TextArea rows={6} onChange={evt => {
                setCurrentPush({
                  remark: evt.target.value,
                }, false);
              }} placeholder="请输入备注" />)
          }
        </FormItem>
        <FormItem
          label={'推送时间'}
          {...getFormItemLayout(2, 6)}
          required
        >
          <DatePicker
            // className='upshelf-date'
            format={'YYYY-MM-DD HH:mm:ss'}
            disabledDate={current => {
              return current && current < moment().startOf('day');
            }}
            showTime
            value={currentShowPush.pushTime ? currentShowPush.pushTime : null} onChange={(date) => {
              const pushTime = date ? date.valueOf() : undefined;

              setCurrentPush({
                pushTime,
              }, false);
            }} />
        </FormItem>
        <FormItem className='editor-form-btns'>
          {
            // @comment 暂时关闭更新操作入口
            (currentShowPush.pushStatus != 4 && this.state.mode !== 'edit') && <Button type='primary' onClick={this.handleSubmit}>{
              (this.state.mode == 'edit') ? '确认修改' : '保存'
            }</Button>
          }
          <Button onClick={this.goBack}>
            {
              currentShowPush.pushStatus != 4 ? '取消' : '返回'
            }
          </Button>
          {
            this.state.mode == 'edit' && (
              <Button onClick={this.copyPushInfo}>复制信息新建推送</Button>
            )
          }
        </FormItem>
      </Form>
    );
  }

  goBack = () => {
    setTimeout(() => {
      this.props.history.goBack();
      this.props.growth.setCurrentPush({});
      utils.rmLStorage('currentPush');
    }, 300);
  }

  copyPushInfo = () => {
    this.props.history.replace('/admin/growth/app-push/editor?id=0');
    this.props.growth.setCurrentPush({
      pushCount: undefined,
      pushUids: undefined,
      pushUserType: undefined,
      pushStatus: undefined,
    }, false);
    this.setState({ mode: 'add', }, () => {
      this.$msg.success('复制成功，当前页面即可编辑新推送内容');
    });
  }

  handleSubmit = async (evt) => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { currentPush, currentShowPush, pushListMeta, } = this.props.growth;
        const { userInfo, } = this.props.common;
        // const push = cloneDeep(currentPush);
        const { mode, } = this.state;
        let payload: any = {
          // pushId: userInfo.empId,
          createUser: userInfo.empName,
          category: Number(currentPush.category),
          pushUserType: Number(currentPush.pushUserType),
          // pushUids: currentPush.pushUids,
          pushTime: currentPush.pushTime && moment(currentPush.pushTime).format('YYYY-MM-DD HH:mm:ss'),
        };

        if (currentPush.category == 1 || currentPush.category == 2) {
          payload = {
            ...payload,
            title: currentPush.title,
            content: currentPush.content,
            jumpUrl: currentPush.jumpUrl,
            coverImg: currentPush.coverImg,
          };
        };

        if (currentPush.category == 1 || currentPush.category == 3) {
          payload = {
            ...payload,
            pushId: Number(currentPush.pushId),
            messageType: currentPush.messageType,
          };
          // 图文消息：通知标题、通知内容和通知大图
          if (currentPush.messageType == 'RC:PSImgTxtMsg2') {
            payload = {
              ...payload,
              messageTitle: currentPush.messageTitle,
              messageContent: currentPush.messageContent,
              messageImg: currentPush.messageImg,
            };
          } else if (currentPush.messageType == 'RC:TxtMsg') {
            // 文本消息：通知内容
            payload = {
              ...payload,
              messageContent: currentPush.messageContent,
            };
          } else if (currentPush.messageType == 'RC:ImgMsg') {
            // 图片：通知大图
            payload = {
              ...payload,
              messageImg: currentPush.messageImg,
            };
          }
        }

        if (currentPush.pushUserType == 2) {
          // 输入悦跑号需要设置推送人数和推送 uids
          payload.pushCount = currentShowPush.pushUids.length;
          payload.pushUids = currentPush.pushUids;
        } else if (currentPush.pushUserType == 1) {
          // 导入悦跑号需要设置文件路径
          payload.fileUrl = currentPush.fileUrl;
        }

        // console.log('payload', payload);
        const errMsg = this.getValidation(payload);
        if (errMsg) return this.$msg.warn(errMsg);
        // console.log('payload', payload);
        // @TODO 调用接口
        if (mode == 'add') {
          this.$api.growth.createPush(payload)
            .then(res => {
              this.$msg.success('推送创建成功');
              setTimeout(() => {
                this.goBack();
                this.$store.growth.getPushList({
                  pageNum: pushListMeta.pageNum,
                  pageSize: pushListMeta.pageSize,
                  orderBy: 'createTime',
                  sort: 'desc',
                });
              }, 1500);
            });
        } else {
          payload.taskId = currentPush.taskId;
          payload.updateUser = userInfo.empName;

          this.$api.growth.updatePush(payload)
            .then(res => {
              this.$msg.success('推送更新成功');
              setTimeout(() => {
                this.goBack();
                this.$store.growth.getPushList({
                  pageNum: pushListMeta.pageNum,
                  pageSize: pushListMeta.pageSize,
                  orderBy: 'createTime',
                  sort: 'desc',
                });
              }, 1500);
            });
        }
      }
    });
  }

  getValidation = (payload: any) => {
    // console.log('payload', payload);
    const validator = new Validator();
    // 共同需要校验
    validator.add(payload.category, [
      {
        strategy: 'isNonEmpty',
        errMsg: '请选择推送类型',
      }
    ]);

    // 推送类型是 APP 通知或是 APP + 系统通知
    if (payload.category == 1 || payload.category == 2) {
      validator.add(payload.title, [
        {
          strategy: 'isNonEmpty',
          errMsg: '请输入推送标题',
        },
        {
          strategy: 'maxLength:10',
          errMsg: '推送标题字数不得大于 10 个字',
        }
      ]);

      validator.add(payload.content, [
        {
          strategy: 'isNonEmpty',
          errMsg: '请输入推送说明',
        },
        {
          strategy: 'maxLength:35',
          errMsg: '推送标题字数不得大于 35 个字',
        }
      ]);

      // validator.add(payload.jumpUrl, [
      //   {
      //     strategy: 'isNonEmpty',
      //     errMsg: '请输入跳转地址',
      //   }
      // ]);
    }

    validator.add(payload.pushUserType, [
      {
        strategy: 'isNonEmpty',
        errMsg: '请选择推送对象',
      }
    ]);

    // 只有在输入悦跑号的状态下才需要校验 pushUids
    if (payload.pushUserType == 2) {
      validator.add(payload.pushUids, [
        {
          strategy: 'isNonEmpty',
          errMsg: '推送对象不能为空',
        }
      ]);
    }
    // 推送类型是系统通知或是 APP + 系统通知
    if (payload.type == 1 || payload.type == 3) {
      validator.add(payload.pushId, [
        {
          strategy: 'isNonEmpty',
          errMsg: '请选择通知账号',
        }
      ]);

      validator.add(payload.messageType, [
        {
          strategy: 'isNonEmpty',
          errMsg: '请选择通知类型',
        }
      ]);

      if (payload.messageType == 'RC:PSImgTxtMsg2') {
        validator.add(payload.messageTitle, [
          {
            strategy: 'isNonEmpty',
            errMsg: '请输入通知标题',
          },
          {
            strategy: 'maxLength:20',
            errMsg: '推送标题字数不得大于 20 个字',
          }
        ]);

        validator.add(payload.messageContent, [
          {
            strategy: 'isNonEmpty',
            errMsg: '请输入通知内容',
          },
          {
            strategy: 'maxLength:200',
            errMsg: '推送标题字数不得大于 200 个字',
          }
        ]);
        validator.add(payload.messageImg, [
          {
            strategy: 'isNonEmpty',
            errMsg: '通知大图不能为空',
          }
        ]);
      } else if (payload.noticeType == 'RC:TxtMsg') {
        validator.add(payload.messageContent, [
          {
            strategy: 'isNonEmpty',
            errMsg: '请输入通知内容',
          }
        ]);
      } else if (payload.noticeType == 'RC:ImgMsg') {
        validator.add(payload.messageImg, [
          {
            strategy: 'isNonEmpty',
            errMsg: '通知大图不能为空',
          }
        ]);
      }
    }

    validator.add(payload.pushTime, [
      {
        strategy: 'isNonEmpty',
        errMsg: '请选择输入推送时间',
      }
    ]);

    let errMsg: any = validator.start();

    return errMsg;
  }

  renderPushTarget = () => {
    const { getFieldDecorator, } = this.props.form;
    const { currentShowPush, setCurrentPush, } = this.props.growth;

    return (
      <>
        <FormItem
          label='推送对象'
          required
          {...getFormItemLayout(2, 6)}
        >
          {
            getFieldDecorator('pushUserType', {
              initialValue: currentShowPush && currentShowPush.pushUserType,
            })(
              <RadioGroup
                onChange={evt => {
                  setCurrentPush({
                    pushUserType: evt.target.value,
                  }, false);
                }}
              >
                {
                  pushTargetOptions.map(item => {
                    return <Radio value={item.value}>
                      {item.title}
                    </Radio>;
                  })
                }
              </RadioGroup>
            )
          }
        </FormItem>
        {
          currentShowPush.pushUserType == 1 && (
            <FormItem
              label='导入名单'
              {...getFormItemLayout(2, 8)}
              required
            >
              <Upload
                style={{
                  width: 104,
                  height: 104,
                }}
                className="logo-square"
                accept={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
                // action={''}
                fileList={currentShowPush.fileUrl}
                beforeUpload={info => {
                  if (!info.name.includes('xlsx')) {
                    this.$msg.warn('请上传 Excel 格式文件');
                    return false;
                  }
                  return true;
                }}
                customRequest={(info) => {
                  utils.uploadFile({
                    file: info.file,
                    fileName: info.file.name,
                    ypModal: 'pushMessageUidExcel',
                  }).then(url => {
                    setCurrentPush({
                      fileUrl: url,
                    }, false);
                  });
                }}
                onRemove={(info: any) => {
                  setCurrentPush({
                    fileUrl: undefined,
                  }, false);
                }}
              >
                <Button>
                  <Icon type="upload" /> 点击上传
                </Button>
              </Upload>
              <span>
                <span style={{ marginRight: 8, }}>支持扩展名：.xlsx</span>
                <a
                  href="https://joyrun-web-cdn.thejoyrun.com/neo/file/lottery_import_template.xlsx"
                  style={{ color: '#1890ff', }}>[下载模板]</a>
              </span>
            </FormItem>
          )
        }
        {
          currentShowPush.pushUserType == 2 && this.renderYpIdInput()
        }
      </>
    );
  }

  onYpIdBlur = () => {
    this.onYpIdConfirm();
    this.setState({
      selectVisible: false,
      inputValue: undefined,
    });
  }

  onYpIdSelect = (inputValue, elem?) => {
    if (Number.isNaN(Number(inputValue))) {
      return this.$msg.error('请输入正确悦跑号 ID');
    }

    if (inputValue) {
      this.setState({
        inputValue: inputValue.trim(),
      });
    } else {
      this.setState({
        inputValue: undefined,
      });
    }
  }

  onYpIdConfirm = () => {
    const { inputValue, } = this.state;
    let { pushUids, } = this.props.growth.currentShowPush;
    pushUids = utils.isEmpty(pushUids) ? [] : pushUids;
    if (Number.isNaN(Number(inputValue))) {
      return;
    }
    if (inputValue && pushUids && toJS(pushUids) instanceof Array && pushUids.indexOf(inputValue) == -1) {
      pushUids = [...pushUids, inputValue];
    }

    this.props.growth.setCurrentPush({
      pushUids: pushUids.join(','),
    }, false);
  }

  onYpIdRemove = removeTag => {
    let { currentShowPush, setCurrentPush, } = this.props.growth;
    let pushUids = currentShowPush.pushUids;
    pushUids = pushUids.filter(tag => tag != removeTag);
    setCurrentPush({
      pushUids,
    }, false);
  }

  renderYpIdInput = () => {
    const { currentShowPush, } = this.props.growth;
    const { selectVisible, } = this.state;
    const pushUids = (!utils.isEmpty(currentShowPush) && !utils.isEmpty(currentShowPush.pushUids)) ? currentShowPush.pushUids : [];

    return (
      <FormItem
        {...getFormItemLayout(2, 6)}
        label={'悦跑号清单'}
        required
      >
        {
          pushUids.map((tag, index) => {
            const isLongTag = tag && tag.legnth > 20;
            const tagElem = (
              <Tag key={tag} closable={true} onClose={() => {
                this.onYpIdRemove(tag);
              }}>
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </Tag>
            );

            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })
        }
        {
          selectVisible && (
            <Input
              ref={ref => this.$selectRef = ref}
              onBlur={this.onYpIdBlur}
              onPressEnter={this.onYpIdBlur}
              onChange={evt => {
                this.onYpIdSelect(evt.target.value);
              }}
            />
          )
        }
        {
          !selectVisible && (
            <Tag
              style={{
                background: '#FFF',
                borderStyle: 'dashed',
              }}
              onClick={() => {
                this.setState({
                  selectVisible: true,
                }, () => {
                  this.$selectRef.focus();
                });
              }}
            >
              <Icon type={'plus'} />
              添加
            </Tag>
          )
        }
      </FormItem>
    );
  }

  renderPushInfo = () => {
    const { getFieldDecorator, } = this.props.form;
    const { currentShowPush, setCurrentPush, } = this.props.growth;

    return (
      <>
        <FormItem
          label='推送标题'
          {...getFormItemLayout(2, 6)}
          required>
          {
            getFieldDecorator('title', {
              initialValue: currentShowPush && currentShowPush.title,
            })(
              <Input
                placeholder='请输入推送标题'
                onChange={evt => {
                  // console.log('evt', evt.target.value);
                  setCurrentPush({
                    title: evt.target.value,
                  }, false);
                }}
              />
            )
          }
        </FormItem>
        <FormItem
          label='推送说明'
          {...getFormItemLayout(2, 6)}
          required
        >
          {
            getFieldDecorator('content', {
              initialValue: currentShowPush && currentShowPush.content,
            })(
              <TextArea rows={6} onChange={evt => {
                setCurrentPush({
                  content: evt.target.value,
                }, false);
              }} placeholder="请输入推送说明" />)
          }
        </FormItem>
        {this.renderUploadComponent({
          label: '推送图片',
          field: 'coverImg',
          format: 'image/png',
          bgFlag: true,
          tip: '*图片尺寸为 300*300px，仅限 png 格式（该图片只对 iOS 系统生效）',
        })}
        <FormItem
          label='跳转地址'
          {...getFormItemLayout(2, 6)}
        >
          {
            getFieldDecorator('jumpUrl', {
              initialValue: currentShowPush && currentShowPush.jumpUrl,
            })(
              <Input
                placeholder='请输入跳转地址'
                onChange={evt => {
                  setCurrentPush({
                    jumpUrl: evt.target.value,
                  }, false);
                }}
              />
            )
          }
          <span className='form-tip'>
            不填写则跳转至悦跑圈 APP “我的-消息”主页
          </span>
        </FormItem>
      </>
    );
  }

  renderUploadComponent = (config) => {
    const { getFieldDecorator, } = this.props.form;
    const { setCurrentPush, currentShowPush, } = this.props.growth;

    return (
      <FormItem
        className='form-upload'
        label={
          <label>
            <span>{config.label}</span>
          </label>
        }
        labelCol={{ span: config.labelCol || 2, }}
        wrapperCol={{ span: config.wrapperCol || 18, }}
        required={config.required || false}
      >
        {getFieldDecorator(config.field, {
          initialValue: currentShowPush && currentShowPush[config.field],
        })(
          <Upload
            key={config.field}
            className={`logo-square ${config.className}`}
            accept={config.format || 'image/*'}
            action={''}
            listType="picture-card"
            onPreview={file => this.handlePreview(file, config.bgFlag)}
            beforeUpload={file => {
              if (config.format) {
                const isCorrectFormat = file.type === config.format;

                if (!isCorrectFormat) {
                  this.$msg.error('请上传正确格式图片');
                }

                return isCorrectFormat;
              }
              return true;
            }}
            onRemove={(info) => {
              setCurrentPush({
                [config.field]: undefined,
              }, false);
              this.setState({ bgFlag: false, });
            }}
            customRequest={info => this.customRequest(config, info)}
            fileList={currentShowPush && currentShowPush[config.field]}
          >
            {uploadButton}
          </Upload>
        )}
        <span className='form-upload-tip'>
          {config.tip}
        </span>
      </FormItem>
    );
  }

  renderNoticeInfo = () => {
    const { getFieldDecorator, } = this.props.form;
    const { currentShowPush, setCurrentPush, } = this.props.growth;

    return (
      <>
        <FormItem
          label='通知账号'
          className='push-account-select'
          {...getFormItemLayout(2, 6)}
          required
        >
          {
            getFieldDecorator('pushId', {
              initialValue: currentShowPush && currentShowPush.pushId,
            })(
              <Select
                // @ts-ignore
                getPopupContainer={() => document.getElementsByClassName('push-account-select')[0]}
                placeholder='请选择通知账号'
                onChange={(value, elem: any) => {
                  setCurrentPush({
                    pushId: value,
                  }, false);
                }}
              >
                {
                  noticeAccountOptions.map(item => (
                    // @ts-ignore
                    <Option key={item.value}>
                      {item.title}
                    </Option>
                  ))
                }
              </Select>
            )
          }
        </FormItem>
        <FormItem
          label='通知类型'
          className='message-type-select'
          {...getFormItemLayout(2, 6)}
          required
        >
          {
            getFieldDecorator('messageType', {
              initialValue: currentShowPush && currentShowPush.messageType,
            })(
              <Select
                // @ts-ignore
                getPopupContainer={() => document.getElementsByClassName('message-type-select')[0]}
                placeholder='请选择通知类型'
                onChange={(value, elem: any) => {
                  setCurrentPush({
                    messageType: value,
                  }, false);
                }}
              >
                {
                  noticeTypeOptions.map(item => (
                    // @ts-ignore
                    <Option key={item.value}>
                      {item.title}
                    </Option>
                  ))
                }
              </Select>
            )
          }
        </FormItem>
        {
          (utils.isEmpty(currentShowPush.messageType) || currentShowPush.messageType == 'RC:PSImgTxtMsg2') && (
            <FormItem
              label='通知标题'
              {...getFormItemLayout(2, 6)}
              required>
              {
                getFieldDecorator('messageTitle', {
                  initialValue: currentShowPush && currentShowPush.messageTitle,
                })(
                  <Input
                    placeholder='请输入通知标题'
                    onChange={evt => {
                      setCurrentPush({
                        messageTitle: evt.target.value,
                      }, false);
                    }}
                  />
                )
              }
            </FormItem>
          )
        }
        {
          (utils.isEmpty(currentShowPush.messageType) ||
            currentShowPush.messageType == 'RC:TxtMsg' ||
            currentShowPush.messageType == 'RC:PSImgTxtMsg2') &&
          (
            <FormItem
              label='通知内容'
              {...getFormItemLayout(2, 6)}
              required
            >
              {
                getFieldDecorator('messageContent', {
                  initialValue: currentShowPush && currentShowPush.messageContent,
                })(
                  <TextArea rows={6} onChange={evt => {
                    setCurrentPush({
                      messageContent: evt.target.value,
                    }, false);
                  }} placeholder="请输入通知内容" />)
              }
            </FormItem>
          )
        }
        {
          (!currentShowPush.messageType
            ||
            currentShowPush.messageType == 'RC:PSImgTxtMsg2'
            ||
            currentShowPush.messageType == 'RC:ImgMsg')
          &&
          this.renderUploadComponent({
            label: '通知大图',
            field: 'messageImg',
            format: 'image/png',
            bgFlag: true,
            required: true,
            tip: '*图片尺寸为 900*500px，仅限 png 格式',
          })
        }
      </>
    );
  }

  renderModal = () => {
    const { previewImage, previewVisible, } = this.state;
    return (
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={this.handleCancel}
      >
        <img alt="example" style={{ width: '100%', }} src={previewImage} />
      </Modal>
    );
  }

  handleCancel = () => {
    this.setState({ previewVisible: false, });
  }

  handlePreview = (file, bgFlag) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
      bgFlag,
    });
  }

  customRequest = (config, info) => {
    const { setCurrentPush, } = this.props.growth;

    if (config.limit && (info.file.size / 1024 > config.limit)) {
      this.$msg.error(`图片大小不得超过 ${config.limit}kb`);
      return Promise.reject(0);
    }

    utils.uploadFile({
      file: info.file,
      fileName: info.file.name,
      ypModel: 'pushMessagePicture',
    }).then(url => {
      setCurrentPush({
        [config.field]: url,
      }, false);
    });
  }

  onPushDelete = () => {
    const { currentPush, } = this.props.growth;

    confirm({
      title: '推送删除操作',
      content: '请问是否删除当前推送？',
      onOk: async () => {
        const res = await this.$api.growth.deletePush({
          params: {
            taskId: currentPush.taskId,
          },
        });
        if (res.data.ret == 0) {
          this.$msg.success('推送删除成功');
          setTimeout(() => {
            this.goBack();
            this.$store.growth.getPushList({
              pageNum: 1,
              pageSize: 14,
            });
          }, 1500);
        } else {
          this.$msg.error(res.msg);
        }
      },
      onCancel: () => {
      },
    });
  }

  render() {
    const { currentPush, } = this.props.growth;

    return (
      <div className='editor app-push-editor'>
        <section className='editor-content panel-block'>
          {this.renderEditor()}
          {
            (currentPush.taskId && currentPush.taskId != 0 && currentPush.pushStatus != 4) && (
              <section className='editor-del-btn' onClick={this.onPushDelete}>
                <Icon type="delete" />
                <span style={{ color: '#1890ff', cursor: 'pointer', }}>删除推送</span>
              </section>
            )
          }
        </section>
        <section className="editor-modal">
          {this.renderModal()}
        </section>
      </div>
    );
  }
}