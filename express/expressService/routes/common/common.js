/*********************************************************************
 * 接口公用方法
 * 接口格式：{status: number, message: string, data: null | string | Object}
 * status约定：
 *   200 - 成功；
 *   201 - 请求参数/后台报错；
 *   500 - 数据库连接不上；
 * 列表data约定: {status: 200, message: '成功', data: {rows: [], total: 总条数}}
 *********************************************************************/

// 接口返回数据
const sendData = (res, data = {}) => {
  res.send({
    status: data.status || 200,
    message: data.message || '成功',
    data: data.data
  })
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

module.exports = {
  sendData,
  sendListData
}