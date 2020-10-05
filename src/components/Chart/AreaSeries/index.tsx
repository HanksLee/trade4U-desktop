import React from "react";
import defaultSeriesOption from "./config/option";
import moment from "moment";
import { STANDBY, INIT, REFRESH, UPDATE, CLEAR } from "./config/process";
import { toJS } from "mobx";

const basicStep = 15;
export default class extends React.Component {
  state = {
    chart: null,
    symbol: null,
    initList: [],
    updateList: [],
    seriesOption: null,
  };
  constructor(props) {
    super(props);
  }
  areaSeris = null;

  lastSymbolDate = null;
  nowProcess = STANDBY;
  totalCount = 0;

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { updateList, } = nextState;
    return true;
  }

  render() {
    return <div></div>;
  }

  componentDidMount() {}
  componentDidUpdate(prevProps, prevState) {
    const { nowProcess, } = this;
    const { symbol, initList, updateList, } = this.state;
    const prevSymbol = prevState.symbol;
    if (initList !== prevState.initList && this.nowProcess !== STANDBY) {
      this.nowProcess = INIT;
    }

    switch (this.nowProcess) {
      case STANDBY:
        this.initSeries();
        break;
      case INIT:
        this.refreshSeries();
        break;
      case REFRESH:
        this.insertListSeries(updateList);
        break;
      case UPDATE:
        this.insertListSeries(updateList);
        break;
      case CLEAR:
        break;
    }
  }

  //function
  initSeries = () => {
    const { chart, seriesOption, } = this.state;
    if (!chart && this.areaSeris) return;
    const nowOption = this.createOption(defaultSeriesOption, seriesOption);
    this.areaSeris = chart.addAreaSeries(nowOption);
    this.nowProcess = INIT;
  };

  refreshSeries = () => {
    const { initList, } = this.state;
    if (initList.length === 0) return;

    this.areaSeris.setData([]);
    window.setTimeout(()=>{
      this.areaSeris.setData([...initList]);
      this.lastSymbolDate = initList[initList.length - 1].time;
      this.nowProcess = REFRESH;
      this.totalCount = initList.length;  
      this.props.setBasicInfo(0, initList.length);
    }, 10);
  };

  insertListSeries = async (updateList) => {
    const lastTimestamp = moment(this.lastSymbolDate * 1000).unix();

    for (let item of updateList) {
      const nowTimestamp = moment(item.time).unix();
      if (nowTimestamp - lastTimestamp > 0) {
        item.time = nowTimestamp;
        await this.insertSeries(item);        
        this.props.setBasicInfo(0, this.totalCount++);
      }
    }
    this.nowProcess = UPDATE;
  };

  insertSeries = (d) => {
    return new Promise((resovle, reject) => {
      window.setTimeout(() => {
        this.areaSeris.update(d);
        this.lastSymbolDate = d.time;
        resovle(true);
      }, 50);
    });
  };

  createOption = (defaultOption, option) => {
    if (!option) return defaultOption;
    for (let key in defaultOption) {
      const value = option[key];

      if (value) {
        defaultOption[key] = value;
      }
    }

    return defaultOption;
  };
}
