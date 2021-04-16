/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/10
 *********************************************************************/

import Tool from "../utils/tool";

/**
 * 数字取精度方法
 * @param val 原始值
 * @param precision 精度（默认两位）
 * @returns {number} 返回值
 */
let fixNumber = (val, precision) => {
  if (!precision) precision = 2;
  let $nv = parseFloat(val);
  if (!isNaN($nv)) {
    return parseFloat($nv.toFixed(precision));
  } else {
    return $nv;
  }
};

/**
 * 日期格式化
 * @param val 原始值
 * @param format 格式YYYY-MM-DD hh:mm:ss
 * @returns {string} 返回值
 */
let dateFormat = (val, format) => {
  return !!val ? Tool.dateFormat(format, val) : '-';
};

/**
 * 流量单位
 * @param val 原始值
 * @param unit 单位
 * @returns {string} 返回值
 */
let filterSpeed = (value, unit = 'B') => {
  return Tool.formatFileSize(value, unit);
}

/**
 * 千分位
 * @param val 原始值
 * @param unit 单位
 * @returns {string} 返回值
 */
let numberWithCommas = (val, unit) => {
  return Tool.numberWithCommas(val, unit);
}

// 转换空字符串
let transformNull = (value, defaultString) => {
  defaultString = (defaultString || defaultString === 0) ? defaultString : '-';
  return value || value === 0 ? value : defaultString;
}

// 数组转字符串
let transArrayToString = (value, split = '') => {
  return (value || []).join(split);
}

// 字符串转数组
let transStringToArray = (value, split = '') => {
  return (value || '').split(split);
}

export {
  fixNumber,
  dateFormat,
  filterSpeed,
  numberWithCommas,
  transformNull,
  transArrayToString,
  transStringToArray
};
