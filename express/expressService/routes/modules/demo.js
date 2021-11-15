
const common = require("../common/common");
const dbFunc = require("../db/mysql_db_conf");

module.exports = app => {
  app.get('/list', async (req, res) => {
    console.log('================ mysql数据库连接接口示例 start================');
    let find_res = await dbFunc.findFunc('goods', {limit: `0, 10`}).catch(e => {
      common.sendData(res, e);
      return;
    });
    if (find_res.status === 200) {
      common.sendData(res, common.sendListData(find_res));
    } else {
      common.sendData(res, find_res);
    }
    console.log('================ mysql数据库连接接口示例 end================');
  });

  // 接口/delete/30   获取id: req.params.id
  app.delete('/delete/:id', async (req, res) => {
    console.log('================ 普通接口示例 start================');
    common.sendData(res);
    console.log('================ 普通接口示例 end================');
  });
};