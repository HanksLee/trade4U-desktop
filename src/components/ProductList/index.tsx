import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { observer, inject } from "mobx-react";
import InfiniteScroll from "react-infinite-scroller";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ProductItem from "./ProductItem";
import moment from "moment";
import {
  STANDBY, //啟動ws之前
  CONNECTING, //已開通通路，未接收到訊息
  CONNECTED, //已接收到訊息
  DISCONNECTED, //斷線
  RECONNECT, //斷線重新連線
  ERROR //
} from "utils/WebSocketControl/status";
import {
  REFRESH,
  SCROLL
} from "pages/Symbol/Left/config/symbolTypeStatus";

@inject("product")
@observer
export default class ProductList extends BaseReact {
  state = {
    id: 0,
    initData: [],
    priceTmp: null,
  };

  subscribList = [];
  wsStatus = STANDBY;
  scrollRef = null;
  scrollInfo = {
    timeId: 0,
    itemCount: 0,
    MAXCOUNT: 5,
  };

  buffer = {};
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
    this.buffer = this.initBuffer();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { currentList, } = this.props.product;
    const { symbolList, status, } = currentList;
    const { hasMore, dataLoading, } = status;
    // console.log("product list render");
    const {
      priceTmp: { high, normal, low, },
    } = this.state;

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
          <div>
            {this.createSymbolComponentList(symbolList, high, low, normal)}
          </div>
          {dataLoading && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24, }} spin />}
            />
          )}
        </InfiniteScroll>
      </div>
    );
  }

  componentDidMount() {
    const { setReceviceMsgLinter, setStatusChangLinster, } = this.props;
    this.setContentScrollEvent(this.scrollRef);
    setReceviceMsgLinter(this.receviceMsgLinter);
    setStatusChangLinster(this.statusChangLinster);
  }

  componentDidUpdate(prevProps, prevState) {
    const prevSymbol_type_code = prevProps.symbol_type_code;
    if (prevSymbol_type_code !== this.props.symbol_type_code)
      this.scrollRef.scrollTo(0, 0);

    const { currentList, } = this.props.product;
    const { status, } = currentList;
    const { dataLoading, } = status;
    if (dataLoading) {
      this.cancelDataLoading(status);
      //第一次載入追蹤
      this.firstTrackSymbol();
    }
  }

  //function
  firstTrackSymbol = () => {
    if (
      this.props.symbol_type_code === "SELF" ||
      this.subscribList.length !== 0
    ) {
      return;
    }
    this.subscribList = this.createSubscribeList();

    const { trackSymbol, subscribList, } = this;
    trackSymbol(subscribList, "subscribe");
  };

  cancelDataLoading = status => {
    const newStatus = {
      ...status,
      dataLoading: false,
    };
    this.props.product.setCurrentSymbolList({
      status: {
        ...newStatus,
      },
    });
  };

  createSymbolComponentList = (list, highPrice, lowPrice, normalPrice) => {
    return list
      ? list.map((item, i) => {
        const {
          key,
          id,
          rowInfo: { chg, },
        } = item;
        const sign = Math.sign(chg);
        const priceTypeObj =
            sign === 1 ? highPrice : sign === -1 ? lowPrice : normalPrice;
        const openSymbolId = -1;
        return (
          <ProductItem
            key={key}
            listId={i}
            {...item}
            priceType={priceTypeObj}
            isActive={openSymbolId === id}
            setOpenItem={this.setOpenItem}
            {...this.props}
          />
        );
      })
      : null;
  };

  setOpenItem = id => {
    this.props.product.setOpenSymbolId(id);
  };

  receviceMsgLinter = d => {
    const { data, } = d;

    const { buffer, } = this;
    const { timeId, BUFFER_TIME, list, } = buffer;
    const receviceTime = moment().valueOf();
    buffer.list = [
      ...list,
      ...data
    ];

    if (timeId) window.clearTimeout(timeId);
    if (!this.checkBuffer(buffer, receviceTime)) {
      buffer.timeId = window.setTimeout(() => {
        this.updateContent(buffer);
      }, BUFFER_TIME);
      return;
    }

    this.updateContent(buffer);
  };

  statusChangLinster = (before, next) => {
    const { symbol_type_code, } = this.props;
    if (
      before === CONNECTING &&
      next === CONNECTED &&
      symbol_type_code !== "SELF"
    ) {
      const { trackSymbol, subscribList, } = this;
      if (subscribList.length !== 0) {
        // trackSymbol(subscribList, "unsubscribe");
        // trackSymbol(subscribList, "subscribe");
      }
    }
  };

  setContentScrollEvent = elRef => {
    elRef.addEventListener("scroll", e => {
      this.productScroll(e);
    });
  };

  productScroll = e => {
    window.clearTimeout(this.scrollInfo.timeId);
    this.scrollInfo.timeId = window.setTimeout(() => {
      const {
        error,
        hasMore,
        dataLoading,
      } = this.props.product.currentList.status;
      // Bails early if:
      // * there's an error
      // * it's already loading
      // * there's nothing left to load
      if (error || dataLoading || !hasMore) return;

      const { currentSymbolType, } = this.props.product;
      const { page, page_size, symbol_type_code, } = currentSymbolType;
      const { itemCount, MAXCOUNT, } = this.scrollInfo;
      const {
        offsetHeight,
        scrollTop, //scroll 座標x
        scrollHeight,
        clientHeight,
      } = e.target;

      const item = e.target.querySelectorAll(
        ".ant-row.ant-row-space-between.custom-table-item"
      );
      const nowItemCount = this.checkScrollingItemCount(
        item,
        symbol_type_code,
        scrollTop,
        itemCount,
        MAXCOUNT
      );

      if (nowItemCount !== -1) {
        // console.log("trackSymbol");
        this.scrollInfo.itemCount = nowItemCount;

        this.trackSymbol(this.subscribList, "unsubscribe");

        this.subscribList = this.createSubscribeList(
          nowItemCount,
          page_size,
          MAXCOUNT
        );

        this.trackSymbol(this.subscribList, "subscribe");
      }

      const scrollingHeight = offsetHeight + scrollTop;
      const count = Math.ceil(scrollingHeight / clientHeight);

      if (scrollingHeight < scrollHeight || count === page) {
        return;
      }

      const nowPage = page + 1;
      this.props.product.setCurrentId({
        ...currentSymbolType,
        page: nowPage,
        cmd: SCROLL,
      });
    }, 50);
  };

  loadMore(page) {
    //console.log(page);
  }

  //subscribe
  checkScrollingItemCount = (
    itemListEl,
    symbol_type_code,
    scrollTop,
    prevCount,
    maxCount
  ) => {
    if (itemListEl.length === 0 || symbol_type_code === "SELF") return -1;

    const itemHeight = itemListEl[0].clientHeight;

    const count = Math.floor(scrollTop / itemHeight);

    if (Math.abs(prevCount - count) < maxCount) return -1;

    return count;
  };
  trackSymbol = (currentList, type) => {
    const o = {
      type: type,
      data: {
        symbol_ids: currentList,
      },
    };

    this.props.sendMsg(o);
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

  //buffer
  checkBuffer(buffer, receviceTime) {
    const { list, lastCheckUpdateTime, BUFFER_MAXCOUNT, BUFFER_TIME, } = buffer;
    let maxCount = list.length;

    if (
      receviceTime - lastCheckUpdateTime >= BUFFER_TIME ||
      maxCount >= BUFFER_MAXCOUNT
    )
      return true;
    else return false;
  }
  
  updateContent = buffer => {
    const { list, } = buffer;
    const newList = this.sortList(list);
    buffer.list = this.filterBufferlList(newList);

    this.props.product.updateCurrentSymbolList(buffer.list);

    this.buffer = this.initBuffer();
  };

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
}
