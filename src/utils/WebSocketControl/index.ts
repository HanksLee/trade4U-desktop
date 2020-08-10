import ws from "../ws";

import {
  STANDBY, //啟動ws之前
  CONNECTING, //已開通通路，未接收到訊息
  CONNECTED, //已接收到訊息
  DISCONNECTED, //斷線
  RECONNECT, //斷線重新連線
  ERROR //
} from "./status";

import {
  NORMAL,
  AUTO,
  NONE
} 
  from './close';

export default class WebSocketControl {
  wsInstance = null;
  _path = null;
  nowProgress = STANDBY;


  closeCode = 0;

  checkInfo = {
    timeIdList: [],
    distanceTime: 1000,
    count: 0,
  };
  _config = {
    path: null,
    connectDistanceTime: 1000,
  };

  statusEvt = {
    [STANDBY]: null,
    [CONNECTING]: null,
    [CONNECTED]: null,
    [RECONNECT]: null,
    [DISCONNECTED]: null,
    [ERROR]: null,
  };

  handleStatusChange = null;
  handleReceiveMsg = null;

  constructor(config) {
    for (let key in this._config) {
      const value = config[key];

      if (value) this._config[key] = value;
    }
    this._path = this._config.path;
    this.checkInfo.distanceTime = this._config.connectDistanceTime;
  }

  //public
  startWS() {
    if (this.wsInstance) return;
    this.callStatusEvent(STANDBY);

    try {
      if(!this._path)
        return;
      this.wsInstance = ws(this._path);
      this.eventSetting();
    } catch (e) {
      this.settingErrorEvent(e);
    }
  }

  reconnectWS() {
    try {   
      if(this.wsInstance) {
        this.closeCode = AUTO;
        this.wsInstance.close();
        this.wsInstance = null;     
      }   
      this.callStatusEvent(RECONNECT);
      this.startWS();
    } catch (e) {
      this.settingErrorEvent(e);
    }
  }

  closeWS() {
    if(this.nowProgress === DISCONNECTED)
      return;
    try {
      this.closeCode = NORMAL;    
      this.clearCheckEvent();
      this.wsInstance.close();
      this.wsInstance = null;
    } catch (e) {
      this.settingErrorEvent(e);
    }
  }

  setStatusChange(fn) {
    this.handleStatusChange = fn;
  }
  setReceviceMsg(fn) {
    this.handleReceiveMsg = fn;
  }

  setStatusEvent(key, event) {
    this.statusEvt[key] = event;
  }

  sendMsg(o) {
    const s = JSON.stringify(o);
    try{
      if(this.wsInstance.readyState !== 1) return;
      this.wsInstance.send(s);
    }catch(e) {
      this.settingErrorEvent(e);
    }
  }

  heartBeatTest() {
    this.sendMsg({
      type: "ping",
    });
  }

  replaceUrl(path) {
    if(!path) {
      this.closeWS();
      return;
    }
     
    this._path = path;
    this.reconnectWS();
  }

  //private
  eventSetting() {
    this.wsInstance.addEventListener("open", e => {
      this.callStatusEvent(CONNECTING, this.checkInfo.count);
      this.checkInfo.timeIdList.push(this.setHeartBeatTimeCheck(0));
    });

    this.wsInstance.addEventListener("message", e => {
      const msg = JSON.parse(e.data);
      const { type, } = msg;
      this.checkConnect(type);

      if (this.handleReceiveMsg && type !== "pong")
        this.handleReceiveMsg(this, msg);
    });
    this.wsInstance.addEventListener("error", e => {
      this.settingErrorEvent(e);
    });

    this.wsInstance.addEventListener("close", e => {
      const { code, } = e;
      if(code !== 1000) {
        this.closeCode = AUTO;
      }
      else{
        this.closeCode = NORMAL;
      }
      
      // console.log(e);
      this.callStatusEvent(DISCONNECTED, this.closeCode);
    });
  }

  callStatusEvent(type, msg = null) {
    if (this.handleStatusChange && this.nowProgress !== type)
      this.handleStatusChange(this, this.nowProgress, type);

    this.nowProgress = type;

    let eventHandler = null;

    if(type === ERROR)
      this.clearCheckEvent();
    eventHandler = this.statusEvt[type];
    if (eventHandler) eventHandler(this, msg);
  }

  //取消舊的檢查，設定新的檢查
  checkConnect(type = "") {
    if (type === "pong") {
      this.callStatusEvent(CONNECTED);
    }

    const { distanceTime, } = this.checkInfo;
    this.clearCheckEvent();
    this.checkInfo.timeIdList.push(this.setHeartBeatTimeCheck(distanceTime));
  }

  //時間到發送心跳，再設定下一次檢查
  setHeartBeatTimeCheck(ms) {
    return window.setTimeout(() => {
      this.checkInfo.count++;
      this.heartBeatTest();

      const { count, distanceTime, } = this.checkInfo;
      if(this.wsInstance && this.wsInstance.readyState < 2)
        this.checkInfo.timeIdList.push(this.setHeartBeatTimeCheck(distanceTime));
      this.callStatusEvent(CONNECTING, count);
    }, ms);
  }

  clearCheckEvent() {
    this.checkInfo.timeIdList.forEach((id)=>{
      window.clearTimeout(id);
    }); 
    this.checkInfo.count = 0;
    this.checkInfo.timeIdList = [];
  }

  settingErrorEvent(e) {
    this.clearCheckEvent();
    if(this.wsInstance)
      this.callStatusEvent(ERROR, e);
  }
}
