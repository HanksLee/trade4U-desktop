import { moonAPI as API } from "utils/request";
import { AxiosRequestConfig } from 'axios';

const getNewsList = (config) =>
  API.get(`/trader/news_feed`, config);


export default {
  getNewsList,
};