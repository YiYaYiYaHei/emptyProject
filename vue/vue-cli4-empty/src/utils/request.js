// 默认导出axios实列，若需要访问多个服务器且这些服务的请求和响应的结构完全不同，此时可以使用axios.create创建不同的实列来处理
import axios from 'axios';
import {Message} from 'element-ui';
import store from '@/store';
import Tools from '@/utils/tools.js';

const TIME_OUT = 60 * 1000;
const MESSAGE = {
  NETWORK_ERR: '哎哟,出问题啦,刷新界面试试！',
  PERMISSION_DENIED: '凭证失效，请重新登录',
  NETWORK_REFUSE: '服务器拒绝连接或连接超时'
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
const buildRequestHeaders = (requestConfig) => {
  const token = localStorage.getItem('token');
  const contentType = requestConfig.onUploadProgress ? 'multipart/form-data' : (['post', 'put'].includes(requestConfig.method) ? 'application/x-www-form-urlencoded' : 'application/json;charset=utf-8');
  requestConfig.contentType = requestConfig.contentType || contentType;
  return {
    // config中无data字段时，headers里的Content-Type无效果，这应该出于优化的层面，此时的Content-Length=0，无需向服务端提供Content-Type字段（Content-Type会设置不成功）
    'Content-Type': requestConfig.contentType,
    Authorization: token
  };
};

const buildRequestConfig = (requestConfig) => {
  const config = {};
  // axios.transformRequest对于 'PUT', 'POST' 和 'PATCH' 方法，ContentType会自动设置为'application/x-www-form-urlencoded'或者'multipart/form-data'
  config.headers = buildRequestHeaders(requestConfig);
  config.url = Tools.getFullUrl(requestConfig.url, requestConfig.urlPrefix);
  config.method = requestConfig.method;
  config[/get|delete/.test(config.method) ? 'params' : 'data'] = Tools.transformRequestData(requestConfig.contentType, requestConfig.params);
  config.timeout = TIME_OUT;

  // 文件上传进度，也可以设置文件下载进度，但是我就想用原生ajax的进度
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
  // token失效
  if (result.status === 401) {
    result.message = MESSAGE.PERMISSION_DENIED;
    Message.error(result.message);
    localStorage.clear();
    store.dispatch('resetStore');
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
