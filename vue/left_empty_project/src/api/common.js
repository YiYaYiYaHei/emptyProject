import Ajax from "../utils/request";
import UrlConfig from "../config/url.config";

/**
 * 以params方式提交数据
 * @param      method              请求方法
 * @param      key                 请求定义静态地址
 * @param      params              请求参数
 * @param      urlPrefix           接口前缀:类似BASE_URL
 * @return     {Promise<*>}        返回promise对象
 */
let getDataRequest = (key, params, urlPrefix, method = 'GET') => {
  return Ajax({
    method: method,
    url: UrlConfig[key],
    params
  }, urlPrefix);
};

/**
 * 以data方式提交数据
 * @param      method              请求方法
 * @param      key                 请求定义静态地址
 * @param      data                请求参数
 * @param      urlPrefix           接口前缀:类似BASE_URL
 * @return     {Promise<*>}        返回promise对象
 */
let postDataRequest = (key, data, urlPrefix, method = 'POST') => {
  return Ajax({
    method: method,
    url: UrlConfig[key],
    data
  }, urlPrefix);
};

/**
 *  /user/delete/{id}格式
 * @param      key                 请求定义静态地址
 * @param      params                请求参数
 * @param      urlPrefix           接口前缀:类似BASE_URL
 * @param      method              请求方法
 * @return     {Promise<*>}        返回promise对象
 */
let delDataRequest = (key, params, method, urlPrefix) => {
  return Ajax({
    method: method,
    url: `${UrlConfig[key]}/${params}`
  }, urlPrefix);
};


/**
 * 通过FormData以post方式提交文件并获取文件上传进度
 * @param      key                 请求定义静态地址
 * @param      data                请求参数
 * @param      onUploadProgress    文件上传进度的回掉函数，可以获取到文件总大小，和当前文件已上传的大小；用于在页面上展示文件上传百分比
 * @param      urlPrefix           接口前缀:类似BASE_URL
 * @return     {Promise<*>}        返回promise对象
 */
let postFileRequest = (key, data, onUploadProgress, urlPrefix) => {
  return Ajax({
    method: 'POST',
    url: UrlConfig[key],
    data,
    onUploadProgress
  }, urlPrefix);
};


/**
 * 返回一个完整请求地址
 * @param      key                 请求定义静态地址
 * @param      flag                是否是完整请求地址
 * @param      urlPrefix           接口前缀:类似BASE_URL
 */
let getFullUrl = (key, flag, urlPrefix = 'BASE_URL') => {
  if (!flag) return `${UrlConfig[urlPrefix]}${UrlConfig[key]}`;
  return `${UrlConfig[key]}`;
};

export default {
  getDataRequest,
  postDataRequest,
  delDataRequest,
  postFileRequest,
  getFullUrl
};
