import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import { inject, observer } from "mobx-react";
import { Table } from "antd";
import { STOCK_COLOR_MAP } from "constant";
import utils from "utils";
import { withRouter } from "react-router-dom";
import "./index.scss";

interface Forex {
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

interface ForexTableProps {
  symbolTypeCode: string;
}

interface ForexTableState {
  forexList: Forex[];
  symbolTypeCode: string;
}

@withRouter
@inject("common")
@observer
export default class ForexTable extends BaseReact<
ForexTableProps,
ForexTableState
> {
  constructor(props) {
    super(props);
    const { symbolTypeCode, } = this.props;

    this.state = {
      forexList: [],
      symbolTypeCode,
    };
  }

  componentDidMount() {
    this.getSymbolTypeForex();
  }


  componentWillReceiveProps = (nextProps) => {
    this.setState({
      symbolTypeCode: nextProps.symbolTypeCode,
    }, () => {
      this.getSymbolTypeForex();
    });
  }


  getSymbolTypeForex = async () => {
    const { symbolTypeCode, } = this.state;
    const res = await this.$api.market.getSymbolTypeRank(symbolTypeCode, {
      params: {
        rank_type: this.$store.market.sorter,
      },
    });
    this.setState({
      forexList: res.data,
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
        title: "????????????",
        dataIndex: "name",
        // ellipsis: true,
        // fixed: "left",
        width: 100,
      },
      {
        title: "????????????",
        dataIndex: "symbol",
        width: 100,
      },
      {
        title: "?????????",
        dataIndex: "buy",
        width: 100,
        sorter: true,
        sortOrder: this.getSortOrderValue("buy_rise", "buy_drop"),
        render: (text, record) => this.compareToChg(text, record.chg),
      },

      {
        title: "?????????",
        dataIndex: "sell",
        width: 100,
        sorter: true,
        sortOrder: this.getSortOrderValue("sell_rise", "sell_drop"),
        render: (text, record) => this.compareToChg(text, record.chg),
      },
      {
        title: "?????????",
        dataIndex: "change",
        width: 100,
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
        title: "?????????",
        dataIndex: "chg",
        width: 100,
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
        title: "?????????",
        dataIndex: "open",
        sorter: true,
        width: 100,
        sortOrder: this.getSortOrderValue("open_rise", "open_drop"),
        render: (text, record) => this.compareStyle(text, record.last_close),
      },
      {
        title: "?????????",
        dataIndex: "last_close",
        sorter: true,
        width: 100,
        sortOrder: this.getSortOrderValue("last_close_rise", "last_close_drop"),
      },
      {
        title: "?????????",
        dataIndex: "high",
        sorter: true,
        width: 100,
        sortOrder: this.getSortOrderValue("high_rise", "high_drop"),
        render: (text, record) => this.compareStyle(text, record.last_close),
      },
      {
        title: "?????????",
        dataIndex: "low",
        sorter: true,
        width: 100,
        sortOrder: this.getSortOrderValue("low_rise", "low_drop"),
        render: (text, record) => this.compareStyle(text, record.last_close),
      },
      {
        title: "?????????",
        dataIndex: "volume",
        sorter: true,
        width: 100,
        sortOrder: this.getSortOrderValue("volume_rise", "volume_drop"),
      },
      {
        title: "????????????",
        dataIndex: "amount",
        sorter: true,
        width: 100,
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
    setTimeout(this.getSymbolTypeForex, 0);
  };

  render() {
    const { forexList, } = this.state;

    return (
      <Table
        rowKey="symbol"
        columns={this.getColumns()}
        pagination={false}
        dataSource={forexList}
        onChange={this.handleTableChange}
        onRow={record => {
          return {
            onDoubleClick: () => {
              this.props.market.getCurrentSymbol(record.id);
              this.props.common.setCurrentTab("??????");
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
