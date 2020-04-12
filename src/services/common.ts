import { AxiosRequestConfig } from 'axios';
import { downloadRgbAPI, uploadAPI } from 'utils/request';


const downloadRgb = (config: AxiosRequestConfig): Promise<any> => 
  downloadRgbAPI.get('', config);

const uploadFile = async (config, url = '/uploadFile') => {
  return await uploadAPI.post(url, config, { headers: { 'Content-Type': 'multipart/form-data', }, });
};

export default {
  downloadRgb,
  uploadFile,
};