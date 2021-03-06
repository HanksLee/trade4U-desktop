import {
  validateIdCard,
  validateHKMC,
  validateTW,
  validatePSPort,
  validateMobile,
  validateEmail,
  validateHexColor
} from './validator-helper';
import utils from 'utils';

export interface IRule {
  strategy: string;
  errMsg: string;
  cb?(): void | undefined;
}

interface IValidator {
  add(value: any, rules: IRule[], cb?: () => any): void;
  start(): void;
}

const strategies = {
  isNonEmpty(value, errMsg, cb) {
    if (value !== 0) {
      if (utils.isEmpty(value)) {
        cb && cb();
        return errMsg;
      }
    }
  },
  maxLength(value, length, errMsg, cb) {
    if (value.length > length) {
      cb && cb();
      return errMsg;
    }
  },
  minLength(value, length, errMsg, cb) {
    if (value.length < length) {
      cb && cb();
      return errMsg;
    }
  },
  isEmail(value, errMsg, cb) {
    if (!validateEmail(value)) {
      cb && cb();
      return errMsg;
    }
  },
  isMobile(value, errMsg, cb) {
    if (!validateMobile(value)) {
      cb && cb();
      return errMsg;
    }
  },
  isID(value, type, errMsg, cb) {
    let validator = null;
    if (type === 'id') {
      validator = validateIdCard;
    } else if (type === 'HKMC') {
      validator = validateHKMC;
    } else if (type === 'TW') {
      validator = validateTW;
    } else if (type === 'PSPort') {
      validator = validatePSPort;
    }

    if (!validator(value)) {
      cb && cb();
      return errMsg;
    }
  },
  isNumber(value, errMsg, cb) {
    if (value && Number.isNaN(Number(value))) {
      cb && cb();
      return errMsg;
    }
  },
  isHexColor(value, errMsg, cb) {
    const val = value.toString();

    if (!val || !validateHexColor(val)) {
      cb && cb();
      return errMsg;
    }
  },
};

export default class Validator implements IValidator {
  private cache: any[] = [];

  public add(value, rules): void {
    for (const rule of rules) {
      const strateAry = rule.strategy.split(':');

      this.cache.push(() => {
        const strategy = strateAry.shift();
        strateAry.unshift(value);
        strateAry.push(rule.errMsg);
        strateAry.push(rule.cb);

        return strategies[strategy].apply(null, strateAry);
      });
    }
  }

  public start(): void {
    for (const func of this.cache) {
      const errMsg = func();
      if(errMsg) return errMsg;
    }
  }
}
