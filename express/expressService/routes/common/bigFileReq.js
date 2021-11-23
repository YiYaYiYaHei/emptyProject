/*********************************************************************
 * 大文件下载、分片下载
 *********************************************************************/

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const common = require("../common/common");
const GLOBAL_CONFIG = require("../../global.config");

const getRange = (range) => {
  var match = /bytes=([0-9]*)-([0-9]*)/.exec(range);
  const requestRange = {};
  if (match) {
      if (match[1]) requestRange.start = Number(match[1]);
      if (match[2]) requestRange.end = Number(match[2]);
  }
  return requestRange;
}
module.exports = (app) => {
  // 大文件下载
  app.get('/big/download', async (req, res) => {
    try {
      // 获取文件路径
      let filePath = path.join(GLOBAL_CONFIG.ROOT_PATH, GLOBAL_CONFIG.SAVE_FILE_PATH + req.query.name);
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
      const readStream = fs.createReadStream(filePath);
      readStream.on('data', function(chunk) {
        if(!res.write(chunk)){
          readStream.pause();
        }
      });
      readStream.on('end', function() {
        res.end();
      });

      res.on("drain", function() {
        readStream.resume();
      });
    } catch (err) {
      common.sendData(res, {status: 201, message: err});
      return;
    }
  });

  function createFileResHeader(fileName, size) {
    return {
      // 告诉浏览器这是一个需要以附件形式下载的文件（浏览器下载的默认行为，前端可以从这个响应头中获取文件名：前端使用ajax请求下载的时候，后端若返回文件流，此时前端必须要设置文件名-主要是为了获取文件后缀，否则前端会默认为txt文件）
      'Content-Disposition': 'attachment; filename=' + encodeURIComponent(fileName),
      // 告诉浏览器是二进制文件，不要直接显示内容
      'Content-Type': 'application/octet-stream',
      // 下载文件大小（HEAD请求时，主要获取Content-Length）
      'Content-Length': size,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'X-Requested-With',
      'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
      //如果不暴露header，那就Refused to get unsafe header "Content-Disposition"
      "Access-Control-Expose-Headers":'Content-Disposition'
    }
  }
  // 大文件下载 - 分片下载  (head请求不会返回响应体)
  app.get('/slice/download', async (req, res) => {
    // 获取文件路径
    const fileName = req.query.name;
    let filePath = path.join(GLOBAL_CONFIG.ROOT_PATH, GLOBAL_CONFIG.SAVE_FILE_PATH + fileName);
    // 1、 判断文件是否存在
    try {
      fs.accessSync(filePath);
    } catch (error) {
      common.sendData(res, {status: 201, message: '下载的文件资源不存在'});
    }
    try {
      // 获取文件大小
      const size = fs.statSync(filePath).size;
      const range = req.headers['range'];
      const {start, end} = getRange(range);
      console.log('start, end', fileName, range, start, end);
      if (!range) {
        // 2、 head请求同时请求头中不带range字段，返回文件大小，前端根据文件大小去决定要分成几段
        res.writeHead(200, Object.assign({'Accept-Ranges': 'bytes'}, createFileResHeader(fileName, size)));
      } else {
        const resHeaderParams = {};
        // 3、检查请求范围
        if (start >= size || end >= size) {
          res.status = 416;
          resHeaderParams['Content-Range'] = `bytes */${size}`;
        } else {
          // 4、返回206：客户端表明自己只需要目标URL上的部分资源的时候返回的
          res.status = 206;
          resHeaderParams['Content-Range'] = `bytes ${start}-${end ? end : size - 1}/${size}`;
        }
        /**
         * 这里不能使用res.writeHead前端会报: xxx.net::ERR_CONTENT_LENGTH_MISMATCH 206 (Partial Content)（一个请求的时候正常，多个并发请求的时候就会报这个，原因暂时未知）
         * res.writeHead 和res.setHeader 啥区别，官网没有给出明确说明，https://blog.csdn.net/qq_45515863/article/details/103213937
         */
        // res.writeHead(res.status, Object.assign({'Accept-Ranges': 'bytes'}, createFileResHeader(fileName, size), resHeaderParams), 200);
        res.statusCode = 206;
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Range", `bytes ${start}-${end ? end : size - 1}/${size}`);
        res.setHeader("Content-Type", "application/octet-stream");
        /* res.setHeader("Content-Disposition", 'attachment; filename=' + encodeURIComponent(fileName));
        res.setHeader("Content-Type", "application/octet-stream"); */
      }
      // 5、返回部分文件
      fs.createReadStream(filePath, {start, end}).pipe(res);
    } catch (err) {
      common.sendData(res, {status: 201, message: err});
      return;
    }
  });
}