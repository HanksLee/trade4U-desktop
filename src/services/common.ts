import {
  moonAPI
} from "utils/request";

const uploadFile = async (config) => moonAPI.post('/upload-file', config);

const getCodeImg = async (config) => moonAPI.get('/captcha', config);

const login = async (config) => moonAPI.post('/trader/login', config);

const getConstantByKey = async (key) => moonAPI.get(`/constant/${key}`);

const getUserInfo = async config => moonAPI.get('/trader/account', config);

const getConfig = async config => moonAPI.get('/trader/config', config);

export default {
  uploadFile,
  getCodeImg,
  login,
  getConstantByKey,
  getUserInfo,
  getConfig,
};