import { moonAPI as API } from "utils/request";
import {
  AxiosRequestConfig
} from 'axios';

const getSelfSelectSymbolList = (config) =>
  API.get("/trader/self_select_symbol", config);

const addSelfSelectSymbolList = (config) =>
  API.post("/trader/self_select_symbol", config);

const deleteSelfSelectSymbolList = (config) =>
  API.delete("/trader/self_select_symbol", config);

const sortSelfSelectSymbolList = (config) =>
  API.post("/trader/symbol_sort", config);

const getSymbolTypeList = (config) =>
  API.get("/trader/symbol_type", config);

const getSymbolList = (config) =>
  API.get("/trader/symbol", config);

const getCurrentSymbol = (id, config = {}) => API.get(`/trader/symbol/${id}`, config);

const searchSymbol = (config) => API.get('/trader/search', config);

const getTradeInfo = async config => API.get('/trader/meta-fund', config);

const getTradeList = async config => API.get('/trader/order', config);

const getTradeHistoryList = async config => API.get('/trader/finish-order', config);

const getCurrentTrade = async (id, config) => API.get(`/trader/order/${id}`, config);

// 订单接口
const createOrder = config => API.post('/trader/order', config);
const updateOrder = (id, config) => API.patch(`/trader/order/${id}`, config);
const closeOrder = (id, config) => API.put(`/trader/order/${id}/close`, config);
const deleteOrder = async (id, config) => API.delete(`/trader/order/${id}/delete`, config);
const getProductTrend = (prodcut_code: string, config: AxiosRequestConfig): Promise<any> =>
  API.get(`/trader/symbol/${prodcut_code}/trend`, config);

const getSymbolTypeRank = (code: string, config: AxiosRequestConfig): Promise<any> =>
  API.get(`/trader/symbol/${code}/rank`, config);


export default {
  getSelfSelectSymbolList,
  addSelfSelectSymbolList,
  deleteSelfSelectSymbolList,
  sortSelfSelectSymbolList,
  getSymbolTypeList,
  getSymbolList,
  getCurrentSymbol,
  searchSymbol,
  getTradeInfo,
  getTradeList,
  getTradeHistoryList,
  getCurrentTrade,
  createOrder,
  updateOrder,
  closeOrder,
  deleteOrder,
  getProductTrend,
  getSymbolTypeRank,
};