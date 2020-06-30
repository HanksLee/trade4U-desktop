import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/@shared/BaseReact";
import { Modal, Form, Input, Button, DatePicker, Upload, Cascader } from "antd";
import moment from "moment";
import { RcFile } from "antd/lib/upload";
//import { inject, observer } from "mobx-react";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";
import api from "services";
import closeModalIcon from "assets/img/close-modal-icon.svg";
import accountIcon from "assets/img/account-icon.svg";
import accountActiveIcon from "assets/img/account-active-icon.svg";
import settingsIcon from "assets/img/settings-icon.svg";
import settingsActiveIcon from "assets/img/settings-active-icon.svg";
import finishedIcon from "assets/img/finished-icon.svg";
import unfinishedIcon from "assets/img/unfinished-icon.svg";
import successIcon from "assets/img/success-icon.svg";
import rejectIcon from "assets/img/reject-icon.svg";
import cameraIcon from "assets/img/camera-icon.svg";
// import stopIcon from "assets/img/stop-icon.svg";
import "./index.scss";
import { stringify } from "querystring";

interface ISettingsModalProps {
  onCancel: () => void;
}

interface ISettingsModalState {
  userInfo: any[];
  id_card_front: string;
  id_card_back: string;
  currentTab: string;
  phone: string;
  phoneDisplay: string;
  currentItem: any;
  modelTitle: string;
  smsKey: any;
  verifyPass: boolean;
  inputDisabled: boolean;
}

const country = [
  {
    label: "HongKong",
    value: "hk",
  },
  {
    label: "China",
    value: "china",
  }
];

const layout = {
  labelCol: { span: 8, },
  wrapperCol: { span: 16, },
};
// @ts-ignore

export default class EditSettingsModal extends BaseReact<
  ISettingsModalProps,
  ISettingsModalState
  > {
  state = {
    userInfo: [],
    id_card_front: "",
    id_card_back: "",
    phone: "",
    phoneDisplay: "",
    currentTab: "account",
    currentItem: null,
    modelTitle: "设定",
    smsKey: null,
    verifyPass: false,
    inputDisabled: false,
  };

  formRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    this.getList();
  }

  closeModal = () => {
    this.setState({
      currentTab: "account",
      currentItem: null,
      modelTitle: "設定",
      smsKey: null,
      verifyPass: false,
    });
  };

  getList = async () => {
    const res = await api.settings.getAccountInfo({});
    if (res.status === 200) {
      const getPhone = res.data.phone;
      const phoneLength = getPhone.length;
      let hidePhone = "";
      if (phoneLength > 6) {
        for (let i = 0; i < phoneLength - 6; i++) {
          hidePhone += "*";
        }
      }

      const phoneDisplay =
        getPhone.substring(0, 3) +
        hidePhone +
        getPhone.substring(phoneLength - 3, phoneLength);

      if (res.data.inspect_status === 2 || res.data.inspect_status === 1) {
        this.setState({ inputDisabled: true })
      }

      this.setState(
        {
          userInfo: res.data,
          id_card_front: res.data.id_card_front,
          id_card_back: res.data.id_card_back,
          phone: res.data.phone,
          phoneDisplay: phoneDisplay,
        },
        () => {
          this.formRef.current.setFieldsValue({
            first_name: this.state.userInfo["first_name"] || "",
            last_name: this.state.userInfo["last_name"] || "",
            birth: utils.isEmpty(this.state.userInfo["birth"])
              ? ""
              : moment(this.state.userInfo["birth"]),
            id_card: this.state.userInfo["last_name"] || "",
            mobile: this.state.userInfo["mobile"] || "",
            nationality: utils.isEmpty(this.state.userInfo["nationality"])
              ? ""
              : [this.state.userInfo["nationality"]],
            country_of_residence: utils.isEmpty(
              this.state.userInfo["country_of_residence"]
            )
              ? ""
              : [this.state.userInfo["country_of_residence"]],
            street: this.state.userInfo["street"] || "",
            city: this.state.userInfo["city"] || "",
            postal: this.state.userInfo["postal"] || "",
            email: this.state.userInfo["email"] || "",
          });
        }
      );
    }
  };

  switchItem = (ItemIndex: any) => {
    this.setState({ currentItem: ItemIndex, });
    if (ItemIndex === "reset-pwd") {
      this.setState({ modelTitle: "重设密码", });
    }
  };

  switchTab = (tabIndex: any) => {
    this.setState({ currentTab: tabIndex, });
  };

  goBack = () => {
    this.setState({});
  };

  disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current > moment().endOf("day");
  };

  beforeIdCardFrontUpload = file => {
    this.uploadFile(file, "id_card_front");
    return false;
  };

  beforeIdCardBackUpload = file => {
    this.uploadFile(file, "id_card_back");
    return false;
  };

  uploadFile = async (file: RcFile, name: string) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.common.uploadFile(formData);
    this.setState({ [name]: res.data.file_path, });
  };

  handleAccountSubmit = async (values: any) => {
    const { userInfo, id_card_back, id_card_front, } = this.state;
    if (userInfo["inspect_status"] === 1) {
      return false;
    }

    let payload = {
      last_name: values.last_name,
      first_name: values.first_name,
      birth:
        values.birth == "" ? "" : moment(values.birth).format("YYYY-MM-DD"),
      id_card: values.id_card,
      mobile: values.mobile,
      nationality:
        values.nationality == undefined ? "" : values.nationality.toString(),
      country_of_residence:
        values.country_of_residence == undefined
          ? ""
          : values.country_of_residence.toString(),
      street: values.street,
      city: values.city,
      postal: values.postal,
      email: values.email,
      id_card_back,
      id_card_front,
      inspect_status: 1,
    };

    const res = await api.settings.updateAccountInfo(payload);

    if (res.status === 200) {
      this.$msg.success("帐号资料更新成功");
      this.getList();
    }
  };

  sendSMS = async () => {
    let payload = {
      type: "reset_pwd_sms",
    };
    const res = await api.settings.sendSMS(payload);

    if (res.status === 201) {
      this.setState({ smsKey: res.data.key, });
    }
  };

  handleVerifySubmit = async (values: any) => {
    const { smsKey, } = this.state;

    let payload = {
      ...values,
      key: smsKey,
    };

    const res = await api.settings.verifySMS(payload);

    if (res.status === 201) {
      this.setState({ verifyPass: true, smsKey: res.data.key, });
    }
  };

  handleResetPwdSubmit = async (values: any) => {
    const { onCancel, } = this.props;
    if (values["password"] !== values["check-password"]) {
      this.$msg.error("两次密码不一样");
      return false;
    }
    const { smsKey, } = this.state;

    let payload = {
      key: smsKey,
      password: values["password"],
    };

    const res = await api.settings.resetPassword(payload);

    if (res.status === 200) {
      this.$msg.success("密码重设成功");
      setTimeout(() => {
        onCancel();
      }, 3500);
    }
  };

  renderStatus = () => {
    const { userInfo, } = this.state;
    return (
      <div className="info-status-wrap">
        <div className="info-status-line"></div>
        {userInfo["inspect_status"] === 0 && (
          <div className="info-status">
            <img src={unfinishedIcon} alt="unfinished-icon" />
            <p className="ant-upload-text">{"待填写信息"}</p>
          </div>
        )}
        {userInfo["inspect_status"] !== 0 && (
          <div className="info-status">
            <img src={successIcon} alt="success-icon" />
            <p className="ant-upload-text" style={{ color: "#4a93f4", }}>
              {"待填写信息"}
            </p>
          </div>
        )}
        {userInfo["inspect_status"] === 0 && (
          <div className="info-status">
            <img src={unfinishedIcon} alt="unfinished-icon" />
            <p className="ant-upload-text">{"信息审核中"}</p>
          </div>
        )}
        {userInfo["inspect_status"] === 1 && (
          <div className="info-status">
            <img src={finishedIcon} alt="finished-icon" />
            <p className="ant-upload-text" style={{ color: "#6dd400", }}>
              {"信息审核中"}
            </p>
          </div>
        )}
        {(userInfo["inspect_status"] === 2 ||
          userInfo["inspect_status"] === 3) && (
            <div className="info-status">
              <img src={successIcon} alt="success-icon" />
              <p className="ant-upload-text" style={{ color: "#4a93f4", }}>
                {"信息审核中"}
              </p>
            </div>
          )}
        {(userInfo["inspect_status"] === 0 ||
          userInfo["inspect_status"] === 1) && (
            <div className="info-status">
              <img src={unfinishedIcon} alt="unfinished-icon" />
              <p className="ant-upload-text">{"信息待审核"}</p>
            </div>
          )}
        {userInfo["inspect_status"] === 2 && (
          <div className="info-status">
            <img src={successIcon} alt="success-icon" />
            <p className="ant-upload-text" style={{ color: "#4a93f4", }}>
              {"信息已通过"}
            </p>
          </div>
        )}
        {userInfo["inspect_status"] === 3 && (
          <div className="info-status">
            <img src={rejectIcon} alt="reject-icon" />
            <p className="ant-upload-text" style={{ color: "#ff3b30", }}>
              {"信息未通过"}
            </p>
          </div>
        )}
      </div>
    );
  };

  renderAccount = () => {
    const { id_card_front, id_card_back, userInfo, inputDisabled } = this.state;

    return (
      <>
        {this.renderStatus()}
        {!utils.isEmpty(userInfo["reason"]) &&
          userInfo["inspect_status"] === 3 && (
            <div className="error-msg">{`未通过信息：${userInfo["reason"]}`}</div>
          )}
        <Form
          name="basic"
          {...layout}
          ref={this.formRef}
          onFinish={this.handleAccountSubmit}
        // onFinishFailed={onFinishFailed}
        >
          <Form.Item label="名字" name="first_name">
            <Input disabled={inputDisabled} />
          </Form.Item>

          <Form.Item label="姓氏" name="last_name">
            <Input disabled={inputDisabled} />
          </Form.Item>

          <Form.Item name="birth" label="出生日期">
            <DatePicker
              placeholder="请选择出生日期"
              style={{ width: "100%", }}
              disabledDate={this.disabledDate}
              disabled={inputDisabled}
            />
          </Form.Item>

          <Form.Item
            label="身分证号"
            name="id_card"
            rules={[
              {
                type: "number",
                message: "身分证号只能有数字",
                transform(value) {
                  return Number(value) ? Number(value) : 0;
                },
              }
            ]}
          >
            <Input disabled={inputDisabled} />
          </Form.Item>

          {/* <div className="id-card-title">{"身分证照片"}</div> */}
          <div className="id-card-form">
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={this.beforeIdCardFrontUpload}
              disabled={inputDisabled}
            >
              {id_card_front ? (
                <div className="upload-image-preview">
                  <img
                    src={id_card_front}
                    alt="id-card-front"
                    style={{ height: "100%", }}
                  />
                </div>
              ) : (
                  <div className="upload-image-preview">
                    <div>
                      <img src={cameraIcon} alt="camera-icon" />
                      <p className="ant-upload-text">{"上传身分证正面"}</p>
                    </div>
                  </div>
                )}
            </Upload>
            <Upload
              accept="image/*"
              listType="picture-card"
              showUploadList={false}
              beforeUpload={this.beforeIdCardBackUpload}
              disabled={inputDisabled}
            >
              {id_card_back ? (
                <div className="upload-image-preview">
                  <img
                    src={id_card_back}
                    alt="id-card-back"
                    style={{ height: "100%", }}
                  />
                </div>
              ) : (
                  <div className="upload-image-preview">
                    <div>
                      <img src={cameraIcon} alt="camera-icon" />
                      <p className="ant-upload-text">{"上传身分证反面"}</p>
                    </div>
                  </div>
                )}
            </Upload>
          </div>

          <Form.Item
            label="手机号"
            name="mobile"
            rules={[
              {
                type: "number",
                message: "手机号只能有数字",
                transform(value) {
                  return Number(value) ? Number(value) : 0;
                },
              }
            ]}
          >
            <Input disabled={inputDisabled} />
          </Form.Item>

          <Form.Item label="国籍" name="nationality">
            <Cascader options={country} placeholder="请选择国籍" disabled={inputDisabled} />
          </Form.Item>

          <Form.Item label="居住国" name="country_of_residence">
            <Cascader options={country} placeholder="请选择居住国" disabled={inputDisabled} />
          </Form.Item>

          <Form.Item label="街道" name="street">
            <Input disabled={inputDisabled} />
          </Form.Item>

          <Form.Item label="城市" name="city">
            <Input disabled={inputDisabled} />
          </Form.Item>

          <Form.Item
            label="邮递区号"
            name="postal"
            rules={[
              {
                type: "number",
                message: "邮递区号只能有数字",
                transform(value) {
                  return Number(value) ? Number(value) : 0;
                },
              }
            ]}
          >
            <Input disabled={inputDisabled} />
          </Form.Item>

          <Form.Item
            label="邮件"
            name="email"
            className="email-container"
            rules={[
              {
                type: "email",
                message: "信箱格式有误",
              }
            ]}
          >
            <Input disabled={inputDisabled} />
          </Form.Item>

          {userInfo["inspect_status"] !== 2 && (
            <Form.Item className="submit-container">
              {(userInfo["inspect_status"] === 0 ||
                userInfo["inspect_status"] === 3) && (
                  <Button htmlType="submit">{"送出"}</Button>
                )}
              {userInfo["inspect_status"] === 1 && (
                <Button htmlType="submit" style={{ cursor: "default", }}>
                  {"审核中"}
                </Button>
              )}
            </Form.Item>
          )}
        </Form>
      </>
    );
  };

  renderSettings = () => {
    const { currentItem, phoneDisplay, verifyPass, } = this.state;
    return (
      <>
        {!currentItem && (
          <div className="items-container">
            <div className="settings-item">
              <span>语言</span>
              <span>中文</span>
              <span>修改</span>
            </div>
            <div className="settings-item">
              <span>图表</span>
              <span>柱状图</span>
              <span>修改</span>
            </div>
            <div className="settings-item">
              <span>登入密码</span>
              <span>******</span>
              <span
                onClick={() => {
                  this.switchItem("reset-pwd");
                }}
              >
                修改
              </span>
            </div>
          </div>
        )}
        {currentItem === "reset-pwd" &&
          (!verifyPass ? (
            <Form onFinish={this.handleVerifySubmit}>
              <div className="pwd-container">
                <p>为保障您的帐户安全，需透过简讯验证您的身份</p>
                <div className="phone-input">{phoneDisplay}</div>
                <div className="verify-code-input">
                  <Form.Item
                    name="code"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "验证码不得为空",
                      }
                    ]}
                  >
                    <Input placeholder="请输入简讯验证码" />
                  </Form.Item>
                  <span className="sms-btn" onClick={this.sendSMS}>
                    发送简讯验证码
                  </span>
                </div>
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{ cursor: "default", width: "100%", }}
                  >
                    {"手机验证"}
                  </Button>
                </Form.Item>
              </div>
            </Form>
          ) : (
              <Form onFinish={this.handleResetPwdSubmit}>
                <div className="pwd-container">
                  <div>
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "新密码不得为空",
                        },
                        {
                          whitespace: true,
                          message: "新密码不得为空",
                        }
                      ]}
                    >
                      <Input.Password placeholder="请输入新的密码" />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      name="check-password"
                      rules={[
                        {
                          required: true,
                          message: "确认密码不得为空",
                        },
                        {
                          whitespace: true,
                          message: "确认密码不得为空",
                        }
                      ]}
                    >
                      <Input.Password placeholder="再次确认新的密码" />
                    </Form.Item>
                  </div>

                  <Form.Item>
                    <Button htmlType="submit" style={{ cursor: "default", }}>
                      {"确认"}
                    </Button>
                  </Form.Item>
                </div>
              </Form>
            ))}
      </>
    );
  };

  render() {
    const { currentTab, modelTitle, currentItem, } = this.state;
    const { onCancel, } = this.props;
    return (
      <Modal
        visible={true}
        title={modelTitle}
        width="400px"
        closeIcon={<img src={closeModalIcon} alt="close-modal-icon" />}
        footer={null}
        centered
        afterClose={this.closeModal}
        onCancel={onCancel}
      >
        <div className="settings-wrap">
          {!currentItem && (
            <div className="settings-tab">
              <div
                className="tab"
                onClick={() => {
                  this.switchTab("account");
                }}
              >
                <p>
                  {currentTab !== "account" ? (
                    <img src={accountIcon} alt="account-icon" />
                  ) : (
                      <img src={accountActiveIcon} alt="account-icon" />
                    )}
                </p>

                <p className={currentTab !== "account" ? "" : "active"}>
                  帐户资讯
                </p>
              </div>
              <div
                className="tab"
                onClick={() => {
                  this.switchTab("settings");
                }}
              >
                <p>
                  {currentTab !== "settings" ? (
                    <img src={settingsIcon} alt="settings-icon" />
                  ) : (
                      <img src={settingsActiveIcon} alt="settings-icon" />
                    )}
                </p>

                <p className={currentTab !== "settings" ? "" : "active"}>
                  使用设定
                </p>
              </div>
            </div>
          )}
          <div className="settings-content">
            {currentTab === "account" && this.renderAccount()}
            {currentTab === "settings" && this.renderSettings()}
          </div>
        </div>
      </Modal>
    );
  }
}
