/* 引入接口请求公用方法 */
import API from '../api/common.js';
import Tool from "./tool.js";

/* 验证用户名是否唯一 */
let userName = async (rule, value, callback) => {
  if (rule.required) {
    if (!value) {
      callback(new Error("请输入用户名"));
    } else if (!!value.trim()) {
      let result = await API.getDataRequest('VALIDATE_USERNAME', {
        userName: value
      });
      if (!!result && result.status === 200 && result.data == 0) {
        callback(new Error(result.message));
      }
    }
  } else if (!!value.trim()) {
    let result = await API.getDataRequest('VALIDATE_USERNAME', {userName: value});
    if (!!result && result.status === 200 && result.data == 0) {
      callback(new Error(result.message));
    }
  }
  callback();
}

/* 验证密码与确认密码是否一致 */
let password = (rule, value, callback, oldPwd) => {
  if (rule.required) {
    if (!value.trim()) {
      callback(new Error('请再次输入密码'));
    }
    if (value !== oldPwd) {
      callback(new Error('两次输入的密码不一致'))
    }
  } else if (value) {
    if (value !== oldPwd) {
      callback(new Error('两次输入的密码不一致'))
    }
  }
  callback();
}

/* 验证端口 */
let port = (rule, value, callback) => {
  if (rule.required) {
    if (!value && value !== 0) {
      callback(new Error('端口不能为空'));
    } else if (!Number.isInteger(value)) {
      callback(new Error('请输入整数值'));
    } else if (value < 1 || value > 65535) {
      callback(new Error('端口范围有误'));
    }
  } else if (value) {
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
  if (rule.required) {
    if (!value) {
      callback(new Error(`${typeText}不能为空`));
    } else if (!Tool.isIp(value)) {
      callback(new Error(`${typeText}格式有误`));
    }
  } else if (value && !Tool.isIp(value)) {
    callback(new Error(`${typeText}格式有误`));
  }
  callback();
};

/* 验证IP网段 */
let cidr = (rule, value, callback) => {
  if (!value) {
    callback(new Error('网段不能为空'));
  } else if (!Tool.isCidr(value)) {
    callback(new Error('网段格式有误，例如：192.168.33.0/32'));
  } else {
    callback();
  }
};

/* 验证域名 */
let domain = (rule, value, callback) => {
  if (!value) {
    callback(new Error('域名不能为空'));
  } else if (!Tool.isDomain(value)) {
    callback(new Error('域名格式有误'));
  } else {
    callback();
  }
};

/* 验证电话 */
let phone = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (!Tool.isPhone(value)) {
    callback(new Error('电话格式有误'));
  } else {
    callback();
  }
};

/* 验证HASH */
let hash = (rule, value, callback) => {
  if (!value) {
    callback(new Error('HASH不能为空'));
  } else if (!Tool.isHash(value)) {
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
  password,
  port,
  ip,
  cidr,
  domain,
  phone,
  hash,
  email,
}
