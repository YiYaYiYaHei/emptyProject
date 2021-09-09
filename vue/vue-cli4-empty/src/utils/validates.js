import * as ToolsAll from '@/utils/tools';
const Tools = ToolsAll.default;
const Api = ToolsAll.getModules('apis');

/**
 * 表单验证前期工作 先验证是否是必填
 * @param {Object} rule - 表单项的相关属性
 * @param {String} [rule.field] - 表单项属性名
 * @param {Boolean} [rule.message] - 表单项输入错误后的提示语句
 * @param {Boolean} [rule.required] - 该表单项是否必填
 * @param {String} [rule.fieldType] - 表单项类型
 * @param {String} [rule.targetType] - 校验类型types方法使用
 * @param {String} [rule.newPwdRepeat] - 新密码，一般确认密码才需要这个参数
 * @param {Function|Null} [handlerCb = null] - 返回 除表单项是否必填验证后，其它后续验证工作过程中的错误信息
 */
const commonValidate = async (rule, value, callback, handlerCb) => {
  const isValueEmpty = value === 0 ? false : Tools.dataIsEmpty(value);
  // 非必填且无值 不继续验证
  if (!rule.required && isValueEmpty) {
    callback();
    return false;
  }
  // 必填且无值 提示为空，不继续验证
  if (rule.required && isValueEmpty) {
    const msg = rule.message ? rule.message : `请输入${rule.fieldType || rule.field}`;
    callback(new Error(msg));
    return false;
  }
  // 也可以不传handlerCb，但是这样需要每个校验方法都添加commonValidate返回值的判断
  const msg = handlerCb ? await handlerCb({rule, value}) : '';
  msg ? callback(new Error(msg)) : callback();
};

// 验证原密码是否正确
const oldPwd = (rule, value, callback) => commonValidate(rule, value, callback, async ({rule}) => {
  const passward = rule.encryValue();
  const result = await Api.login.checkOldPwd({passward});
  return result.status === 200 ? '' : result.message || '原密码不正确';
});

// 验证密码与确认密码是否一致
const password = (rule, value, callback) => commonValidate(rule, value, callback, ({rule, value}) => {
  const newPwdRepeat = rule.newPwdRepeat;
  const type = rule.fieldType || rule.field;
  const ERROR_MSG = {
    ILLEGAL: `${type}为8~20位大小写英文字母和数字（特殊字符可选）混合`,
    NOT_REPEAT: '确认密码和新密码不同',
    NOT_SAME: '两次输入密码不同'
  };
  if (!Tools.isValidPwd(value, false)) return ERROR_MSG.ILLEGAL;
  if (type === '确认密码' && value !== newPwdRepeat) return ERROR_MSG.NOT_REPEAT;
  if (type === '重复密码' && value !== newPwdRepeat) return ERROR_MSG.NOT_SAME;
});

// 用户名
const userName = (rule, value, callback) => commonValidate(rule, value, callback, async (value) => {
  if (rule.isEdit) return '';
  const result = await Api.login.checkUserName(value);
  if (!!result && result.status === 200 && result.data) return '该用户名已存在';
});

// 多类型校验
const types = (rule, value, callback) => commonValidate(rule, value, callback, ({value}) => {
  const type = rule.targetType;
  let msg = '';
  if (!type) msg = '请选择任务类型';
  const typesEnum = {
    域名: {key: 'isDomain', msg: '输入的域名格式有误'},
    IP: {key: 'isIp', msg: '输入的IP格式有误'},
    URL: {key: 'isUrl', msg: '输入的URL格式有误'},
    hash: {key: 'isHash', msg: '输入的样本HASH格式有误'},
    邮箱: {key: 'isEmail', msg: '输入的邮箱格式有误'},
    电话: {key: 'isPhone', msg: '输入的电话格式有误'}
  };
  const item = typesEnum[type];
  !Tools[item.key](value) && (msg = item.msg);
  return msg;
});

// 验证ip
const ip = (rule, value, callback) => { rule.targetType = 'IP'; types(rule, value, callback); };

// 验证域名
const domain = (rule, value, callback) => { rule.targetType = '域名'; types(rule, value, callback); };

// 验证电话
const phone = (rule, value, callback) => { rule.targetType = '电话'; types(rule, value, callback); };

// 验证hash
const hash = (rule, value, callback) => { rule.targetType = 'hash'; types(rule, value, callback); };

// 验证邮箱
const email = (rule, value, callback) => { rule.targetType = '邮箱'; types(rule, value, callback); };

// 验证端口
const port = (rule, value, callback) => commonValidate(rule, value, callback, ({value}) => {
  value = value * 1;
  return !Number.isInteger(value) ? '请输入整数值' : !Tools.isPort(value) ? '输入的端口范围有误' : '';
});

export default {
  oldPwd,
  password,
  userName,
  types,
  ip,
  domain,
  phone,
  hash,
  email,
  port
};
