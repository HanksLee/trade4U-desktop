import React from "react";
import classNames from "classnames/bind";
import styles from "./index.module.scss";
const cx = classNames.bind(styles);
export function NewOrderRule(props) {
  return (
    <React.Fragment>
      <div className={cx("form-item")}>
        <div className={cx("label")}>服务费</div>
        <div className={cx("rule-description")}>
          {"HKD"} ${100}(手续费)
        </div>
      </div>
      <div className={cx("form-item")}>
        <div className={cx("label")}>递延费</div>
        <div className={cx("rule-description")}>
          ${100} ({"HKD"} / 交易日)
        </div>
      </div>
      <div className={cx("form-item")}>
        <div className={cx("label")}>参考汇率</div>
        <div className={cx("rule-description")}>{100}</div>
      </div>
      <div className={cx("form-item")}>
        <div className={cx("label")}>總計</div>
        <div className={cx("rule-description")}>
          {"HKD"} ${100}元
        </div>
      </div>
      <div className={cx("rule-description")}>＊ 總計 = 操作資金 + 服務費</div>
    </React.Fragment>
  );
}
