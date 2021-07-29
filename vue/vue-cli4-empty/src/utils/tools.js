import * as UrlConfig from '@/apis/url.config.js';
/**
 * 拿到指定路径下面的模块，减少index.js文件 require.context - dir reg 不能用变量（注意：export default 才可以被引入）
 * @param {string} name
 * @return {Object}
 */
const getModules = (name) => {
  let modulesFiles;
  switch (name) {
    case 'directives':
      modulesFiles = require.context('@/common/directives/', true, /^.+(?<!index)\.js$/);
      break;
    case 'components':
      modulesFiles = require.context('@/common/components/', true, /^.+(?<!index)\.(js|vue)$/);
      break;
    case 'mixins':
      modulesFiles = require.context('@/mixins/', true, /^.+(?<!index)\.(js|vue)$/);
      break;
    case 'apis':
      modulesFiles = require.context('@/apis/', true, /^.+(?<!url.config)\.js$/);
      break;
    case 'prototype':
      modulesFiles = require.context('@/utils/', true, /^.+(?<!request)\.(js|vue)$/);
      break;
  }
  return modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.+)\.(js|vue)$/, '$1');
    const value = modulesFiles(modulePath);
    value.default && (modules[moduleName] = value.default);
    return modules;
  }, {});
};

/**
 * 检测文件类型
 * @param {fileList} files - 上传的文件列表
 * @param {String} acceptType - 文件类型, eg: image/*(支持所有图片格式)  、'.zip,.rar'
 * @return {Boolean} 是否满足文件类型
 */
const checkFileType = (files, acceptType) => {
  const length = files.length;
  for (let i = 0; i < length; i++) {
    if (acceptType === 'image/*' && !files[i].type.startsWith('image/')) return false;
    if (acceptType !== 'image/*') {
      const accept = acceptType.split(',');
      const pointIndex = files[i].name.lastIndexOf('.');
      const fileType = files[i].name.slice(pointIndex);
      if (!accept.includes(fileType)) return false;
    }
  }
  return true;
};

/**
 * 检测文件大小
 * @param {fileList} files - 上传的文件列表
 * @param {number} size - 文件最大尺寸
 * @return {Boolean} 上传的文件是否小于最大尺寸
 */
const checkFileSize = (files, size) => {
  for (const item of files) {
    if (item.size > size) return false;
  }
  return true;
};

/**
 * 获取完整的（接口）请求地址
 * @param {string} url - 接口地址，以'/'开头的接口地址
 * @param {string} urlPrefix - 接口前缀: 类似BASE_URL
 * @return {string}
 */
const getFullUrl = (url, urlPrefix = 'BASE_URL') => {
  return /^(http|https):/g.test(url) ? url : (UrlConfig[urlPrefix] + url);
};

// 根据header里的contenteType转换请求参数
const transformRequestData = (contentType, requestData) => {
  requestData = requestData || {};
  if (contentType.includes('application/x-www-form-urlencoded')) {
    // formData格式：key1=value1&key2=value2，方式二：qs.stringify(requestData)
    let str = '';
    for (const key in requestData) {
      if (Object.prototype.hasOwnProperty.call(requestData, key)) {
        str += `${key}=${requestData[key]}&`;
      }
    }
    return encodeURI(str.slice(0, str.length - 1));
  } else if (contentType.includes('multipart/form-data')) {
    const formData = new FormData();
    for (const key in requestData) {
      const files = requestData[key];
      // 判断是否是文件流
      if (!!files && files.constructor === FileList) {
        for (let i = 0; i < files.length; i++) {
          formData.append(key, files[i]);
        }
        // formData.append(key, files);
      } else {
        formData.append(key, files);
      }
    }
    return formData;
  }
  // json字符串{key: value}
  return Object.keys(requestData).length ? JSON.stringify(requestData) : '';
};

export {
  getModules
};

export default {
  checkFileType,
  checkFileSize,
  getFullUrl,
  transformRequestData
};
