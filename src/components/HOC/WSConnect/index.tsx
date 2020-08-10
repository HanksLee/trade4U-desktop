import * as React from "react";
import { BaseReact } from "components/@shared/BaseReact";
import WebSocketControl from "utils/WebSocketControl";
import {
  STANDBY, //啟動ws之前
  CONNECTING, //已開通通路，未接收到訊息
  CONNECTED, //已接收到訊息
  DISCONNECTED, //斷線
  RECONNECT, //斷線重新連線
  ERROR //
} from "utils/WebSocketControl/status";
import { AUTO, NORMAL } from "utils/WebSocketControl/close";

export default function WSConnect(defaultChannl, channelConfig, Comp) {
  const { path, connectDistanceTime, tryConnectMax, } = defaultChannl;
  const wsControl = new WebSocketControl({
    path: path,
    connectDistanceTime: connectDistanceTime,
  });
  const connectQueue = [];
  const RECONNECT_DELAYTIME = 5000;
  const tryReconnect = () => {
    const id = window.setTimeout(() => {
      wsControl.reconnectWS();
    }, RECONNECT_DELAYTIME);
    connectQueue.push(id);
  };
  
  const clearConnectQueue = () => {
    connectQueue.forEach(id => {
      window.clearTimeout(id);
    });
    connectQueue.splice(0, connectQueue.length);
  };

  return class extends BaseReact {
    state = {
      selectedChannel: defaultChannl,
      refreshChannel: false,
      initMsg:false,
    };

    constructor(props) {
      super(props);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      //console.log("left getDerivedStateFromProps");
      const { selectedChannel, } = prevState;
      const refreshChannel =
        nextProps.channelCode !== selectedChannel.channelCode || 
        selectedChannel.pathKey;

      return {
        ...prevState,
        refreshChannel,
      };
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (!nextState.refreshChannel) {
        return true;
      }

      const newChannel = channelConfig.filter(item => {
        return item.channelCode === nextProps.channelCode;
      });

      if (newChannel.length === 0) {
        return true;
      }

      nextState.selectedChannel = {
        ...newChannel[0],
      };
    
      const { path, pathKey, } = nextState.selectedChannel;
  
      let newPath = path;
      if(pathKey) {
        pathKey.forEach(key => {
          const vaule  = nextProps[key];
          const pathKey = `<${key}>`;
          newPath = newPath.replace(pathKey, vaule);      
        });
      }

      wsControl.replaceUrl(newPath);
      return true;
    }

    render() {
      return (
        <div>
          <Comp
            {...this.props}
            setReceviceMsgLinter={this.setReceviceMsgLinter}
            setStatusChangLinster={this.setStatusChangLinster}
            sendMsg={this.sendMsg}
          />
        </div>
      );
    }

    componentDidMount() {
      this.setWSEvent(wsControl);
      wsControl.startWS();
    }

    componentDidUpdate() {

    }

    componentWillUnmount() {
      wsControl.closeWS();
    }

    //function
    setWSEvent = (wsc) => {
      wsc.setStatusChange((wsc, before, now) => {
        // console.log("StatusChange:" ,`${before}->${now}`);
        if (this.statusChangLinster) this.statusChangLinster(before, now);
      });
      wsc.setReceviceMsg((wsc, msg) => {
        // console.log("ReceviceMsg:" ,msg);
        if (this.receviceMsgLinter) this.receviceMsgLinter(msg);
      });

      wsc.setStatusEvent(STANDBY, wsc => {
        // console.log("STANDBY");
        clearConnectQueue();
      });
      wsc.setStatusEvent(CONNECTING, (wsc, count) => {
        // console.log("CONNECTING:",count);
        if (count === tryConnectMax) tryReconnect();
      });
      wsc.setStatusEvent(CONNECTED, wsc => {
        // console.log("CONNECTED");
      });
      wsc.setStatusEvent(RECONNECT, wsc => {
        //  console.log("RECONNECT");
      });
      wsc.setStatusEvent(DISCONNECTED, (wsc, closeCode) => {
        //  console.log("DISCONNECTED");

        if (closeCode === AUTO) tryReconnect();
      });
      wsc.setStatusEvent(ERROR, (wsc, e) => {
        //  console.log("ERROR");
        wsc.closeWS();
      });
    };

    receviceMsgLinter = null;
    setReceviceMsgLinter = fn => {
      this.receviceMsgLinter = fn;
    };
    statusChangLinster = null;
    setStatusChangLinster = fn => {
      this.statusChangLinster = fn;
    };
    sendMsg =(o)=>{
      wsControl.sendMsg(o);
    }
  };
}
