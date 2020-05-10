import axios, {
  AxiosRequestConfig,
  AxiosInstance,
  AxiosResponse,
  AxiosError
} from "axios";
import { message } from "antd";
import NProgress from "nprogress";
import utils from "utils";

export interface IAPI {
  getInstance(): AxiosInstance;
}

export default class API implements IAPI {
  private api: AxiosInstance = null;

  private created(config: AxiosRequestConfig): void {
    this.api = axios.create(config);
  }

  private handleInterceptors() {
    this.api.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = utils.getLStorage("MOON_DESKTOP_TOKEN");
        if (token) {
          config["headers"]["Authorization"] = `Token ${token}`;
        }

        NProgress.start();
        return config;
      },
      (err: AxiosError) => {
        const { response: { data, status, }, } = err;

        if (status == 400) {
          message.error(data.message);
        } else if (status == 401) {
          localStorage.removeItem('MOON_DESKTOP_TOKEN');
          window.location.href = '/login';
        }

        NProgress.done();
        return Promise.reject(err);
      }
    );

    this.api.interceptors.response.use(
      async (res: AxiosResponse) => {
        NProgress.done();
        return res;
      },
      (err: AxiosError) => {
        const {
          response: { data, status, },
        } = err;
        message.error(data.message);
        if (status == 401) {
          localStorage.removeItem("MOON_DESKTOP_TOKEN");

          window.location.href =
            process.env.NODE_ENV === "production"
              ? "/login"
              : window.location.origin + "/#/login";
        }
        NProgress.done();
        return Promise.reject(err);
      }
    );
  }

  constructor(config: AxiosRequestConfig) {
    this.created(config);
    this.handleInterceptors();
  }

  public getInstance(): AxiosInstance {
    return this.api;
  }
}

const apiMap = {
  dev: "/api/moon/api",
  qa: "http://api.cangshu360.com/api",
  prod: "http://api.cangshu360.com/api",
};

export const moonAPI = new API({
  baseURL: apiMap[process.env.MODE],
}).getInstance();
