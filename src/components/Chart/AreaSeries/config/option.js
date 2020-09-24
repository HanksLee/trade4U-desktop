export default {
  priceScaleId: "left", //價格現的位置
  crosshairMarkerVisible: true, //是否顯示十字中心點
  crosshairMarkerRadius: 5, //十字中心點圓半徑
  priceLineWidth: 1, //價格現的粗細
  priceFormat: {
    //價格軸格式
    type: "volume",
    precision: 4, //小數位
    minMove: 0.0001, //最小單位
  },
  scaleMargins: {
    //
    top: 0.6,
    bottom: 0.05,
  },
  topColor: "#585C21", //上層顏色，靠近線條
  lineColor: "#ECF70A", //線條顏色
  bottomColor: "#3A3C27", //下層顏色，靠近x軸
  lineWidth: 2, //線條粗細

};
