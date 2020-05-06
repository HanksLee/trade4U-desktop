import { AxiosRequestConfig } from "axios";
import { moonAPI as API } from "utils/request";

const getPaymentMethods = (): Promise<any> =>
  API.get("/trader/payment");

const deposit = (config) => API.post('/trader/deposit', config);

const getWithdrawableBalance = (config: AxiosRequestConfig): Promise<any> =>
  API.get('/trader/withdrawable_balance', config);

const withdraw = (config: AxiosRequestConfig): Promise<any> =>
  API.post('/trader/withdraw', config);

const getTransactionList = (config): Promise<any> =>
  API.get(`/trader/transaction`, {
    ...config,
  });

export default {
  getPaymentMethods,
  deposit,
  getWithdrawableBalance,
  withdraw,
  getTransactionList,
};
