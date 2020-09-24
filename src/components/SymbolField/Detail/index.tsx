import * as React from "react";
import { useState, useEffect } from "react";

import { Button } from "antd";

import {
  SCREEN_DETAIL,
  SCREEN_BUY
} from "pages/Symbol/Right/config/screenList";
import ToolHeader from "components/SymbolTool/ToolHeader";
import MainDetail from "components/SymbolTool/MainDetail";
import ContractDetail from "components/SymbolTool/ContractDetail";
import utils from "utils";
import api from "services";

import classNames from "classnames/bind";
import globalCss from "app.module.scss";

const globalCx = classNames.bind(globalCss);
const fetchCurrentSymbol = async id => {
  const res = await api.market.getCurrentSymbol(id);

  if (res.status !== 200) return null;

  return res.data;
};
const createSymbolObj = d => {
  const {
    id,
    name,
    profit_currency_display,
    max_lots,
    purchase_fee,
    contract_size,
    margin_currency_display,
    min_lots,
    selling_fee,
  } = d.symbol_display;

  return {
    symbolKey: `${id}-${name}`,
    id: id,
    contractInfo: {
      purchase_fee,
      selling_fee,
      contract_size,
      profit_currency_display,
      margin_currency_display,
      min_lots,
      max_lots,
    },
  };
};

export default ({ type, symbolKey, rowInfo, onPurchasShow, }) => {
  const [symbolInfo, setSymbolInfo] = useState({});
  useEffect(() => {
    if (!rowInfo) return;
    const fetchData = async () => {
      const d = await fetchCurrentSymbol(rowInfo.nowRealID);
      if (d === null) return;
      const info = createSymbolObj(d);

      setSymbolInfo(info);
    };
    fetchData();
  }, [rowInfo, symbolKey]);
  const showCls =
    (type === SCREEN_DETAIL || type === SCREEN_BUY) && symbolKey ? "show" : "";
  const { contractInfo, } = symbolInfo;
  return (
    <div className={`symbol-tool-item symbol-detail ${showCls}`}>
      <ToolHeader {...rowInfo} />
      <MainDetail />
      <ContractDetail {...contractInfo} />
      <div className="detail-btn-container">
        <Button
          className={globalCx("btn-yellow", "symbol-tool-buy")}
          onClick={() => {
            onPurchasShow(symbolInfo);
          }}
        >
          下單
        </Button>
      </div>
    </div>
  );
};
