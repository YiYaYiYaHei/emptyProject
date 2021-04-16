/* 引入接口请求公用方法 */
import API from '../api/common.js';
import Tool from "./tool.js";

/* 验证用户名是否唯一 */
let userName = async (rule, value, callback) => {
  if (rule.required && !value.trim()) {
    callback(new Error("请输入用户名"));
  } else if (!!value.trim()) {
    let result = await API.delDataRequest('VALIDATE_USERNAME', value, 'GET');
    if (!!result && result.status === 200 && result.data) {
      callback(new Error('该用户名已存在'));
    }
  }
  callback();
}

// 校验密码格式
let pwdFormat = (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error('密码不能为空'));
  } else if (value && !Tool.isValidPwd(value, {})) {
    callback(new Error('密码为6到16位的大小写字母、数字和特殊字符混合'));
  } else {
    callback();
  }
};

/* 验证密码与确认密码是否一致 */
let password = (rule, value, callback, oldPwd) => {
  if (rule.required && !value.trim()) {
    callback(new Error('请再次输入密码'));
  } else if (value && (value !== oldPwd)) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback();
  }
}

/* 验证端口 */
let port = (rule, value, callback) => {
  if (rule.required && !value && value !== 0) {
    callback(new Error('端口不能为空'));
  } else if (value || value === 0) {
    if (!Number.isInteger(value)) {
      callback(new Error('请输入整数值'));
    } else if (value < 1 || value > 65535) {
      callback(new Error('端口范围有误'));
    }
  }
  callback();
};

/* 验证ip */
let ip = (rule, value, callback) => {
  let typeText = rule.typeText || 'IP';
  if (rule.required && !value) {
    callback(new Error(`${typeText}不能为空`));
  } else if (value && !Tool.isIp(value)) {
    callback(new Error(`${typeText}格式有误`));
  } else {
    callback();
  }
};

/* 验证IP网段 */
let cidr = (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error('网段不能为空'));
  } else if (value && !Tool.isCidr(value)) {
    callback(new Error('网段格式有误，例如：192.168.33.0/32'));
  } else {
    callback();
  }
};

/* 验证域名 */
let domain = (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error('域名不能为空'));
  } else if (value && !Tool.isDomain(value)) {
    callback(new Error('域名格式有误'));
  } else {
    callback();
  }
};

/* 验证电话 */
let phone = (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error('电话不能为空'));
  } else if (value && !Tool.isPhone(value)) {
    callback(new Error('电话格式有误'));
  } else {
    callback();
  }
};

/* 验证HASH */
let hash = (rule, value, callback) => {
  if (rule.required && !value) {
    callback(new Error('HASH不能为空'));
  } else if (value && !Tool.isHash(value)) {
    callback(new Error('HASH格式有误'));
  } else {
    callback();
  }
};

/* 验证邮箱 */
let email = (rule, value, callback) => {
  let typeText = rule.typeText || '邮箱';
  if (rule.required && !value) {
    callback(new Error(typeText + '不能为空'));
  } else if (value && !Tool.isEmail(value)) {
    callback(new Error(typeText + '格式有误'));
  } else {
    callback();
  }
};

export default {
  userName,
  pwdFormat,
  password,
  port,
  ip,
  cidr,
  domain,
  phone,
  hash,
  email,
}
