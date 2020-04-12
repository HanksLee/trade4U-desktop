import React, { Component } from 'react';
import {
  Chart,
  Geom,
  Axis,
  Tooltip
} from "bizcharts";
import './index.scss';

export interface IReadMoreProps {
  data: any[];
  height: number; // 图表的高度，单位为 'px'
  toolTip?(title: string, value: string): any; // 自定义toolTip
}

export interface IReadMoreState {

}

class BasicBar extends Component<IReadMoreProps, IReadMoreState> {
  state = {}

  static defaultProps = {
    height: 400,
  }

  render() {
    const { data, height, toolTip, } = this.props;

    return (
      <div>
        <Chart padding="auto" height={height} data={data} forceFit>
          <Axis name="x" />
          <Axis name="y" />
          <Tooltip
            crosshairs={{
              type: "y",
            }}
          />
          <Geom type="interval" position="x*y" 
            tooltip={toolTip && ['x*y', toolTip]}/>
        </Chart>
      </div>
    );
  }
}

export default BasicBar;