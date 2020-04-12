import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError
} from 'axios';
import { message } from 'antd';
import NProgress from 'nprogress';

const baseURL = {
  dev: '/api/post', // webpack 代理
  qa: '/api/post',
  prod: '/api/post',
};

export interface IAPI {
  getInstance(): AxiosInstance;
}

export default class API implements IAPI {
  private api: AxiosInstance = null;

  private created(config: AxiosRequestConfig): void {
    this.api = axios.create(config);
  }

  private handleInterceptors() {
    this.api.interceptors.request.use((res: AxiosResponse) => {
      NProgress.start();
      return res;
    }, (err: AxiosError) => {
      NProgress.done();
      return Promise.reject(err);
    });

    this.api.interceptors.response.use(async (res: AxiosResponse) => {
      const { data: { ret, msg, }, } = res;
      if (Number(ret) >= 400) {
        message.error(msg);
        NProgress.done();
        return Promise.reject(msg);
      } else {
        NProgress.done();
        return res;
      }
    }, (err: AxiosError) => {
      NProgress.done();
      return Promise.reject(err);
    });
  }

  constructor(config: AxiosRequestConfig) {
    this.created(config);
    this.handleInterceptors();
  }

  public getInstance(): AxiosInstance {
    return this.api;
  }
}

export const feedAPI = new API({
  baseURL: `${baseURL[process.env.MODE]}`,
}).getInstance();

// http://live-test-dubbox.onfirefit.cn
export const fitnessAPI = new API({
  baseURL: '/api/fitness',
}).getInstance();

// https://agora-testdata.oss-cn-beijing.aliyuncs.com/agora/auditImg/
export const downloadRgbAPI = new API({
  baseURL: '/download/rgb',
}).getInstance();

export const adAPI = new API({
  baseURL: '/api/ad',
}).getInstance();

export const uploadAPI = new API({
  baseURL: `/api/upload`,
}).getInstance();

export const coachAPI = new API({
  baseURL: `/api/coach`,
}).getInstance();

export const courseAPI = new API({
  baseURL: `/api/course`,
}).getInstance();

export const orderAPI = new API({
  baseURL: `/api/order`,
}).getInstance();