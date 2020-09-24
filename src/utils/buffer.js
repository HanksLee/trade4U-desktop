import moment from "moment";

const buffer = {
  BUFFER_MAXCOUNT: 50,
  BUFFER_TIME: 2000,
  timeId: 0,
  lastCheckUpdateTime: moment().valueOf(),
  register: null,
};

export const initBuffer = (limitTime, maxCount, regType) => {
  const tmp = Object.assign({}, buffer);
  const BUFFER_TIME = limitTime || buffer.BUFFER_TIME;
  const BUFFER_MAXCOUNT = maxCount || buffer.BUFFER_MAXCOUNT;
  const register = regType ? createRegister(regType) : [];
  const lastCheckUpdateTime = moment().valueOf();
  return {
    ...tmp,
    BUFFER_TIME,
    BUFFER_MAXCOUNT,
    register,
    lastCheckUpdateTime,
  };
};

export const checkBuffer = (
  BUFFER_TIME,
  BUFFER_MAXCOUNT,
  maxCount,
  lastCheckUpdateTime,
  receviceTime
) => {
  if (
    receviceTime - lastCheckUpdateTime >= BUFFER_TIME ||
    maxCount >= BUFFER_MAXCOUNT
  )
    return true;
  else return false;
};

export const mergeRegisterData = (reg, msg) => {
  const { type, data } = msg;
  if (Array.isArray(reg)) {
    const d = Array.isArray(data) ? data : [data];
    return [...reg, ...d];
  }
  const regValue = reg[type];

  if (!regValue) {
    return;
  }

  if (Array.isArray(data)) {
    for (let value of data) {
      reg[type].push(value);
    }
  } else {
    reg[type].push(value);
  }

  return reg;
};

export const getRegisterCount = (reg) => {
  if (Array.isArray(reg)) {
    return reg.length;
  }

  let total = 0;
  for (let value of reg) {
    total += value.length;
  }

  return total;
};
export const checkRegisterHasValue = (reg)=>{
  if(Array.isArray(reg)){
    return reg.length !== 0;
  }

  let count = 0;
  for(value of reg){
    count += value.length;
  }

  return count !== o;
}

const createRegister = (typeList) => {
  const reg = {};
  for (let type of typeList) {
    reg[type] = [];
  }

  return reg;
};


