import Tools from '@/utils/tools';

// 日期格式化
const formatDate = (val, type) => val ? Tools.formatDate(type, val) : '-';

// 字节大小格式化
const formatByteSize = (val) => Tools.formatByteSize(val);

// 数字千分位展示
const numberWithCommas = val => Tools.numberWithCommas(val);

// 转换空字符串
const transformNull = (value, defaultString) => {
  defaultString = (defaultString || defaultString === 0) ? defaultString : '-';
  return value || value === 0 ? value : defaultString;
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

export default {
  formatDate,
  formatByteSize,
  numberWithCommas,
  transformNull,
  transformStatus,
  transformArrToStr,
  transformStrToArr
};
