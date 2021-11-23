/*********************************************************************
 * 文件上传、下载
 *********************************************************************/

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const common = require("../common/common");
const GLOBAL_CONFIG = require("../../global.config");

module.exports = (app) => {
  // 文件上传
  app.post('/upload', async (req, res) => {
    var form = new formidable.IncomingForm();                 // 创建上传表单
      form.encoding = 'utf-8';                                // 设置编辑
      form.uploadDir = GLOBAL_CONFIG.SAVE_FILE_PATH;          // 设置上传目录
      form.keepExtensions = true;                             // 保留后缀
      form.maxFieldsSize = 2 * 1024 * 1024;                   // 文件大小（默认20M）

    form.parse(req, function(err, fields, files) {
      if (err) {
        common.sendData(res, {status: 201, message: err});
        return;
      };
      try {
        // 若文件流的键名为uplaodFile，则fileName = files.uplaodFile.name
        const fileKey = 'file';
        const fileName = files[fileKey].originalFilename;
        const filePath = files[fileKey].filepath;

        // 对文件名进行处理，以应对上传同名文件的情况
        const pointIndex = fileName.lastIndexOf('.');
        if (pointIndex === -1) {
          common.sendData(res, {status: 201, message: '请上传带有后缀名的文件'});
          return;
        }
        const name = fileName.slice(0, pointIndex);
        const fileType = fileName.slice(pointIndex);
        var timeStamp = +new Date();
        var avatarName = `${name}_${timeStamp}88888${fileType}`;

        var newPath = form.uploadDir + avatarName;
        // 重命名 - 若文件流的键名为uplaodFile，则fs.renameSync(files.uplaodFile.filePath, newPath)
        fs.renameSync(filePath, newPath);
        common.sendData(res, {status: 200, message: '文件上传成功'});
      } catch (err) {
        common.sendData(res, {status: 201, message: err});
        return;
      }
    });
  });

  // 文件下载
  app.get('/download', async (req, res) => {
    try {
      // 获取文件路径
      let filePath = path.join(GLOBAL_CONFIG.ROOT_PATH, GLOBAL_CONFIG.SAVE_FILE_PATH + req.query.name);
      // fs.readFile 和 fs.writeFile有内存限制问题，下载大文件时，会提示"ERR_FS_FILE_TOO_LARGE"，因此大文件采用createReadStream
      fs.readFile(filePath, (err, data) => {
        if (err) {
          common.sendData(res, {status: 201, message: '文件不存在'});
          return;
        }
        // 获取文件大小
        const size = fs.statSync(filePath).size;
        res.writeHead(200, {
          // 告诉浏览器这是一个需要以附件形式下载的文件（浏览器下载的默认行为，前端可以从这个响应头中获取文件名：前端使用ajax请求下载的时候，后端若返回文件流，此时前端必须要设置文件名-主要是为了获取文件后缀，否则前端会默认为txt文件）
          'Content-Disposition': 'attachment; filename=' + encodeURIComponent(req.query.name),
          // 告诉浏览器是二进制文件，不要直接显示内容
          'Content-Type': 'application/octet-stream',
          // 下载文件大小
          'Content-Length': size,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'X-Requested-With',
          'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
          //如果不暴露header，那就Refused to get unsafe header "Content-Disposition"
          "Access-Control-Expose-Headers":'Content-Disposition'
        });
        fs.createReadStream(filePath).pipe(res);
      })
    } catch (err) {
      common.sendData(res, {status: 201, message: '未知错误'});
      return;
    }
  })
}