import { moonAPI as API } from "utils/request";
import { AxiosRequestConfig } from 'axios';

const getNewstockList = (config) =>
  API.get(`/trader/newstock`, config);

const getUserSubscribeList = (config) =>
  API.get(`/trader/newstock-participate`, config);

const createSubscribeOrder = (config) =>
  API.post(`/trader/newstock-participate`, config);

export default {
  getNewstockList,
  getUserSubscribeList,
  createSubscribeOrder,
};