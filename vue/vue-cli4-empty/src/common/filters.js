// 转换空字符串
const transformNull = (value, defaultString) => {
  defaultString = (defaultString || defaultString === 0) ? defaultString : '-';
  return value || value === 0 ? value : defaultString;
};

export default {
  transformNull
};
