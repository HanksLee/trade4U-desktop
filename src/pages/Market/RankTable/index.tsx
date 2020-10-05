import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { inject, observer } from "mobx-react";
import { Table } from "antd";
import { withRouter } from "react-router-dom";
import utils from "utils";

interface Rank {
  name: string;
  change: number;
  open: number;
  higt: number;
  low: number;
  last_close: number;
  buy: number;
  sell: number;
  chg: number;
  volume: number;
  amount: number;
  symbol: string;
}

interface RankTableProps {
  symbolTypeCode: string;
}

interface RankTableState {
  rankList: Rank[];
}

@withRouter
@inject("common")
@observer
export default class RankTable extends BaseReact<RankTableProps, RankTableState> {
  constructor(props) {
    super(props);

    this.state = {
      rankList: [],
    };
  }

  componentDidMount() {
    this.getSymbolTypeRank();
  }

  getSymbolTypeRank = async () => {
    const { symbolTypeCode, } = this.props;
    const res = await this.$api.market.getSymbolTypeRank(symbolTypeCode, {
      params: {
        rank_type: this.$store.market.sorter,
      },
    });
    this.setState({
      rankList: res.data,
    });
  };

  getSortOrderValue = (riseKey, dropKey) => {
    const { sorter, } = this.props.market;

    if (sorter === riseKey) {
      return "ascend";
    }

    if (sorter === dropKey) {
      return "descend";
    }

    return false;
  };

  compareStyle = (orign, target) => {
    // if (orign < target) {
    //   return <span className="data-down">{orign}</span>;
    // } else if (orign > target) {
    //   return <span className="data-up">{orign}</span>;
    // } else {
    //   return <span>{orign}</span>;
    // }

    const {
      common: { stockColorMode, },
    } = this.props;

    return (
      <span
        className={`${utils.getStockChangeClass(
          target - orign,
          stockColorMode
        )}`}
      >
        {orign}
      </span>
    );
  };

  compareToChg = (orign, chg) => {
    // if (orign < chg) {
    //   return <span className="data-down">{orign}</span>;
    // } else if (orign > chg) {
    //   return <span className="data-up">{orign}</span>;
    // } else {
    //   return <span>{orign}</span>;
    // }

    const {
      common: { stockColorMode, },
    } = this.props;

    return (
      <span
        className={`${utils.getStockChangeClass(chg - orign, stockColorMode)}`}
      >
        {orign}
      </span>
    );
  };

  getColumns = () => {
    return [
      {
        title: "品种名字",
        dataIndex: "name",
      },
      {
        title: "品种代码",
        dataIndex: "symbol",
      },
      {
        title: "买入价",
        dataIndex: "buy",
        sorter: true,
        sortOrder: this.getSortOrderValue("buy_rise", "buy_drop"),
        render: (text, record) => this.compareToChg(text, record.chg),
      },

      {
        title: "卖出价",
        dataIndex: "sell",
        sorter: true,
        sortOrder: this.getSortOrderValue("sell_rise", "sell_drop"),
        render: (text, record) => this.compareToChg(text, record.chg),
      },
      {
        title: "涨跌额",
        dataIndex: "change",
        sorter: true,
        sortOrder: this.getSortOrderValue("change_rise", "change_drop"),
        render: text => {
          // if (text > 0) {
          //   return <span className="data-up">{`+${text}`}</span>;
          // } else if (text < 0) {
          //   return <span className="data-down">{text}</span>;
          // } else {
          //   return <span>{text}</span>;
          // }

          const {
            common: { stockColorMode, },
          } = this.props;

          return (
            <span
              className={`${utils.getStockChangeClass(text, stockColorMode)}`}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: "涨跌幅",
        dataIndex: "chg",
        sorter: true,
        sortOrder: this.getSortOrderValue("chg_rise", "chg_drop"),
        render: text => {
          // if (text > 0) {
          //   return <span className="data-up">{`+${text}`}</span>;
          // } else if (text < 0) {
          //   return <span className="data-down">{text}</span>;
          // } else {
          //   return <span>{text}</span>;
          // }

          const {
            common: { stockColorMode, },
          } = this.props;

          return (
            <span
              className={`${utils.getStockChangeClass(text, stockColorMode)}`}
            >
              {text}
            </span>
          );
        },
      },
      {
        title: "开盘价",
        dataIndex: "open",
        sorter: true,
        sortOrder: this.getSortOrderValue("open_rise", "open_drop"),
        render: (text, record) => this.compareStyle(text, record.last_close),
      },
      {
        title: "收盘价",
        dataIndex: "last_close",
        sorter: true,
        sortOrder: this.getSortOrderValue("last_close_rise", "last_close_drop"),
      },
      {
        title: "最高价",
        dataIndex: "high",
        sorter: true,
        sortOrder: this.getSortOrderValue("high_rise", "high_drop"),
        render: (text, record) => this.compareStyle(text, record.last_close),
      },
      {
        title: "最低价",
        dataIndex: "low",
        sorter: true,
        sortOrder: this.getSortOrderValue("low_rise", "low_drop"),
        render: (text, record) => this.compareStyle(text, record.last_close),
      },
      {
        title: "成交价",
        dataIndex: "volume",
        sorter: true,
        sortOrder: this.getSortOrderValue("volume_rise", "volume_drop"),
      },
      {
        title: "成交金额",
        dataIndex: "amount",
        sorter: true,
        sortOrder: this.getSortOrderValue("amount_rise", "amount_drop"),
      }
    ];
  };

  handleTableChange = (pagination: any, filters: any, sorter: any) => {
    let newSorter = "";
    if (sorter.order === "ascend") {
      newSorter = sorter.field + "_rise";
    } else if (sorter.order === "descend") {
      newSorter = sorter.field + "_drop";
    } else {
      newSorter = "";
    }

    this.props.market.setSorter(newSorter);
    setTimeout(this.getSymbolTypeRank, 0);
  };

  render() {
    const { rankList, } = this.state;

    return (
      <Table
        rowKey="symbol"
        columns={this.getColumns()}
        pagination={false}
        dataSource={rankList}
        onChange={this.handleTableChange}
        onRow={record => {
          return {
            onDoubleClick: () => {
              this.props.market.getCurrentSymbol(record.id);
              this.props.common.setCurrentTab('个股');
              if (this.props.history.pathname !== "/dashboard/symbol") {
                this.props.history.push("/dashboard/symbol");
              }
            },
          };
        }}
      />
    );
  }
}
