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


export {
  fixNumber,
  dateFormat,
  filterSpeed,
  numberWithCommas
};
