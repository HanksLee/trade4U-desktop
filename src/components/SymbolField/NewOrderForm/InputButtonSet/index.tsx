import React from "react";

import classNames from "classnames/bind";
import styles from "./index.module.scss";
const cx = classNames.bind(styles);

export function InputButtonSet(props) {
  const { onIncrement, onDecrement, children, ...restProps } = props;
  return (
    <div className={cx("input-button-set")} {...restProps}>
      <button
        onClick={onDecrement}
        className={cx("input-button", "input-button-left")}
      >
        -
      </button>
      {children}
      <button
        onClick={onIncrement}
        className={cx("input-button", "input-button-right")}
      >
        +
      </button>
    </div>
  );
}
