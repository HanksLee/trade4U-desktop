import gt from 'utils/gettext';
import locales from 'locales';
import isEmpty from 'lodash/isEmpty';
import { PAGE_ROUTES, STOCK_COLOR_MAP } from 'constant';
import PromiseFileReader from 'promise-file-reader';
import commonAPI from 'services/common';
import NProgress from 'nprogress';

function setRootFontSizeFromClient() {
  let dpr, rem;
  const htmlEl = document.getElementsByTagName("html")[0],
    docEl = document.documentElement,
    metaEl = document.querySelector('meta[name="viewport"]');

  dpr = (window as any).devicePixelRatio || 1;
  rem = docEl.clientWidth;
  metaEl.setAttribute(
    "content",
    `width=${docEl.clientWidth},initial-scale=${1},maximum-scale=${1}, minimum-scale=${1},use-scalable=no`
  );

  docEl.setAttribute("data-dpr", dpr);
  htmlEl.style.fontSize = `${rem}px`;

  (window as any).dpr = dpr;
  (window as any).rem = rem;
  (window as any).r = function(value: number | string): string {
    value = Number(value);
    // @ts-ignore
    return `${(value / process.env.designWidth)}rem`;
  };

  window.onresize = function() {
    htmlEl.style.fontSize = `${document.documentElement.clientWidth}px`;
  };
}

function ellipsis(value: string, len = 10) {
  if (!value) return '';

  value = value.toString();
  return value.length > len ? value.slice(0, len) + '...' : value;
}

function initI18n(lang: string) {
  gt.init(locales);
}

function getPageBreadcrumb(url) {
  const breadcrumbs = [];

  function getBreadcrumb(pathList) {
    const matched = pathList.find(item => url.indexOf(item.path) > -1);
    breadcrumbs.push(matched);

    if (!isEmpty(matched && matched.children)) {
      pathList = matched.children;
      getBreadcrumb(pathList);
    }
  }

  getBreadcrumb(PAGE_ROUTES);

  return breadcrumbs;
}

function _isEmpty(value) {
  if (
    typeof value === 'undefined' ||
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean' ||
    value instanceof Date) {
    return !Boolean(value);
  } else {
    return isEmpty(value);
  }
}

function setLStorage(key, value) {
  if (!_isEmpty(value)) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

function getLStorage(key) {
  const ret = JSON.parse(localStorage.getItem(key));
  return ret;
}

function rmLStorage(key) {
  localStorage.removeItem(key);
}

async function readAsDataURL(file) {
  return await PromiseFileReader.readAsDataURL(file);
}

async function uploadFile(payload) {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    // @ts-ignore
    fd.append(key, value);
  }
  NProgress.start();
  const res = await commonAPI.uploadFile(fd);
  if (res.data.ret == 0) {
    NProgress.done();
    return res.data.data.file;
  } else {
    NProgress.done();
    return Promise.reject(res.data.msg);
  }
}

function getFileInfo (file, callback?) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function(evt) {
    const url = evt.currentTarget.result;
    const img = new Image();
    img.src = url;
    img.onload = function(evt) {
      callback && callback(img);
    };
  };
}

function getFormData(payload) {
  const fd = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    // @ts-ignore
    fd.append(key, value);
  }

  return fd;
}

function parseEmoji(text) {
  text = text || '';
  // let ret =  text.replace(/\[(.+?)\]/g, m => {
  //   // @ts-ignore
  //   return String.fromCharCode(`0x${m.substr(5, 4)}`, `0x${m.substr(9, 4)}`);
  // });
  // const ret2 = (window as any).twemoji.parse(ret);
  //
  // return ret2;
  return text;
}

function moveArrayPosition(oldIndex, newIndex, arr) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length;
    while ((k--) + 1) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

  return arr;
}

// 删除对象的多个属性
function delSomeKeys(obj: object, keys: any[]) {
  keys.map(key => delete obj[key]);
  return obj;
}

// 拼接字符串，用于post请求
function spliceQuery(params) {
  let query = "";
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query += `${key}=${value}&`;
    }
  }
  if (query.charAt(query.length - 1) === "&") {
    query = query.substr(0, query.length - 1);
  }
  return query;
}

function getStockChangeClass(change, colorMode) {
  const ret = change > 0
    ? "up"
    : change == 0
      ? "balance"
      : "down";

  return STOCK_COLOR_MAP[colorMode][ret];
}

function setSignStirng(number) {
  const sign = Math.sign(number);
  return sign > 0 ? `+${number}` : number;
}



export default {
  setRootFontSizeFromClient,
  initI18n,
  isEmpty: _isEmpty,
  getPageBreadcrumb,
  setLStorage,
  getLStorage,
  rmLStorage,
  ellipsis,
  readAsDataURL,
  uploadFile,
  parseEmoji,
  getFormData,
  moveArrayPosition,
  delSomeKeys,
  spliceQuery,
  getFileInfo,
  getStockChangeClass,
  setSignString: setSignStirng,
};
