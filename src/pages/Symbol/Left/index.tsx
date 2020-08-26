import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { observer, inject } from "mobx-react";
import { autorun, toJS } from "mobx";
import { Tabs, Row, Col, Spin } from "antd";

import FilterItem from "components/FilterItem";
import { SingalPriceHeader, DoublePriceHeader } from "components/ProductHeader";
import ProductList from "components/ProductList";
import WSConnect from "components/HOC/WSConnect";

import { PRODUCT_RESFRESH } from "pages/Symbol/config/messageCmd";

import channelConfig from "./config/channelConfig";
import {
  REFRESH,
  SCROLL,
  SCROLL_UP,
  SCROLL_DOWN
} from "./config/symbolTypeStatus";
import utils from "utils";

const { TabPane, } = Tabs;

/* eslint new-cap: "off" */
const WS_ProductList = WSConnect(channelConfig[0], channelConfig, ProductList);
@inject("product", "common")
@observer
export default class Left extends BaseReact<{}, {}> {
  state = {};
  PAGE = 1;
  PAGE_SIZE = 20;
  priceTmp = {};
  product = null;
  constructor(props) {
    super(props);
    this.priceTmp = this.setPriceTmp();
    this.product = this.props.product;
    this.product.setInit();
  }
  //lift cycle
  static getDerivedStateFromProps(nextProps, prevState) {
    //console.log("left getDerivedStateFromProps");
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    //  console.log("left shouldComponentUpdate");
    return true; //nextState.symbolTypeList.length != this.state.symbolTypeList.length;
  }

  render() {
    // console.log("Left render");
    const { currentSymbolType, symbolTypeList, } = this.product;
    const barClass = {
      padding: "0 10px",
      borderBottom: "1px solid rgba(46,59,85,1)",
      marginBottom: "0px",
    };
    return (
      <div className={"symbol-left"}>
        <Tabs
          tabBarStyle={barClass}
          className={"tabtest"}
          defaultActiveKey={"1"}
        >
          <TabPane tab={"产品"} key={"1"}>
            <div className={"symbol-filter"}>
              {this.createSymbolComponentList(
                symbolTypeList,
                currentSymbolType.id,
                this.onFilterChange
              )}
            </div>
            <div className={"symbol-sidebar custom-table"}>
              <SingalPriceHeader />
              <WS_ProductList
                channelCode={currentSymbolType.category}
                symbol_type_code={currentSymbolType.symbol_type_code}
                priceTmp={this.priceTmp}
                sendBroadcastMessage={this.sendBroadcastMessage}
                onFavorite={this.onFavorite}
              />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }

  async componentDidMount() {
    this.product.fetchSymbolTypeLoad();
  }

  componentDidUpdate() {}
  // function

  getSymbolTypeList = async () => {
    const res = await this.$api.market.getSymbolTypeList();

    if (res.status == 200) {
      return res.data.results;
    }

    return null;
  };

  createSymbolComponentList(list, currentId, itemClick) {
    return list.map(item => {
      return (
        <FilterItem
          key={`symbol_type_${item.id}`}
          symbol_type_name={item.symbol_type_name}
          isItemActive={item.id === currentId}
          onFilterChange={itemClick}
          id={item.id}
        />
      );
    });
  }
  // count = 0;
  onFilterChange = (id, symbol_type_name) => {
    const { currentSymbolType, } = this.product;
    if (currentSymbolType.symbol_type_name === symbol_type_name) return;
    this.product.setCurrentId({
      id,
      symbol_type_name,
      page: this.PAGE,
      cmd: REFRESH,
    });
  };

  setPriceTmp = () => {
    const {
      getHighPriceClass,
      getNormalPriceClass,
      getLowPriceClass,
    } = this.props.common;
    return {
      high: getHighPriceClass,
      normal: getNormalPriceClass,
      low: getLowPriceClass,
    };
  };

  onFavorite = async (code, addID, deleteID, name) => {
    let res = null;
    switch (code) {
      case "SELF":
        res = await this.deleteSelfSelectSymbolList(deleteID);
        break;
      default:
        res = await this.addSelfSelectSymbolList(addID);
        break;
    }
    if (res) {
      this.$msg.success(`${name}${res}`);

      this.product.setCurrentId({
        cmd: REFRESH,
      });
    }
  };

  async deleteSelfSelectSymbolList(symbol) {
    const d = {
      data: {
        symbol: [symbol],
      },
    };
    const res = await this.$api.market.deleteSelfSelectSymbolList(d);
    if (res.status == 204) {
      return "成功移除自选";
    }
  }

  async addSelfSelectSymbolList(symbol) {
    const d = {
      symbol: [symbol],
    };
    const res = await this.$api.market.addSelfSelectSymbolList(d);
    if (res.status == 201) {
      return "成功添加到自选";
    }
  }

  sendBroadcastMessage = (cmd, data)=>{
    this.props.common.setMessage({
      cmd,
      data,
    });
  }
}
