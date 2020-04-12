import * as React from 'react';
import { Pagination, Carousel } from 'antd';
import './index.scss';

export interface IGalleryProps {
  source: any[];
  activeIndex?: number;
  changeGalleryIndex?(page: number): void;
}

export interface IGalleryState {

}

export default class Gallery extends React.Component<IGalleryProps, IGalleryState> {
  $carousel = null;
  static defaultProps = {
    activeIndex: 0,
    source: [],
  }

  componentDidMount() {
    const { activeIndex, } = this.props;
    this.$carousel.goTo(activeIndex);
  }

  componentDidUpdate() {
    const { activeIndex, } = this.props;
    this.$carousel.goTo(activeIndex);
  }

  changeGalleryIndex = (page, pageSize) => {
    this.props.changeGalleryIndex && this.props.changeGalleryIndex(page - 1);
  }

  render() {
    const { source, activeIndex, } = this.props;
    return (
      <div className="gallery">
        <section className="gallery-carousel">
          <Carousel ref={el => this.$carousel = el} dots={false}>
            {
              source && source.map(item => (
                <div className='gallery-item'>
                  <h3
                    className="gallery-item-img"
                    style={{
                      backgroundImage: `url(${item.src || item.url || item.imgUrl || item.colorImgUrl})`, }}
                  />
                </div>
              ))
            }
          </Carousel>
        </section>
        <section className='gallery-pagination'>
          <Pagination pageSize={1} current={activeIndex + 1} total={source.length} onChange={this.changeGalleryIndex} />
        </section>
      </div>
    );
  }
}