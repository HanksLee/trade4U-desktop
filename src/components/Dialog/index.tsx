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

 

  componentDidMount() {
   
  }
  onClose = () => {
    this.props.onCancel();
  }
  reloadData=(market)=>{
    this.props.onTabClick(market);
  }
 

  render() {
    const { onCancel, subscribe_data, } = this.props;
    return (
      <Modal
        visible={true}
        title={<DialogTitle subscribe_data={subscribe_data} />}
        footer={null}
        closeIcon={<img src={closeModalIcon} alt="close-modal-icon" />}
        onCancel={onCancel}
      >
        <DialogDetail onClose={this.onClose} reloadData={this.reloadData} subscribe_data={subscribe_data} />
        <DialogRemark />
      </Modal>

    );
  }

}
