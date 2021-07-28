// 默认导出axios实列，若需要访问多个服务器且这些服务的请求和响应的结构完全不同，此时可以使用axios.create创建不同的实列来处理
import axios from 'axios';
import * as UrlConfig from '@/apis/url.config.js';
import {Message} from 'element-ui';
import store from '@/store';

const TIME_OUT = 60 * 1000;
const MESSAGE = {
  NETWORK_ERR: '哎哟,出问题啦,刷新界面试试！',
  PERMISSION_DENIED: '凭证失效，请重新登录',
  NETWORK_REFUSE: '服务器拒绝连接或连接超时'
};

// 获取请求地址
const getUrl = (url, urlPrefix = 'BASE_URL') => {
  return url ? `${UrlConfig[urlPrefix]}${url}` : '';
};

// 请求拦截器
axios.interceptors.request.use((config) => {
  return config;
}, config => {
  return Promise.reject(config);
});

// 响应拦截器
axios.interceptors.response.use((response) => {
  // 去除response的data层 直接使用数据就可以res.xx即可
  return response.data;
}, (response) => {
  return Promise.reject(response);
});

// 构建请求头--post、put默认'application/x-www-form-urlencoded',其他默认application/json;charset=utf-8
const buildReqHeader = (requestConfig) => {
  const token = localStorage.getItem('current_user_token');
  const contentType = requestConfig.onUploadProgress ? 'multipart/form-data' : (['post', 'put'].includes(requestConfig.method) ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8');
  requestConfig.contentType = requestConfig.contentType || contentType;
  return {
    'Content-Type': requestConfig.contentType,
    Authorization: token
  };
};

// 根据header里的contenteType转换请求参数
const transformRequestData = (requestConfig) => {
  const [contentType, requestData] = [requestConfig.contentType, requestConfig.params];
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

const buildRequestConfig = (requestConfig) => {
  const config = {};
  // axios.transformRequest对于 'PUT', 'POST' 和 'PATCH' 方法，ContentType会自动设置为'application/x-www-form-urlencoded'或者'multipart/form-data'
  config.header = buildReqHeader(requestConfig);
  config.url = /^(http|https):/g.test(requestConfig.url) ? requestConfig.url : getUrl(requestConfig.url, requestConfig.urlPrefix);
  config.method = requestConfig.method;
  config[/get|delete/.test(config.method) ? 'params' : 'data'] = transformRequestData(requestConfig);
  config.timeout = TIME_OUT;

  // 文件上传进度
  requestConfig.onUploadProgress && (config.onUploadProgress = requestConfig.onUploadProgress);

  return config;
};

const sendRequest = async (requestConfig) => {
  const config = buildRequestConfig(requestConfig);
  console.log('config:', config);
  const result = await axios.request(config).catch(e => {
    console.log('错误的请求:', e, e.errMsg);
    const isTimeout = e.errMsg ? e.errMsg.includes('ECONNREFUSED') || e.errMsg.includes('TIMEOUT') : false;
    return {
      message: isTimeout ? MESSAGE.NETWORK_REFUSE : MESSAGE.NETWORK_ERR,
      status: isTimeout ? 502 : 500
    };
  });
  if (!result) {
    return {
      message: MESSAGE.NETWORK_ERR,
      status: 500
    };
  }
  console.log(store);
  // token失效
  if (result.status === 401) {
    result.message = MESSAGE.PERMISSION_DENIED;
    Message.error(result.message);
    localStorage.clear();
    store.commit('mutationResetStore');
    location.replace('/login');
  }
  if (result.status >= 500 && result.status !== 502) result.message = result.message || MESSAGE.NETWORK_ERR;
  return result;
};

const get = (url, params = {}, config = {}) => sendRequest({method: 'get', url, params, ...config});
const post = (url, params = {}, config = {}) => sendRequest({method: 'post', url, params, ...config});
const del = (url, params = {}, config = {}) => sendRequest({method: 'delete', url, params, ...config});
const put = (url, params = {}, config = {}) => sendRequest({method: 'put', url, params, ...config});

export {
  get,
  post,
  del,
  put
};
