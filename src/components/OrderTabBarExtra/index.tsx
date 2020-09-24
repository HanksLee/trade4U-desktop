import * as React from "react";
import { Col, DatePicker } from "antd";
import moment from "moment";
const { RangePicker, } = DatePicker;

const disabledDate = current => {
  const startDay = moment().subtract(3, "M");
  return current > moment().endOf("day") || current < startDay.endOf("day");
};


export default ({ isShowDatePicker, foldTabs,  onBtnBottomClick, onDateChange, }) => {
  const btnBottomCls = foldTabs ? "open" : "close";
  const showPickerStyle = isShowDatePicker
    ? {
      display: "none",
    }
    : null;
  return (
    <Col span={24}>
      <RangePicker
        style={showPickerStyle}
        format="YYYY-MM-DD"
        disabledDate={disabledDate}
        onChange={(dateRange)=> onDateChange(dateRange)}
      />
      <span onClick={() => onBtnBottomClick()} className={`symbol-bottom-btn  ${btnBottomCls}`} />
    </Col>
  );
};
