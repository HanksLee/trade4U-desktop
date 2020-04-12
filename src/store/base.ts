import $api from 'services';
import { message } from 'antd';


export default class BaseStore {
  protected $api = $api;
  protected $msg: any = message;
}