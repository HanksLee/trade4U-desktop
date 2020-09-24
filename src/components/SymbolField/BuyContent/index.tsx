import * as React from "react";
import { observer, inject } from "mobx-react";
import { autorun } from "mobx";

import { Tabs, Row, Col, DatePicker } from "antd";

import moment from "moment";

import { BaseReact } from "components/@shared/BaseReact";
import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";

import utils from "utils";

export default ({ type, symbolKey, }) => {
  const showCls =
    (type === SCREEN_BUY) && symbolKey ? "show" : "";
  return (
    <div className={`symbol-tool-item symbol-buy-content ${showCls}`}>

    </div>
  );
};


