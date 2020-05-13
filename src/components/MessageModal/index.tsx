import * as React from "react";
//import utils from "utils";
import { BaseReact } from "components/@shared/BaseReact";
import { Modal, Pagination } from "antd";
import moment from "moment";
//import { inject, observer } from "mobx-react";
// import { stringify } from "querystring";
// import Password from "antd/lib/input/Password";
import api from "services";
import closeModalIcon from "assets/img/close-modal-icon.svg";
import "./index.scss";

interface IMessageModalProps {
  onCancel: () => void;
}

interface IMessageModalState {
  messageList: any[];
  messageType: string;
  total: number;
  page: number;
  page_size: number;
  detailContent: any;
}

// @ts-ignore

export default class EditMessageModal extends BaseReact<
  IMessageModalProps,
  IMessageModalState
> {
  state = {
    messageList: [],
    messageType: "notify",
    total: 0,
    page: 1,
    page_size: 5,
    detailContent: null
  };

  componentDidMount() {
    this.getList();
  }

  goBack = () => {
    this.setState({ detailContent: null });
  };

  onDetailChange = (item: any) => {
    this.setState({ detailContent: item });
  };

  onPageChange = page => {
    this.setState(
      {
        page: page
      },
      this.getList
    );
  };

  changeMessageType = (type: string) => {
    this.setState({ messageType: type, page: 1 }, this.getList);
  };

  getList = async () => {
    const { messageType, page, page_size } = this.state;
    let res: any;
    if (messageType == "notify") {
      res = await api.message.getNotificationmessage(
        `page_size=${page_size}&page=${page}`,
        {}
      );
    }
    if (messageType == "announcement") {
      res = await api.message.getMessage(
        `page_size=${page_size}&page=${page}`,
        {}
      );
    }

    if (res.status === 200) {
      this.setState({ messageList: res.data.results, total: res.data.count });
    }
  };

  closeModal = () => {
    this.setState({
      messageList: [],
      messageType: "notify",
      total: 0,
      page: 1,
      page_size: 5,
      detailContent: null
    });
  };

  render() {
    const {
      messageList,
      messageType,
      page_size,
      total,
      detailContent
    } = this.state;
    const { onCancel } = this.props;
    return (
      <Modal
        visible={true}
        title={"信息中心"}
        width="70%"
        closeIcon={<img src={closeModalIcon} alt="close-modal-icon" />}
        footer={null}
        centered
        afterClose={this.closeModal}
        onCancel={onCancel}
      >
        {detailContent && (
          <div className="go-back" onClick={this.goBack}>
            回上一頁
          </div>
        )}
        <div className="message-wrap">
          {!detailContent && (
            <div className="message-menu">
              <p
                className={messageType === "notify" ? "active" : ""}
                onClick={() => this.changeMessageType("notify")}
              >
                系統公告
              </p>
              <p
                className={messageType === "announcement" ? "active" : ""}
                onClick={() => this.changeMessageType("announcement")}
              >
                站內消息
              </p>
            </div>
          )}

          <div className="message-content">
            <ul className="message-list">
              {!detailContent ? (
                messageList.map(item => {
                  return (
                    <li>
                      <strong>{item.title}</strong>
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            item.content.length > 100
                              ? `${item.content.substring(0, 100)}...`
                              : item.content
                        }}
                        className="content"
                      ></p>
                      <p className="more-info">
                        <span className="create-time">
                          {moment(item.create_time * 1000).format(
                            "YYYY.MM.DD HH:mm:ss"
                          )}
                        </span>
                        <span
                          className="see-more"
                          onClick={() => {
                            this.onDetailChange(item);
                          }}
                        >
                          查看更多
                        </span>
                      </p>
                    </li>
                  );
                })
              ) : (
                <div className="detail-content">
                  <strong>{detailContent.title}</strong>
                  <p>
                    <span>
                      {moment(detailContent.create_time * 1000).format(
                        "YYYY.MM.DD HH:mm:ss"
                      )}
                    </span>
                  </p>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: detailContent.content
                    }}
                    className="content"
                  ></p>
                </div>
              )}
            </ul>
            {!detailContent && (
              <Pagination
                current={this.state.page}
                onChange={this.onPageChange}
                total={total}
                pageSize={page_size}
              />
            )}
          </div>
        </div>
      </Modal>
    );
  }
}
