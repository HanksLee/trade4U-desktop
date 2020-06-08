import utils from "utils";

const wsMap = {
  dev: "cangshu360.com",
  qa: "cangshu360.com",
  prod: "trading8a.com",
};

export default function ws(path) {
  const token = utils.getLStorage("MOON_DESKTOP_TOKEN");

  return new WebSocket(
    `ws://stock-ws.${wsMap[process.env.MODE]}/ws/trader/${path}?token=${token}`
  );
}
