import api from "services";
import WithRoute from 'components/@shared/WithRoute';
import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { inject, observer } from "mobx-react";
import moment from "moment";
import NewsNavBar from "./NewsNavBar";
import NewsList from "./NewsList";
import './index.scss';

/* eslint new-cap: "off" */
@WithRoute("/dashboard/news")
@inject("common")
@observer
export default class News extends BaseReact {

  state = {
    newsList: [],
    newsListCount: 0,
    page: 1,
    currentSymbolCode: 'mixed',
    newsNextPage: null,

  }

  componentDidMount() {
    const { currentSymbolCode, } = this.state;
    this.onTabChange(currentSymbolCode);
  }

  onTabChange = async (currentTab) => {
    this.setState(
      { currentSymbolCode: currentTab, page: 1, newsList: [], newsListCount: 0, },
      () => {
        this.getList(currentTab);
      }
    );
  };
  getList = async (currentSymbolCode) => {
    const { page, } = this.state;
    const res = await api.news.getSymbolTypeList({
      params: {
        news_class: currentSymbolCode,
        page,
      },
    });
    if (res.status == 200) {
      this.setState({
        page: this.state.page + 1,
        newsList: [...this.state.newsList, ...res.data.results],
        newsListCount: res.data.count,
        newsNextPage:res.data.next,
      });
    }
  }

  handleNewsListScroll = () => {
    const { currentSymbolCode, newsNextPage, } = this.state;
    if (newsNextPage === null) return;
    let newsListScrollHeight = document.getElementsByClassName('news-list')[0].scrollHeight;
    let newsListScrollTop = document.getElementsByClassName('news-list')[0].scrollTop;
    let newsListClientHeight = document.getElementsByClassName('news-list')[0].clientHeight;
        
    if (newsListScrollTop === 0 && newsListScrollHeight === 0) return;
    if (newsListClientHeight + newsListScrollTop >= newsListScrollHeight) {
      this.getList(currentSymbolCode);
    }
  }

  render() {
    const { newsList, } = this.state;
    return (
      <div className="news-page">
        <NewsNavBar tabChange={this.onTabChange} />
        <NewsList newsList={newsList} newsListScroll={this.handleNewsListScroll} />
      </div>
    );
  }
}


