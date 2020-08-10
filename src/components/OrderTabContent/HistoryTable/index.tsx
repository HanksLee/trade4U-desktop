import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Table } from "antd";

import moment from "moment";
import utils from "utils";

import { observer, inject } from "mobx-react";

import order from "store/order";

@inject("order")
@observer
export default class HistoryTable extends BaseReact<{}, {}> {
  state = {
    search:null,
  };
  columns = [
    {
      title: "品种",
      dataIndex: "symbol_name",
      width: 100,
      fixed: "left",
    },
    {
      title: "品种代码",
      dataIndex: "product_code",
      width: 100,
    },
    {
      title: "方向",
      dataIndex: "action",
      width: 70,
      render: text => {
        switch (text) {
          case "0":
            return "做多";
          case "1":
            return "做空";
          case "2":
            return "限价买";
          case "3":
            return "限价卖";
          case "4":
            return "突破买";
          case "5":
            return "突破卖";
        }
      },
    },
    {
      title: "开仓价",
      dataIndex: "open_price",
      width: 120,
    },
    {
      title: "平仓价",
      dataIndex: "close_price",
      width: 120,
    },
    {
      title: "交易手数",
      dataIndex: "lots",
      width: 100,
    },
    {
      title: "止盈/止损",
      width: 100,
      render: (text, record) => {
        return (
          <div>
            <p className={"p-up"}>{record.take_profit}</p>
            <p className={"p-down"}>{record.stop_loss}</p>
          </div>
        );
      },
    },
    {
      title: "库存费",
      dataIndex: "swaps",
      width: 100,
    },
    {
      title: "税费",
      dataIndex: "taxes",
      width: 100,
    },
    {
      title: "手续费",
      dataIndex: "fee",
      width: 150,
    },
    {
      title: "盈亏",
      dataIndex: "profit",
      width: 150,
      render: (text, record) => {
        const sign = Math.sign(text);
        const priceCls = this.props.getPriceTmp(sign);
        return (
          <span className={`${priceCls}`}>{text > 0 ? `+${text}` : text}</span>
        );
      },
    },
    {
      title: "开仓时间",
      dataIndex: "create_time",
      width: 220,
      render: (text, record) =>
        moment(text * 1000).format("YYYY.MM.DD HH:mm:ss"),
    },
    {
      title: "平仓时间",
      dataIndex: "close_time",
      width: 220,
      // fixed: "right",
      render: (text, record) =>
        moment(text * 1000).format("YYYY.MM.DD HH:mm:ss"),
    },
    {
      title: "订单号",
      dataIndex: "order_number",
      width: 220,
    }
  ];
  PAGE_SIZE = 5;
  columnsWidth =0;
  order = null;
  constructor(props) {
    super(props);
    this.order = props.order;
    this.columnsWidth = this.columns.reduce(function (total, cur) {
      return total + cur.width;
    }, 0);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { historyList, getHistoryList, } = order;
    const { isLoading, result, } = historyList;
    const { results, page, count, } = result;
    const { close_start_time, close_end_time, } = this.state.search;
    const { PAGE_SIZE, getOnRowSetting, columns, columnsWidth, } = this;
    const pagination = {
      size: "small",
      pageSize: PAGE_SIZE,
      current: page,
      total: count,
    };

    return (
      <div>
        <Table
          loading={isLoading}
          pagination={pagination}
          onChange={(pagination, filters, sorter) => {
            const { page, pageSize, } = pagination;
            getHistoryList(page, pageSize, close_start_time, close_end_time);
          }}
          columns={columns}
          scroll={{
            x: columnsWidth,
            y: 'calc(22vh - 56px)',
          }}
          dataSource={results}
          rowKey={(record)=>(record.order_number)}
        ></Table>
      </div>
    );
  }

  getOnRowSetting = record => {
    return {
      onDoubleClick: async evt => {},
    };
  };
}
