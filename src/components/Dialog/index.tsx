import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Modal } from "antd";
import DialogTitle from './DialogTitle';
import DialogDetail from './DialogDetail';
import DialogRemark from './DialogRemark';
import closeModalIcon from "assets/img/close-modal-icon.svg";
interface IDialogModalProps {
  onCancel: () => void;
}
export default class Dialog extends BaseReact<IDialogModalProps> {

  render() {
    const { onCancel, } = this.props;
    return (
      <Modal
        visible={true}
        title={<DialogTitle />}
        footer={null}
        closeIcon={<img src={closeModalIcon} alt="close-modal-icon" />}
        onCancel={onCancel}
      >
        <DialogDetail />
        <DialogRemark/>
      </Modal>

    );
  }

}
