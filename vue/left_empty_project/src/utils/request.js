import axios from "axios";
import UrlConfig from "../config/url.config";
import Tool from "./tool.js";

const TIMEOUT_TIME = 60 * 60 * 1000;

/**
 * 获取请求地址
 * @param url 请求地址
 * @param params 需要替换地址中的数据对象
 * @returns {string} 返回完整请求地址
 */
const getUrl = (url, params, urlPrefix = 'BASE_URL') => {
  url = !!url ? url.replace(/{(\w+)}/g, (reg, key) => params[key]) : '';
  return `${UrlConfig[urlPrefix]}${url}`;
};

/**
 * 构建请求参数
 * @param data 请求参数对象
 * @returns {AxiosRequestConfig} 返回请求对象
 */
const buildRequestData = (data) => {
  let result = {};

  result.method = data.method ? data.method : "GET";
  result.params = data.params || {};
  result.data = data.data || {};

  /* 如果有上传进度接口 */
  if (!!data.onUploadProgress) {
    result.onUploadProgress = data.onUploadProgress;
  }

  /* 设置全局请求的token */
  let token = localStorage.getItem('current_login_user_token') || '';
  if (result.method === "POST" || result.method === "PUT") {

    /* 设置请求头文档类型 */
    result.headers = {
      "Content-Type": data.contentType ? data.contentType : "application/json;charset=utf-8",
      "Authorization": token,
    };

    /* form提交 */
    result.transformRequest = (requestData) => {
      if (data.contentType && data.contentType.indexOf("application/x-www-form-urlencoded") !== -1) {
        let str = "";

        for (let key in requestData) {
          if (requestData.hasOwnProperty(key)) {
            str += `${key}=${requestData[key]}&`;
          }
        }
        return encodeURI(str.slice(0, str.length - 1));
      } else if (!!data.onUploadProgress) {
        let form = new FormData();
        for (let key in requestData) {
          if (requestData.hasOwnProperty(key)) {
            let files = requestData[key];
            /* 判断是否是文件流 */
            if (!!files && files.constructor === FileList) {
              for (let i = 0; i < files.length; i++) {
                form.append(key, files[i]);
              }
            } else {
              form.append(key, files);
            }
          }
        }
        return form;
      } else {
        return JSON.stringify(requestData);
      }
    };
  } else {
    result.headers = {
      "Authorization": token
    };
  }

  /* 设置超时 */
  result.timeout = TIMEOUT_TIME;
  return result;
};


/**
 * Ajax 请求方法
 * @param request 请求参数
 * @param flag    标识符，用来判断是否为线路故障诊断
 */
const sendRequest = async(request, urlPrefix) => {
  let url = /^(http|https):/g.test(request.url) ? request.url : getUrl(request.url, request.urlParam, urlPrefix),
    requestData = buildRequestData(request);

  /* 针对IE浏览器，避免code304读取缓存 */
  requestData.url = url + '?_date=' + new Date().getTime();


  /* axios 发起请求 */
  let result = await axios(requestData).catch(e => {
    return {
	    data: {
		    message: e.response.data || '',
		    status: e.response.status || 500,
		    statusText: e.response.statusText || ''
	    }
    };
  });
  if (!!result) {
    result.data.message = Tool.isEnglish(result.data.message) ? result.data.message : '哎哟,出问题啦,刷新界面试试！';
	  if (result.data.status >= 500) {
		  result.data.message = '哎哟,出问题啦,刷新界面试试！';
	  }
	  if (result.data.status === 401) {
		  location.pathname !== '/login' && (result.data.message = '凭证失效，请重新登录');
		  localStorage.clear();
		  store.commit('mutationResetStore');
		  router.push('/login');
	  }
	  return result.data;
  }
};

export default sendRequest;
