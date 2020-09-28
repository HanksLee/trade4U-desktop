import api from "services";
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { action, observable, computed, autorun, toJS } from "mobx";
import { Tabs } from 'antd';
import '../index.scss';

const TabPane = Tabs.TabPane;

export default class NewsNavBar extends BaseReact {
  state = {
    symbolTypeList: [],
  }

  async componentDidMount() {
    await this.getSymbolTypeList();
  }
  getSymbolTypeList = async () => {
    const res = 
        [{
          symbol_type_name: "推荐",
          symbol_type_code: "mixed",
        },
        {
          symbol_type_name: "港股",
          symbol_type_code: "hk",
        },
        {
          symbol_type_name: "Ａ股",
          symbol_type_code: "cn",
        },
        {
          symbol_type_name: "美股",
          symbol_type_code: "us",
        }];

    this.setState({ symbolTypeList: res, });
  };
   

  createNavBar(newsTablist) {
    return newsTablist.map((tab) => {
      return (
        <TabPane 
          tab={tab.symbol_type_name} 
          key={tab.symbol_type_code}
        ></TabPane>
      );
    });
  }

    
  render() {
    const { symbolTypeList, } = this.state;
    return (
      <Tabs className="news-nav-bar" onChange={this.props.tabChange}>
        {this.createNavBar(symbolTypeList)}
      </Tabs>
    );
  }
}
