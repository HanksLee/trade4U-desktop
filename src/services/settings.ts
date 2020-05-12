import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getAccountInfo = (config: AxiosRequestConfig) =>
  API.get("/trader/account", config);

const updateAccountInfo = (config: any) => API.patch("/trader/account", config);

const resetPassword = (config: any) =>
  API.put("/trader/account/reset-pwd", config);

const sendSMS = (config: any) => API.post("/trader/send-sms", config);

const verifySMS = (config: any) => API.post("/trader/verify-sms", config);

export default {
  getAccountInfo,
  updateAccountInfo,
  resetPassword,
  sendSMS,
  verifySMS
};
