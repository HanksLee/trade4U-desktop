import utils from 'utils';
export default function ws(path) {
  const token = utils.getLStorage('MOON_DESKTOP_TOKEN');

  return new WebSocket(`ws://stock-ws.cangshu360.com/ws/trader/${path}?token=${token}`);
}