import { IBuffer } from 'utils/buffer';

export interface IChannelConfig {
  path: string;
  pathKey: string;
  bufferInfo: IBuffer;
  connectDistanceTime: number;
  tryConnectMax: number;
  disconnectMax: number;
}

