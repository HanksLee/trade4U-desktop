import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getMessage = (queryString: string, config: AxiosRequestConfig) =>
  API.get(`/trader/message?${queryString}`, config);

const getNotificationmessage = (
  queryString: string,
  config: AxiosRequestConfig
) => API.get(`/trader/notificationmessage?${queryString}`, config);

export default {
  getMessage,
  getNotificationmessage,
};
