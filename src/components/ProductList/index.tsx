import * as React from "react";
import { BasePureReact } from "components/@shared/BaseReact";
import { observer, inject } from "mobx-react";
import { Spin } from "antd";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";

import ProductItem from "./ProductItem";
import { SELF } from "pages/Symbol/config/symbolTypeCategory";
import { PAGE_SIZE } from "constant";

@inject("common", "product", "symbol")
@observer
export default class ProductList extends BasePureReact {
  state = {
    id: 0,
    initData: [],
    priceTmp: null,
  };

  subscribList = [];
  scrollRef = null;
  scrollInfo = {
    isLoading: false,
    timeId: 0,
    itemCount: 0,
    MAXCOUNT: 5,
  };

  buffer = {};
  constructor(props) {
    super(props);
    this.buffer = this.initBuffer();
    this.scrollRef = React.createRef();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { currentSymbolList, } = this.props.symbol;
    const { results, nextPage, } = currentSymbolList;
    const { getPriceTmp, } = this.props.common;
    const hasMore = nextPage !== -1 || results.length === 0;
    return (
      <div
        ref={ref => {
          this.scrollRef = ref;
        }}
        className={"custom-table-body"}
      >
        <InfiniteScroll
          pageStart={0}
          onScroll={event => {
            this.productScroll(event);
          }}
          hasMore={hasMore}
          loader={
            <div className="custom-table-loadmore" key={0}>
              <Spin />
            </div>
          }
          loadMore={this.loadMore}
          getScrollParent={() => this.scrollRef}
        >
          <div>{this.createSymbolComponentList(results, getPriceTmp)}</div>
        </InfiniteScroll>
      </div>
    );
  }

  componentDidMount() {
    this.setContentScrollEvent(this.scrollRef);
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentSymbolList, } = this.props.symbol;
    const { page, results, } = currentSymbolList;
    const pageTotal = page * PAGE_SIZE;
    if (pageTotal === results.length) {
      this.scrollInfo.isLoading = false;
    }
  }

  //function
  createSymbolComponentList = (list, getPriceTmpFn) => {
    return list
      ? list.map((item, i) => {
        const {
          symbolKey,
          symbolId,
          name,
          priceInfo: { change, },
        } = item;
        const sign = Math.sign(change);
        const priceTypeObj = getPriceTmpFn(sign);
        const { currentSymbolInfo, } = this.props.symbol;

        return (
          <ProductItem
            key={symbolKey}
            {...item}
            priceType={priceTypeObj}
            isActive={currentSymbolInfo.symbolId === symbolId}
            symbolId={symbolId}
            name={name}
            setOpenItem={this.setOpenItem}
            onFavorite={this.onFavorite}
            {...this.props}
          />
        );
      })
      : null;
  };

  onFavorite = async (code, symbolId, name) => {
    switch (code) {
      case SELF:
        this.props.product.deleteSelfSelectSymbolList(symbolId, name);
        break;
      default:
        this.props.product.addSelfSelectSymbolList(symbolId, name);
        break;
    }
  };

  setOpenItem = symbolId => {
    const { currentSymbolList, } = this.props.symbol;
    const symbolInfoItems = currentSymbolList.results.filter((item)=>{
      return item.symbolId === symbolId;
    });
    const symbolInfoItem = symbolInfoItems.length === 0 ? undefined : symbolInfoItems[0];

    this.props.symbol.setCurrentSymbolInfo(symbolInfoItem);
    // // * 依使用者选中的 id 抓取资料，更新 product store 的 currentSymbol
    // this.props.product.fetchCurrentSymbol(symbolId);
  };

  //buffer
  filterBufferlList(list) {
    return list.filter((item, i, all) => {
      return (
        all.findIndex(fItem => {
          return fItem.symbol === item.symbol;
        }) === i
      );
    });
  }

  sortList = list => {
    const tmp = Object.assign([], list);

    tmp.sort((a, b) => {
      if (a.symbol !== b.symbol) {
        return -1;
      }

      if (a.timestamp > b.timestamp) {
        return -1;
      }

      if (a.timestamp < b.timestamp) {
        return 1;
      }

      if (a.timestamp === b.timestamp) {
        return 0;
      }
    });

    return tmp;
  };

  initBuffer() {
    return {
      BUFFER_MAXCOUNT: 50,
      BUFFER_TIME: 2000,
      timeId: 0,
      lastCheckUpdateTime: moment().valueOf(),
      list: [],
    };
  }

  loadMore = () => {};
  setContentScrollEvent = elRef => {
    elRef.addEventListener("scroll", e => {
      this.productScroll(e);
    });
  };

  productScroll = e => {
    window.clearTimeout(this.scrollInfo.timeId);
    this.scrollInfo.timeId = window.setTimeout(() => {
      const { nextPage, page, results, } = this.props.symbol.currentSymbolList;
      const { itemCount, MAXCOUNT, isLoading, } = this.scrollInfo;
      if (results.length === 0 || nextPage === -1 || isLoading) return;

      const { currentSymbolTypeItem, } = this.props.product;
      const {
        symbol_type_code,
        symbol_type_name,
        category,
      } = currentSymbolTypeItem;

      const {
        offsetHeight,
        scrollTop, //scroll 座標x
        scrollHeight,
        clientHeight,
      } = e.target;

      const item = e.target.querySelectorAll(
        ".ant-row.ant-row-space-between.custom-table-item"
      );
      const nowItemCount = -1; //this.checkScrollingItemCount(
      //   item,
      //   symbol_type_code,
      //   scrollTop,
      //   itemCount,
      //   MAXCOUNT
      // );

      if (nowItemCount !== -1) {
        // console.log("trackSymbol");
        this.scrollInfo.itemCount = nowItemCount;

        // this.trackSymbol(this.subscribList, "unsubscribe");

        // this.subscribList = this.createSubscribeList(
        //   nowItemCount,
        //   page_size,
        //   MAXCOUNT
        // );

        // this.trackSymbol(this.subscribList, "subscribe");
      }

      const scrollingHeight = offsetHeight + scrollTop;
      const pageCount = Math.ceil(scrollingHeight / clientHeight);

      if (scrollingHeight < scrollHeight || pageCount === page) {
        return;
      }
      this.props.symbol.addCurrentSymbolList(
        nextPage,
        symbol_type_name,
        symbol_type_code,
        category
      );
      this.scrollInfo.isLoading = true;
    }, 50);
  };

  //other fuc
  checkScrollingItemCount = (
    itemListEl,
    symbol_type_code,
    scrollTop,
    prevCount,
    maxCount
  ) => {
    if (itemListEl.length === 0 || symbol_type_code === SELF) return -1;

    const itemHeight = itemListEl[0].clientHeight;

    const count = Math.floor(scrollTop / itemHeight);

    if (Math.abs(prevCount - count) < maxCount) return -1;

    return count;
  };

  createSubscribeList = (nowItemCount = 0, length = -1, count = 0) => {
    const { allProductListId, } = this.props.product;
    length = length === -1 ? allProductListId.length : length;

    const start = nowItemCount - count;
    const end = (start > 0 ? start : 0) + length + count;

    return allProductListId.filter((id, i) => {
      return i >= start && i <= end;
    });
  };
}
