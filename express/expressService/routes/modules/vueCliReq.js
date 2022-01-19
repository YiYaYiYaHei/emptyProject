/*********************************************************************
 * vue-cli4-empty框架接口
 *********************************************************************/

const crypto = require("crypto");
const common = require("../common/common");

// createCipheriv - key(32位随机)
const tokenKey = 'abcdefg123456higklmn123456789opk';
// createCipheriv - iv(16位随机)
const tokenIv = 'rstuvwxyz1234567';
// 生成token -- 对称加密
function createToken(userName) {
  // createCipheriv  key的长度取决于加密类型，这里用的aes-256-cbc所以得是32位(aes-128-cbc对应16位), iv始终16位
  const cipher = crypto.createCipheriv('aes-256-cbc', tokenKey, tokenIv);
  let crypted = cipher.update(JSON.stringify({userName, time: Date.now()}), "utf8", "base64");
  crypted += cipher.final("base64");
  return crypted;
}
// 解token
function decryptToken(req) {
  const token = req.headers.authorization.slice(7);
  const cipher = crypto.createDecipheriv('aes-256-cbc', tokenKey, tokenIv);
  let decrypted = cipher.update(token, "base64", "utf8");
  decrypted += cipher.final("utf8");
  return decrypted;
}

module.exports = app => {
  // 用户登录
  app.post('/login', (req, res) => common.commonDeal(req, res, () => {
    console.log(req.body)
    const role = req.body.userName === 'admin' ? '管理员' : '普通用户';
    const data = {
      // 使用crypto.createHash('sha256').update(req.body.userName).digest('hex')，无法解密，因为hash是单向的
      token: createToken(req.body.userName),
      role,
      userId: parseInt(Math.random() * 100)
    }
    return {data};
  }));
  // 用户退出
  app.get('/logout', (req, res) => common.commonDeal(req, res));
  // 修改密码 -- 校验旧密码是否正确
  app.post('/checkOldPwd', (req, res) => common.commonDeal(req, res, () => {
    const date = Date.now();
    const flag = date % 2 === 0;
    return {status: flag ? 201 : 200, data: flag, message: flag ? '旧密码错误' : ''};
  }));
  // 修改密码 -- 验证用户名是否存在
  app.post('/checkUserName', (req, res) => common.commonDeal(req, res));
  // 商品创建 - 表格数据
  app.post('/table/list', (req, res) => common.commonDeal(req, res, () => {
    const length = parseInt(Math.random() * 200);
    const rows = [];
    for(let i = 0; i < length; i++) {
      rows.push({
        lastOrderTime: +new Date(),
        userName: i % 5 === 1 ? '张三' : i % 5 === 2 ? '李四' : i % 5 === 3 ? '隔壁王五' : i % 5 === 4 ? '老李头' : '<script></script>小王头',
        orderTotal: parseInt(Math.random() * 100000),
        orderUnfinished: parseInt(Math.random() * 10000),
        orderFinished: parseInt(Math.random() * 1000),
        purchaseType: i % 2 === 0 ? '衣物' : '电器',
        purchaseTotal: parseInt(Math.random() * 100),
        isVip: i % 2 === 0 ? true : false,
        description: '客户的描述' + i
      });
    };
    return {data: {rows, total: length}};
  }));
  // 商品创建 - 表格行展开数据
  app.post('/table/detail', (req, res) => common.commonDeal(req, res, () => {
    const flag = +new Date();
    return {data: {
      lastOrderTime: +new Date(),
      userName: '张三',
      orderTotal: parseInt(Math.random() * 100000),
      orderUnfinished: parseInt(Math.random() * 10000),
      orderFinished: parseInt(Math.random() * 1000),
      purchaseType: flag ? '衣物' : '电器',
      purchaseTotal: parseInt(Math.random() * 100),
      isVip: flag ? true : false,
      description: '客户的描述客户的描述客户的描述客户的描述客户的描述客户的描述客户的描述'
    }};
  }));
  // 首页 - 饼状图
  app.post('/chart/pie', (req, res) => common.commonDeal(req, res, () => {
    return {data: [
      {value: 196, name: "电脑数码"},
      {value: 234, name: "日用百货"},
      {value: 125, name: "个护清洁"},
      {value: 316, name: "图书影像"},
      {value: 63, name: "家具厨具"}
    ]};
  }));
  // 首页 - 折线图
  app.post('/chart/line', (req, res) => common.commonDeal(req, res, () => {
    return {data: [
      {value: 196, name: "电脑数码"},
      {value: 234, name: "日用百货"},
      {value: 125, name: "个护清洁"},
      {value: 316, name: "图书影像"},
      {value: 63, name: "家具厨具"}
    ]};
  }));
  // 首页 - 柱状图
  app.post('/chart/bar', (req, res) => common.commonDeal(req, res, () => {
    return {data: [
      {value: 196, name: "电脑数码"},
      {value: 234, name: "日用百货"},
      {value: 125, name: "个护清洁"},
      {value: 316, name: "图书影像"},
      {value: 63, name: "家具厨具"}
    ]};
  }));
  // 首页 - 地图
  app.post('/chart/map', (req, res) => common.commonDeal(req, res, () => {
    return {data: [
      {value: 196, name: "新疆"},
      {value: 234, name: "四川"},
      {value: 125, name: "内蒙古"},
      {value: 316, name: "广东"},
      {value: 63, name: "湖北"},
      {value: 63, name: "黑龙江"}
    ]};
  }));
  // 刷新token
  app.get('/auth/refresh', (req, res) => common.commonDeal(req, res, () => {
    const userName = (decryptToken(req) || {userName: 'null'}).userName;
    return {data: createToken(userName)};
  }));

  // 系统管理-用户管理 - 表格数据
  app.post('/user/table/list', (req, res) => common.commonDeal(req, res, () => {
    const length = parseInt(Math.random() * 200);
    const rows = [];
    for(let i = 0; i < length; i++) {
      rows.push({
        createdTime: +new Date(),
        userName: (i % 5 === 1 ? '张三' : i % 5 === 2 ? '李四' : i % 5 === 3 ? '隔壁王五' : i % 5 === 4 ? '老李头' : '小王头') + i,
        role: i % 2 === 0 ? '管理员' : '普通用户',
        describe: '用户的描述' + i,
        id: i
      });
    };
    return {data: {rows, total: length}};
  }));
  // 系统管理-用户管理 - 删除用户   接口/user/delete/30   获取id: req.params.id
  app.delete('/user/delete/:id', (req, res) => common.commonDeal(req, res));
  // 系统管理-用户管理 - 新增/删除用户
  app.post('/user/addOrEdit', (req, res) => common.commonDeal(req, res));
  // 系统管理-系统日志 - 表格数据
  app.post('/system/log', (req, res) => common.commonDeal(req, res, () => {
    const length = parseInt(Math.random() * 200);
    const rows = [];
    for(let i = 0; i < length; i++) {
      rows.push({
        createdTime: +new Date(),
        name: '日志名称' + i,
        userName: (i % 5 === 1 ? '张三' : i % 5 === 2 ? '李四' : i % 5 === 3 ? '隔壁王五' : i % 5 === 4 ? '老李头' : '小王头') + i,
        path: '/user/operator/log',
        id: i
      });
    };
    return {data: {rows, total: length}};
  }));
  // 递归树接口
  app.get('/tree/list', (req, res) => common.commonDeal(req, res, () => {
    const treeList = [
      {fileName: '/', fileId: '/', codeLevel: 0, isDelete: 0, isFile: false, isVirus: 0, children: [
        {fileName: 'usr', fileId: '/usr', codeLevel: 0, isDelete: 0, isFile: false, isVirus: 0, children: [
          {fileName: 'local', fileId: '/usr/local', codeLevel: 0, isDelete: 0, isFile: false, isVirus: 0, children: [
            {fileName: 'applicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.confapplicaiton.conf', fileId: '/usr/local/applicaiton.conf', codeLevel: 0, isDelete: 0, isFile: true, isVirus: 0},
            {fileName: 'ffas-web.jar', fileId: '/usr/local/ffas-web.jar', codeLevel: 1, isDelete: 0, isFile: true, isVirus: 0}
          ]}
        ]},
        {fileName: 'root', fileId: '/root', codeLevel: 0, isDelete: 0, isFile: false, isVirus: 0, children: [
          {fileName: 'winhex.sh', fileId: '/root/winhex.sh', codeLevel: 3, isDelete: 0, isFile: true, isVirus: 1, children: []}
        ]},
        {fileName: 'opt', fileId: '/opt', codeLevel: 0, isDelete: 0, isFile: false, isVirus: 0, children: [
          {fileName: 'index.html', fileId: '/opt/index.html', codeLevel: 2, isDelete: 0, isFile: true, isVirus: 0, children: []}
        ]},
        {fileName: 'etc', fileId: '/etc', codeLevel: 0, isDelete: 0, isFile: false, isVirus: 0, children: [
          {fileName: 'centos', fileId: '/etc/centos', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0},
          {fileName: 'centos7.row', fileId: '/etc/centos7.row', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
            {fileName: 'centos7.row1', fileId: '/etc/centos7.row1', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
              {fileName: 'centos7.row2', fileId: '/etc/centos7.row2', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
                {fileName: 'centos7.row3', fileId: '/etc/centos7.row3', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
                  {fileName: 'centos7.row4', fileId: '/etc/centos7.row4', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
                    {fileName: 'centos7.row5', fileId: '/etc/centos7.row5', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
                      {fileName: 'centos7.row6', fileId: '/etc/centos7.row6', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
                        {fileName: 'centos7.row7', fileId: '/etc/centos7.row7', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0, children: [
                          {fileName: 'centos7.row8', fileId: '/etc/centos7.row8', codeLevel: 0, isDelete: 1, isFile: true, isVirus: 0, children: []}
                        ]}
                      ]}
                    ]}
                  ]}
                ]},
                {fileName: 'centos7.row22', fileId: '/etc/centos7.row22', codeLevel: 0, isDelete: 1, isFile: false, isVirus: 0}
              ]}
            ]}
          ]}
        ]}
      ]},
      {fileName: '111.doc', fileId: '/111.doc', codeLevel: 0, isDelete: 0, isFile: true, isVirus: 1, children: []},
      {fileName: 'ma.sh', fileId: '/ma.sh', codeLevel: 0, isDelete: 0, isFile: true, isVirus: 1, children: []},
      {fileName: 'et', fileId: 'et', codeLevel: 0, isDelete: 0, isFile: true, isVirus: 1, children: []}
    ];
    return {data: treeList};
  }));
};