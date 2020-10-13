import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

import { reaction, toJS } from "mobx";
import { observer, inject } from "mobx-react";

import { Spin, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import InfiniteScroll from "react-infinite-scroller";

import FilterItem from "components/FilterItem";
import { SingalPriceHeader } from "components/ProductHeader";
import ProductList from "components/ProductList";
import { SELF } from "../config/symbolTypeCategory";

const { TabPane, } = Tabs;

/* eslint new-cap: "off" */

const BarClass = {
  padding: "0 10px",
  borderBottom: "1px solid rgba(46,59,85,1)",
  marginBottom: "0px",
};

@inject("product", "common", "symbol")
@observer
export default class Left extends BaseReact<{}, {}> {
  state = {};
  PAGE = 1;
  PAGE_SIZE = 20;
  priceTmp = {};
  product = null;
  symbol = null;
  reactionList = [];

  constructor(props) {
    super(props);
    this.product = this.props.product;
    this.symbol = this.props.symbol;
  }
  //lift cycle
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  render() {
    const { symbolTypeList, } = this.product;
    const currentSymbolType = this.product.currentSymbolTypeItem;
    return (
      <div className={"symbol-left"}>
        <Tabs tabBarStyle={BarClass} defaultActiveKey={"1"}>
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
              <ProductList />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }

  componentDidMount() {
    this.reactionList = [
      this.setOnSymbolTypeListChange(),
      this.setOnSymbolTypeChange(),
      this.setFavorListener()
    ];
    
    this.product.loadSymbolTypeList();
  }

  componentDidUpdate() {}
  componentWillUnmount() {
    for(let cancelReaction of this.reactionList) {
      cancelReaction();
    }
  }
  // function

  //tracker listener
  setOnSymbolTypeListChange = () => {
    return reaction(
      () => this.props.product.symbolTypeList,
      symbolTypeList => {
        if (!symbolTypeList || symbolTypeList.length === 1) return;
        const firstCurrentSymbolType = toJS(symbolTypeList[0]);
        this.product.setCurrentSymbolTypeItem(firstCurrentSymbolType.id);
      }
    );
  };

  setOnSymbolTypeChange = () => {
    return reaction(
      () => this.props.product.currentSymbolTypeItem,
      currentSymbolTypeItem => {
        if (!currentSymbolTypeItem) return;

        const {
          symbol_type_name,
          symbol_type_code,
          category,
        } = currentSymbolTypeItem;
        this.refreshCurrentSymbolList(
          symbol_type_name,
          symbol_type_code,
          category
        );
      }
    );
  };

  setFavorListener = () => {
    return reaction(
      () => this.props.product.toastMsg,
      toastMsg => {
        if (!toastMsg) return;
        const { isRefresh, text, } = toastMsg;
        this.$msg.success(text);

        if (!isRefresh) return;
        const { currentSymbolType, } = this.symbol;
        const {
          symbol_type_name,
          symbol_type_code,
          category,
        } = currentSymbolType;
        this.refreshCurrentSymbolList(
          symbol_type_name,
          symbol_type_code,
          category
        );
      }
    );
  };

  //creator
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

  //event listener
  onFilterChange = (id, symbol_type_name) => {
    const { currentSymbolTypeItem, } = this.product;
    if (currentSymbolTypeItem.symbol_type_name === symbol_type_name) return;
    this.product.setCurrentSymbolTypeItem(id);
  };

  refreshCurrentSymbolList = (symbol_type_name, symbol_type_code, category) => {
    this.symbol.clearCurrentSymbolList();
    this.symbol.addCurrentSymbolList(
      1,
      symbol_type_name,
      symbol_type_code,
      category
    );
  };
}
