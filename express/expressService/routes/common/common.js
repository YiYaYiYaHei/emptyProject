/*********************************************************************
 * 接口公用方法
 * 接口格式：{status: number, message: string, data: null | string | Object}
 * status约定：
 *   200 - 成功；
 *   201 - 请求参数/后台报错；
 *   500 - 数据库连接不上；
 * 列表data约定: {status: 200, message: '成功', data: {rows: [], total: 总条数}}
 *********************************************************************/

const log4 = require('../../logs/log4js');
const logger = log4.getLogger('info');
const loggerError = log4.getLogger('error');


const baseResponse = {
  status: 200,
  message: '成功',
  data: null
};

// 接口返回数据
const sendData = (res, data = {}) => {
  res.send(Object.assign({}, baseResponse, data));
};

// 列表接口返回数据格式
const sendListData = (result) => {
  let obj = null;
  if (result.hasOwnProperty('total')) {
    obj = {
      status: result.status,
      message: result.message || '',
      data: {
        total: result.total,
        rows: result.data || []
      }
    }
  } else {
    obj = {
      status: result.status,
      message: result.message || '',
      data: result.data
    }
  }
  return obj;
}

// 验证token是否存在（记录请求、错误日志）
const commonDeal = async (req, res, cb) => {
  // 验证header中是否有token
  if ((!req.headers.authorization || req.headers.authorization === 'null') && !req.url.startsWith('/login?_date')) {
    loggerError.error(`${req.method} -- 请求地址：${req.url}， 请求参数：${JSON.stringify(req.body || req.params)}，错误原因：hearder中无token`);
    sendData(res, {status: 500, message: 'token不存在'});
  } else {
    logger.info(`${req.method} -- 请求地址：${req.url}， 请求参数：${JSON.stringify(req.body || req.params)}`);
  }
  if (typeof cb === 'function') {
    const data = await cb();
    const msg = `${req.method} -- 地址：${req.url}， 响应：${JSON.stringify({status: data.status, message: data.message})}`;
    /401|201|500/g.test(data.status) ? loggerError.error(msg) : logger.info(msg);
    sendData(res, data);
  } else {
    sendData(res);
  }
};

module.exports = {
  baseResponse,
  sendData,
  sendListData,
  commonDeal
}