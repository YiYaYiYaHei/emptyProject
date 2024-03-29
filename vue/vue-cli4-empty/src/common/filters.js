import Tools from '@/utils/tools';
import Dict from '@/utils/dict';

// 日期格式化
const formatDate = (val, type = 'YYYY-MM-DD hh:mm:ss') => val ? Tools.formatDate(type, val) : '-';

// 字节大小格式化
const formatByteSize = (val) => Tools.formatByteSize(val);

// 数字千分位展示
const numberWithCommas = val => Tools.numberWithCommas(val);

// 转换空字符串
const transformNull = (value, defaultString = '-') => {
  return value === 0 || !Tools.dataIsEmpty(value) ? Tools.escapeStr(value) : defaultString;
};

// 成功/失败/告警状态
const transformStatus = (value, status) => {
  if (status === 'success') return `<span class="status-success">${value}</span>`;
  if (status === 'error') return `<span class="status-error">${value}</span>`;
  if (status === 'warning') return `<span class="status-warning">${value}</span>`;
  return value;
};

// 数组转字符串
const transformArrToStr = (val, sep = ',', emptyVal = '-') => Tools.arrayToString(val, sep, emptyVal);

// 字符串转数组
const transformStrToArr = (val, sep = ',', emptyVal = '-') => Tools.stringToArray(val, sep, emptyVal);

// 码址等级
const transCodeLevel = (value, isHtml = true) => {
  const label = (Dict.codeLevel.find(item => item.value === value) || {label: '灰名单'}).label.substr(0, 1);
  return isHtml ? `<span class="code" level="${value}">${label}</span>` : label;
};

export default {
  formatDate,
  formatByteSize,
  numberWithCommas,
  transformNull,
  transformStatus,
  transformArrToStr,
  transformStrToArr,
  transCodeLevel
};
