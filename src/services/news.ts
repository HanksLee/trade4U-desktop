import { moonAPI as API } from "utils/request";
import { AxiosRequestConfig } from 'axios';

const getSymbolTypeList = (config) =>
  API.get(`/trader/news_feed`, config);


export default {
  getSymbolTypeList,
};