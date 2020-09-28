import * as React from 'react';
import { BaseReact } from 'components/@shared/BaseReact';
import { Col, Row } from 'antd';
import '../index.scss';


export default class NewsDetail extends BaseReact {
  state = {}

  render() {
    const { } = this.state;
    return (
      <>
        <Col span={24} className="news-detail-title">{this.props.title}</Col>
        <Col span={24} className="news-detail-time">{this.props.time}</Col>
        <Col span={24} className="news-detail-content">
          <div
            dangerouslySetInnerHTML={{
              __html:
                            this.props.content,
            }}
          >
          </div>
        </Col>
      </>
    );
  }
}

