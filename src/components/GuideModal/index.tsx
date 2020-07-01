import * as React from "react";
import utils from "utils";
import { BaseReact } from "components/@shared/BaseReact";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Cascader,
  Steps
} from "antd";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import closeModalIcon from "assets/img/close-modal-icon.svg";
import flowAccountSVG from "assets/img/flow-account.svg";
import flowAuditSVG from "assets/img/flow-audit.svg";
import flowCapitalSVG from "assets/img/flow-capital.svg";
import flowExchangeSVG from "assets/img/flow-exchange.svg";
// import stopIcon from "assets/img/stop-icon.svg";
import { PlusCircleOutlined, PlusCircleFilled } from "@ant-design/icons";

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
const { Step, } = Steps;

const STATUS = 3;

const getDomMap = self => {
  const domMap = {
    "-1": {
      // cover: flowAccountPng,
      cover: flowAccountSVG,
      title: "开户去",
      desc: "一步步验证资料·立刻体验",
      actions: [
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
          }}
        >
          返回
        </Button>,
        <Button
          onClick={() => {
            self.props.common.toggleSettingsModalVisible();
            self.props.common.toggleGuideModalVisible();
          }}
        >
          去填写
        </Button>
      ],
    },
    0: {
      // cover: flowAccountPng,
      cover: flowAccountSVG,
      title: "开户去",
      desc: "一步步验证资料·立刻体验",
      actions: [
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
          }}
        >
          返回
        </Button>,
        <Button
          onClick={() => {
            self.props.common.toggleSettingsModalVisible();
            self.props.common.toggleGuideModalVisible();
          }}
        >
          去填写
        </Button>
      ],
    },
    1: {
      // cover: flowAuditPng,
      cover: flowAuditSVG,
      title: "系统审核",
      desc: "资料审核中·请耐心等候",
      actions: [
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
          }}
        >
          返回
        </Button>
      ],
    },
    2: {
      // cover: flowCapitalPng,
      cover: flowCapitalSVG,
      title: "投入资金",
      desc: "投入小笔资金·荷包赚饱饱",
      actions: [
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
          }}
        >
          返回
        </Button>,
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
            self.props.history.push("/dashboard/captial");
            self.props.common.setCurrentTab("资金");
          }}
        >
          入金
        </Button>
      ],
    },
    3: {
      // cover: flowExchangePng,
      cover: flowExchangeSVG,
      title: "立马交易",
      desc: "您已成功入金·可开始下单",
      actions: [
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
          }}
        >
          返回
        </Button>,
        <Button
          onClick={() => {
            self.props.common.toggleGuideModalVisible();
            self.props.history.push("/dashboard/symbol");
            self.props.common.setCurrentTab("个股");
          }}
        >
          交易去
        </Button>
      ],
    },
  };

  return domMap;
};

// @ts-ignore
@withRouter
@inject("common")
@observer
export default class GuideModal extends BaseReact<
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
    modelTitle: "审核流程",
    smsKey: null,
    verifyPass: false,
  };

  formRef = React.createRef<HTMLInputElement>();

  componentDidMount() { }

  closeModal = () => {
    this.setState({
      currentTab: "account",
      currentItem: null,
      modelTitle: "設定",
      smsKey: null,
      verifyPass: false,
    });
  };

  renderSteps = () => {
    const { computedUserInfo, } = this.props.common;

    const customDot = (dot, { status, index, }) =>
      status == "finish" ? (
        <div className={"progress-circle"}></div>
      ) : (
          <PlusCircleFilled />
        );

    return (
      <Steps
        className={"guide-modal-steps"}
        size={"small"}
        current={computedUserInfo.user_status}
        progressDot={customDot}
      >
        <Step title="完善资料" />
        <Step title="审核" />
        <Step title="入金" />
        <Step title="交易" />
      </Steps>
    );
  };

  renderTip = () => {
    const { computedUserInfo, } = this.props.common;
    const domMap = getDomMap(this);
    const domInfo = domMap[computedUserInfo?.user_status] || {};
    // const domInfo = domMap[STATUS] || {};

    return (
      <div className={"guide-content"}>
        <img src={domInfo?.cover} alt="" />
        <h3>{domInfo?.title}</h3>
        <p>{domInfo?.desc}</p>
        <div className={"guide-content-actions"}>
          {domInfo?.actions.map(item => {
            return item;
          })}
        </div>
      </div>
    );

    return domMap[computedUserInfo?.user_status] || null;
  };

  render() {
    const { currentTab, modelTitle, currentItem, } = this.state;
    const {
      onCancel,
      common: { computedUserInfo, },
    } = this.props;
    const domMap = getDomMap(this);
    const domInfo = domMap[computedUserInfo?.user_status] || {};
    // const domInfo = domMap[STATUS] || {};
    return (
      <Modal
        visible={true}
        title={domInfo?.title || modelTitle}
        className={"guide-modal"}
        width="400px"
        closeIcon={<img src={closeModalIcon} alt="close-modal-icon" />}
        footer={null}
        centered
        afterClose={this.closeModal}
        onCancel={onCancel}
      >
        <div className="settings-wrap">
          {this.renderSteps()}
          {this.renderTip()}
        </div>
      </Modal>
    );
  }
}
