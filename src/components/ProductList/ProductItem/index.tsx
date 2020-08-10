import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { Row } from "antd";

import ProductRow from './ProductRow';
import ProductDetail from './ProductDetail';


export default class ProductItem extends BaseReact {
  state={
    id:0,
    listId:0,
    rowInfo:null,
    detailInfo:null,
    priceType:null,
    isActive:false,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  
  render() {
    const {
      id,
      rowInfo,
      detailInfo,
      priceType,
      isActive,
      listId,
    } = this.state;
    
    
    return (
      <Row
        className={"custom-table-item"}
        key={id}
        type={"flex"}
        justify={"space-between"}
        onClick={e => {
          this.onSingleClick(id, isActive);
        }}
        onDoubleClick={e => {
          this.onDoubleClick();
        }}
      >
        <ProductRow {...rowInfo} priceType={priceType} {...this.props} />
        <ProductDetail {...detailInfo} isActive={isActive} />
      
      </Row>
    );
  }


  //function
  onSingleClick(id, isActive) {
    this.props.setOpenItem(isActive ? -1 : id);
  }

  onDoubleClick() {

  }


}
