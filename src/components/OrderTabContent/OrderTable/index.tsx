import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { Table } from "antd";

import moment from "moment";
import utils from "utils";

import { observer, inject } from "mobx-react";

import order from "store/order";

@inject("order")
@observer
export default class OrderTable extends BaseReact<{}, {}> {

  state = {};
  columns = [
    {
      title: "品种",
      dataIndex: "symbol_name",
      width: 100,
      fixed: "left",
      ellipsis: true,
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
            <p>{record?.take_profit || "-"}</p>
            <p>{record?.stop_loss || "-"}</p>
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
          <span className={`${priceCls.color}`}>
            {text > 0 ? `+${text}` : text}
          </span>
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
      title: "订单号",
      dataIndex: "order_number",
      width: 220,
    }
  ];

  order = null;
  constructor(props) {
    super(props);
    this.order = props.order;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  render() {
    const { tradeList, getOrderTabKey, } = order;
    const { isLoading, } = tradeList;
    const result = tradeList[getOrderTabKey];
    const pagination = {
      size: "small",
      pageSize: result.length,
    };
    const { getOnRowSetting, columns, } = this;
    return (
      <div>
        <Table
          rowClassName={"symbol-order-table-row"}
          scroll={{ y: "calc(28vh - 56px)", }}
          onRow={getOnRowSetting}
          loading={isLoading}
          pagination={pagination}
          columns={columns}
          dataSource={result}
          rowKey={(record)=>(record.order_number)}
        />
      </div>
    );
  }

  getOnRowSetting = record => {
    return {
      onDoubleClick: async evt => {},
    };
  };
}
