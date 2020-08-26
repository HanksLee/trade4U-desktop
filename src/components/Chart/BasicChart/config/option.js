export default {
  width: 0,
  height: 295,
  rightPriceScale: {//右邊價格軸
    visible: false,//是否顯示
  },
  leftPriceScale: {//左邊價格軸
    visible: true
  },
  timeScale: {//時間現
    timeVisible:true,
    secondsVisible:true,
    visible: false
  },
  crosshair: {//十字參考線
    horzLine: {//縱軸
      visible: true
    },
    vertLine: {//橫軸
      visible: true
    }
  },
  layout: {//整體畫面
    backgroundColor: "#00000000",
    textColor: "#FFF"
  },
  grid: {//表格線條
    vertLines: {
      color: "#424552"
    },
    horzLines: {
      color: "#424552"
    }
  }
};
