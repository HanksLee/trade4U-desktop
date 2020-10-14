export interface IPriceInfo {
  symbol: string;
  sell: number;
  buy: number;
  change: number;
  chg: number;
  high: number;
  low: number;
  close: number;
  open: number;
  volume: number;
  amount: number;
  amplitude: number;
  timestamp: number;
}

export interface IContractInfo {
  purchase_fee: number;
  selling_fee: number;
  contract_size: number;
  profit_currency_display: number;
  margin_currency_display: number;
  min_lots: number;
  max_lots: number;
}

export interface ISymbolItem {
  symbol_type_code: string;
  symbolKey: string;
  symbolCode: string;
  symbolId: number;
  name: string;
  trader_status: string;
  priceInfo: IPriceInfo;
}


