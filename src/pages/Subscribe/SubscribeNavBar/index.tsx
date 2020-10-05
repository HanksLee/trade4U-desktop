import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Tabs } from 'antd';
import '../index.scss';
import FilterItem from "components/FilterItem";


const TabPane = Tabs.TabPane;

export default class SubscribeNavBar extends BaseReact {
  state = {
    symbolTypeList: [],
    currentID: "HK",
  }

  async componentDidMount() {
    await this.getSymbolTypeList();
  }
  getSymbolTypeList = async () => {
    const res =
            [{
              symbol_type_name: "港股",
              symbol_type_code: "HK",
            },
            {
              symbol_type_name: "A股",
              symbol_type_code: "SHSZ",
            }];

    this.setState({ symbolTypeList: res, });
  };


  createSubscribeNavBar(list, currentTab, itemClick) {
    return list.map(item => {
      return (
        <FilterItem
          key={`symbol_type_${item.symbol_type_name}`}
          symbol_type_name={item.symbol_type_name}
          isItemActive={item.symbol_type_code === currentTab}
          onFilterChange={itemClick}
          id={item.symbol_type_code}
        />
      );
    });
  }
  onFilterChange = (currentTab) => {
    this.setState({ currentID: currentTab, });
    this.props.tabChange(currentTab);
  }

  render() {
    const { symbolTypeList, currentID, } = this.state;
    const barClass = {
      padding: "0 10px",
      borderBottom: "1px solid rgba(46,59,85,1)",
      marginBottom: "0px",
    };
    return (
      <div className="subscribe-head">
        <Tabs
          tabBarStyle={barClass}
          className={"tabtest"}
          defaultActiveKey={"1"}
        >
          <TabPane tab="產品" key="1"></TabPane>
        </Tabs>
        <div className={"symbol-filter"}>
          {this.createSubscribeNavBar(symbolTypeList, currentID, this.onFilterChange)}
        </div>
      </div>
    );
  }
}
