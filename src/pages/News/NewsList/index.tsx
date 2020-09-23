import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Col, Row } from 'antd';
import moment from "moment";
import '../index.scss';
import NewsItem from 'components/NewsItem';
import NewsDetail from "../NewsDetail";


export default class NewsList extends BaseReact {

  state = {
    newsList: [],
    id: '',
    title: '',
    time: '',
    content: '',
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
    return true;
  }


  componentDidMount() {

  };

  componentDidUpdate() {
       
  };

  createNewsItem(list, newsKey, newsClick) {
    return list.map((item) => {
      return (
        <NewsItem
          newsList={list}
          key={item.news_id}
          newsID={item.news_id}
          newsTitle={item.title}
          newsTime={moment(item.pub_time * 1000).format("YYYY/MM/DD HH:mm:ss")}
          newsImg={item.thumbnail}
          handleNewsDetail={newsClick}
          isClick={item.news_id === newsKey}
        />
      );
    });
  }

  handleNewsDetail = (newsID) => {
    this.state.newsList
      .filter((news) => newsID === news.news_id)
      .map(news => {
        this.setState({
          id: news.news_id,
          title: news.title,
          time: moment(news.pub_time * 1000).format("YYYY/MM/DD HH:mm:ss"),
          content: news.content,
        });
      });
  }

  render() {
    const { newsList, id, title, time, content, } = this.state;
    return (
      <Row className="news-content">
        <Col span={8} className="news-list" onScroll={this.props.newsListScroll}>
          {this.createNewsItem(newsList, id, this.handleNewsDetail)}
        </Col>
        <Col span={16} className="news-detail">
          <NewsDetail
            title={title}
            time={time}
            content={content}
          />
        </Col>
      </Row>
    );
  }
}

