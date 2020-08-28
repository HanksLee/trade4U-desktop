import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, toJS } from "mobx";

import { Button} from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import { SCREEN_DETAIL, SCREEN_BUY } from 'pages/Symbol/Right/config/screenList';
import ToolHeader from "components/SymbolTool/ToolHeader";
import MainDetail from 'components/SymbolTool/MainDetail'
import ContractDetail from 'components/SymbolTool/ContractDetail'
import utils from "utils";

import classNames from 'classnames/bind'
import globalCss from 'app.module.scss'

const globalCx = classNames.bind(globalCss);
export default class Detail extends BaseReact<{}, {}> {
  state ={
    type:"",
    data:null,
  }
  constructor(props) {
    super(props);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.type === SCREEN_DETAIL || nextState.type ===  SCREEN_BUY ;
  }


  render() {
    const { type, data, } = this.state;
 
    const showCls = (type === SCREEN_DETAIL || type === SCREEN_BUY) &&
                      data ? 
      "show" : "";
    const { getPriceTmp, } = this.props;
    const {rowInfo , mainInfo , contractInfo} = data? data : {
      rowInfo:{},
      mainInfo:{},
      contractInfo:{}
    };
    //con
    return (
      <div className={`symbol-tool-item symbol-detail ${showCls}`}>
        <ToolHeader getPriceTmp={getPriceTmp} { ...rowInfo} />
        <MainDetail />
        <ContractDetail {...contractInfo} />
        <div className="detail-btn-container" >
          <Button className={globalCx('btn-yellow' , 'symbol-tool-buy')} >下單</Button>
        </div>

      </div>
    );
  }

  componentDidMount() {

  }

  componentDidUpdate() {

  }

  //function


}
