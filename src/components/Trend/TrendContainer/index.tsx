import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun, reaction, toJS } from "mobx";

import { Row, Col } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import { BasicChart, AreaSeries } from "components/Chart";
import {
  URLREPLACE // Url 切換
} from "utils/WebSocketControl/status";

import utils from "utils";

@inject("trend")
@observer
export default class extends BaseReact<{}, {}> {
  state = {
    nowRealID: null,
    unit: "",
  };

  buffer = {};
  trend = null;
  chartRef = null;
  chartOption = {
    width: 0,
    height: 500,
  };
  constructor(props) {
    super(props);

    this.trend = props.trend;
    this.chartRef = React.createRef();
    this.buffer = this.initBuffer();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { nowRealID, unit, } = this.state;
    const nextNowRealID = nextState.nowRealID;
    const nextUnit = nextState.unitl;
    return nowRealID !== nextNowRealID || unit !== nextUnit;
  }

  render() {
    const { trendList, trendUpdateList, } = this.trend;
    const { nowRealID, } = this.state;
    return (
      <div
        ref={ref => (this.chartRef = ref)}
        className="symbol-chart-container"
      >
        <BasicChart chartOption={this.chartOption}>
          <AreaSeries
            symbol={nowRealID}
            initList={trendList}
            updateList={trendUpdateList}
          />
        </BasicChart>
      </div>
    );
  }

  componentDidMount() {
    const { setReceviceMsgLinter, setStatusChangeListener, } = this.props;
    setReceviceMsgLinter(this.receviceMsgLinter);
    setStatusChangeListener(this.statusChangListener);
  }

  componentDidUpdate(prevProps, prevState) {
    const { nowRealID, unit, } = this.state;
    if (
      !nowRealID ||
      (nowRealID === prevState.nowRealID && unit === prevState.unit)
    )
      return;
    this.chartOption = {
      width: this.chartRef.clientWidth,
      height: this.chartRef.clientHeight - 50,
    };

    this.clearBuffer();
    this.trend.fetchTrendList(nowRealID, unit);
  }

  //function

  receviceMsgLinter = d => {
    const { nowRealID, } = this.state;
    const { data, } = d;

    const { buffer, } = this;
    const { timeId, BUFFER_TIME, list, } = buffer;
    const receviceTime = moment().valueOf();
    buffer.list.push(data);

    if (timeId) window.clearTimeout(timeId);
    if (!this.checkBuffer(buffer, receviceTime)) {
      buffer.timeId = window.setTimeout(() => {
        this.updateContent(buffer);
      }, BUFFER_TIME);
      return;
    }

    this.updateContent(buffer);
  };

  statusChangListener = (before, next) => {};

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
    buffer.list = this.sortList(list);

    this.trend.setTrendUpdateList(buffer.list);

    this.buffer = this.initBuffer();
  };

  sortList = list => {
    const tmp = Object.assign([], list);

    tmp.sort((a, b) => {
      if (a.timestamp > b.timestamp) {
        return 1;
      }

      if (a.timestamp < b.timestamp) {
        return -1;
      }

      if (a.timestamp === b.timestamp) {
        return 0;
      }
    });

    return tmp;
  };

  clearBuffer = () => {
    const { timeId, } = this.buffer;
    window.clearTimeout(timeId);
    this.buffer = this.initBuffer();
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
