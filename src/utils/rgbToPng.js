import { encode as encodePNG } from 'fast-png';
import common from 'services/common';

let _byteLength = 0;

// 固定宽高
const clientWidth = 299;
const clientHeight = 299;

const imgByteLength = () => {
  if (_byteLength > 0) return _byteLength;
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const { data, } = ctx.getImageData(0, 0, clientWidth, clientHeight);
    return data.byteLength;
  }
  return 0;
}

export const downloadFetch = async (filename, domId) => {
  const byteLength = imgByteLength();
  if (!byteLength) {
    console.warn('canvas not mounted');
  }
  // const res = await common.downloadRgb();
  const url = `${window.location.origin}/download/rgb/${filename}`;
  const res = await fetch(url, {
    method: 'GET',
  });
  console.log(res);
  const blob = await res.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  const data = new Uint8ClampedArray(byteLength);
  // transform rgb24 to rgba32
  for (let y = 0; y < clientHeight; y++) {
    for (let x = 0; x < clientWidth; x++) {
      const idx = y * clientWidth + x;
      const idxRGB = idx * 3;
      const idxRGBA = idx * 4;
      data[idxRGBA + 0] = uint8[idxRGB + 0];
      data[idxRGBA + 1] = uint8[idxRGB + 1];
      data[idxRGBA + 2] = uint8[idxRGB + 2];
      data[idxRGBA + 3] = 255;
    }
  }

  const pngBuffer = encodePNG({
    data: new Uint8Array(data.buffer),
    height: clientHeight,
    width: clientWidth,
  });

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const { result, } = e.currentTarget;
      const img = document.getElementById(domId);
      if (img) {
        img.src = result;
        resolve(result);
      } else {
        console.warn('img is empty, domId: ', domId);
        resolve();
      }
    };
    reader.readAsDataURL(new Blob([pngBuffer], { type: "image/png", }));
  });
};

// 填入 RGB 文件在第三方云存储上的 URL 地址 （可供公网访问）和 domId
// downloadFetch('RGB 文件地址', 'domId').then(console.log).catch(console.warn);