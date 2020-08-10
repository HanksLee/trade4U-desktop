import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";

export default class FilterItem extends React.PureComponent {
  state={
    isItemActive:false,
    symbol_type_name:"",
    id:0,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      ...prevState,
      ...nextProps,
    };
  }


  render() {
    const { isItemActive, symbol_type_name, id, } = this.state;
    const itemClass = isItemActive ? "active" : "";
    return <div
      className={`symbol-filter-item ${itemClass}`}
      onClick={() => this.props.onFilterChange(id, symbol_type_name)}
    >
      {symbol_type_name}
    </div>;
  }
}
