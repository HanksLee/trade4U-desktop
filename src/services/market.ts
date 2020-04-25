import { moonAPI as API } from "utils/request";

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
const getCurrentTrade = async (id, config) => API.get(`/trader/order/${id}`, config);
const createTrade = async config => API.post('/trader/order', config);
const updateTrade = async (id, config) => API.patch(`/trader/order/${id}`, config);
const closeTrade = async (id, config) => API.put(`/trader/order/${id}/close`, config);
const deleteTrade = async (id, config) => API.delete(`/trader/order/${id}/delete`, config);


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
  getCurrentTrade,
  createTrade,
  updateTrade,
  closeTrade,
  deleteTrade,
};
