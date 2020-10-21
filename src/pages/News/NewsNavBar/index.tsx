import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Tabs } from 'antd';
import { inject, observer } from "mobx-react";
import '../index.scss';

const TabPane = Tabs.TabPane;

@inject("product")
@observer
export default class NewsNavBar extends BaseReact {
  state = {
    symbolTypeList: [],
  }

  async componentDidMount() {
    await this.getSymbolTypeList();
  }
  getSymbolTypeList = async () => {
    let newsType = [{
      symbol_type_name: "推荐",
      symbol_type_code: "mixed",
    }];
    const res = await this.props.product.fetchSymbolTypeList();
    if (res) {
      newsType = [...newsType, ...res];
    }

    this.setState({ symbolTypeList: newsType });
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
