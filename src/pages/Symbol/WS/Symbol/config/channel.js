
export const SELF = "SELF";
export const NONE = "NONE";

const channelConfig = [
  {
    channelCode:SELF,
    path:"self-select-symbol",
    connectDistanceTime:2000,
    tryConnectMax:10,
    disconnectMax:10,
    bufferInfo:null
  },
  {
    channelCode:NONE,
    path:"<symbol_type_code>/symbol",
    pathKey:["symbol_type_code"],
    connectDistanceTime:2000,
    tryConnectMax:10,  
    disconnectMax:10,
    bufferInfo:null
  }
];

export default channelConfig;