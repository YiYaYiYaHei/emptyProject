/*********************************************************************
 * 数据库操作-mysql
 * 1、npm i mysql
 * 2、安装mysql数据库--https://blog.csdn.net/bobo553443/article/details/81383194（安装时，需和图片对应，该勾选的勾选）
 * 3、安装navicat小绿叶--https://www.cnblogs.com/yinfei/p/11427259.html
 * 4、配置mysql环境变量
 *    https://www.php.cn/mysql-tutorials-419508.html
 *    https://www.cnblogs.com/wenm1128/p/13161818.html
 *    https://zhidao.baidu.com/question/560766637.html
 *
 * 注意：
 * 1、字符串类型的字段：若未用引号包裹，需手动添加引号，即使类型是字符串类型
 *********************************************************************/

const mysql = require('mysql');

// 字符串类型，添加引号
function transStr(data) {
  let value = data;
  if (typeof data === 'string') {
    value = data.replace(/'/g, "\"");
    !value.startsWith("\"") && (value = "\"" + value);
    !value.endsWith("\"") && (value = value + "\"");
  }
  return value;
}

/**
* createConnection：数据库连接-容易造成重复连接而报错
* createPool：数据库连接池，可对数据库连接做统一管理（有连接上限限制,默认100）
*/
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: '3306',
  database: 'wx_ShoppingMall',
  connectionLimit: 2, //连接池最多可以创建连接数
  queueLimit: 0 // 队伍中等待连接的最大数量，0为不限制。
});

// 连接数据库--每次请求接口都应该判断数据库是否连接成功
const connectFunc = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if(err) {
        console.log('数据库连接失败', err);
        reject({status: 500, message: '数据库连接失败'});
        return;
      }
      console.log('数据库连接成功');
      /**
      * 连接池有数量限制，当达到连接上线后，会导致pool.getConnection直接卡死没有任何的回调，
      * 所以需调用pool.releaseConnection释放
      * https://blog.csdn.net/JavaFance/article/details/81437729#commentBox
      */
      pool.releaseConnection(connection);
      resolve({status: 200, database: connection});
    });
  })
}

// 数据库操作--增、删、改、查   (db.query是异步，所以用Promise)
const opratorDB = (db, sql) => {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      console.log('**************sql****************:', sql);
      if(!!err) {
        console.log('*********dbData_ERR*********:', err);
        reject({status: 500, message: err.message || '数据库操作失败'});
        return;
      }
      resolve({status: 200, message: '数据库操作成功', dbData: result});
    });
  });
}

// 插入-获取数据表列、值
const getTableData = (data) => {
  let tableColumn = [],
      tabelData = [],
      _tableData = '';
  if(data.constructor ===  Object) {
    for (let key in data) {
      tableColumn.push(key);
      tabelData.push(transStr(data[key]) || null);
    }
    _tableData = `(${tabelData.join()})`;
  }
  if(data.constructor ===  Array) {
    for (let item of data) {
      for (let key in item) {
        !tableColumn.find(it => it === key) && tableColumn.push(key);
      }
    }
    for (let item of data) {
      let _data = [];
      for (let key of tableColumn) {
        _data.push(transStr(item[key]) || null);
      }
      tabelData.push(`(${_data.join()})`);
    }
    _tableData = `${tabelData.join()}`;
  }
  return {tableColumn: tableColumn.join(), tabelData: _tableData};
}

// 插入一条/多条数据
const insertFunc = (tableName, data) => {
  return new Promise(async (resolve, reject) => {
    if(!tableName) {
      reject({status: 201, message: '表名不能为空'});
      return;
    }
    if(!data) {
      reject({status: 201, message: '数据不能为空'});
      return;
    }

    let result = await connectFunc().catch(e => {
      reject(e);
    });

    let _data = getTableData(data);
    let tableColumn = _data.tableColumn,
        tabelData = _data.tabelData;

    let db = result.database;
    // INSERT INTO user(token,uId,sessionKey,openId) VALUES (1,2,'KHkW/ujEPHUMFJfots9CuQ==','oz-FM46oLkyJ8H88Tf8EXtXowKy4'),(1,2,'KHkW/ujEPHUMFJfots9CuQ==','oz-FM46oLkyJ8H88Tf8EXtXowKy4')
    let sql = `INSERT INTO ${tableName}(${tableColumn}) VALUES ${tabelData}`;
    opratorDB(db, sql).then((res) => {
      const resData = {
        status: res.status,
        message: '插入成功'
      }
      resolve(resData);
    }).catch(e => {
      reject(e);
    });
  })
}

// 获取数据库中符合条件的记录总数
const getTotal = (tableName, column = '*', db, where) => {
  return new Promise(async (resolve, reject) => {
    if(!tableName) {
      reject({status: 201, message: '表名不能为空'});
      return;
    }

    if (!db) {
      let result = await connectFunc().catch(e => {
        reject(e);
      });
      db = result.database;
    }
    // 'SELECT COUNT(*) as total FROM user' WHERE openId="asdad";
    let sql = `SELECT COUNT(${column}) as total FROM ${tableName}${where ? ' WHERE ' + where : ''}`;
    opratorDB(db, sql).then((res) => {
      const resData = {
        status: res.status,
        message: '查询总数成功',
        total: res.dbData[0].total
      }
      resolve(resData);
    }).catch(e => {
      reject(e);
    });
  })
}

/**
* 查  data: {column: '查询列', where: '筛选条件', orderBy: '排序', limit: '分页', isGetTotal: true}
* WHERE runoob_author='菜鸟教程'
* WHERE runoob_author LIKE "%COM%"
* ORDER BY submission_date ASC (ASC-升， DESC-降)
* 分页：limit (pageNo-1)*pageSize, pageSize;  ----  第一个参数(pageNo-1)*pageSize是从哪开始查，第二个参数pageSize是查询个数
*/
const findFunc = (tableName, data) => {
  return new Promise(async (resolve, reject) => {
    if(!tableName) {
      reject({status: 201, message: '表名不能为空'});
      return;
    }

    let result = await connectFunc().catch(e => {
      reject(e);
    });

    let db = result.database;
    let total = 0;
    // 分页，获取记录总数
    if (data.isGetTotal) {
      const total_res = await getTotal(tableName, '*', db, data.where);
      if (total_res.status === 200) {
        total = total_res.total;
      } else {
        reject(total_res);
      }
    }

    let sql = `SELECT ${data.column || '*'} from ${tableName}${data.where ? ' WHERE ' + data.where : ' '}${data.orderBy ? ' ORDER BY ' + data.orderBy : ' '}${data.limit ? ' limit ' + data.limit : ''}`;
    opratorDB(db, sql).then((res) => {
      const resData = {
        status: res.status,
        message: '查询成功',
        data: data.isGetTotal ? {total: total, row: res.dbData} : res.dbData
      };
      resolve(resData);
    }).catch(e => {
      reject(e);
    });

  })
}

// 改   data: {data: 更新的数据, where: '更新条件'}
const updateFunc = (tableName, data) => {
  return new Promise(async (resolve, reject) => {
    if(!tableName) {
      reject({status: 201, message: '表名不能为空'});
      return;
    }
    if(!data) {
      reject({status: 201, message: '数据不能为空'});
      return;
    }
    if (!data.data || (data.data && !Object.keys(data.data).length)) {
      reject({status: 201, message: '更新数据不能为空'});
      return;
    }
    if (!data.where) {
      reject({status: 201, message: '更新条件不能为空'});
      return;
    }

    let result = await connectFunc().catch(e => {
      reject(e);
    });

    let tableData = [];
    for (let key in data.data) {
      tableData.push(key + '=' + transStr(data.data[key]));
    }
    let db = result.database;
    // UPDATE runoob_tbl SET runoob_title="学习 Python",runoob_title1="学习 Python" WHERE runoob_id=3
    let sql = `UPDATE ${tableName} SET ${tableData.join()} WHERE ${data.where}`;
    opratorDB(db, sql).then((res) => {
      const resData = {
        status: res.status,
        message: '更新成功'
      }
      resolve(resData);
    }).catch(e => {
      reject(e);
    });
  })
}


module.exports = {
  insertFunc,
  findFunc,
  updateFunc
}