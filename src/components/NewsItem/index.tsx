import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Col, Row } from 'antd';

export default class NewsItem extends BaseReact {

  state = {
    newsList: [],
    newsID: '',
    newsTitle: '',
    newsTime: '',
    newsImg: '',
    isClick: false,
  }
  componentDidMount() {
    const { newsList, } = this.state;
    this.props.handleNewsDetail(newsList[0].news_id);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { newsID, newsTitle, newsTime, newsImg, isClick, } = this.state;
    const itemClass = isClick ? "active" : "";

    return (
      <Row className={`news-item ${itemClass} ${newsID} `} onClick={() => this.props.handleNewsDetail(newsID)}>
        <Col span={15} className="news-item-text">
          <p className="news-item-title">{newsTitle}</p>
          <p className="news-item-time">{newsTime}</p>
        </Col>
        <Col span={9} className="news-item-img"><img src={newsImg}></img></Col>
      </Row>
    );
  }

}
