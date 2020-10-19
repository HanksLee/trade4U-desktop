
import { IChannelConfig } from 'components/HOC/WSConnect/config/interface';


export const channelConfig: IChannelConfig = {
  bufferInfo:null,
  pathKey:'',
  path:"order",
  connectDistanceTime:2000,
  tryConnectMax:10,
  disconnectMax:10,
};