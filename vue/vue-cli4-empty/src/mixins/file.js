export default {
  data() {
    return {
      uploadFileMsg: '等待上传中...',
      downloadFileMsg: '等待下载中...'
    };
  },
  methods: {
    /**
     * 使用input标签属性上传文件
     * @param {Function} cb - 回调函数
     * @param {Boolean} [isMultiple] - 是否多文件上传
     * @param {String} [acceptType] - 接受的文件类型
     */
    fileUploadNode(cb, isMultiple = false, acceptType = '') {
      const input = document.createElement('input');
      input.style = 'display: block; width: 0; height: 0; padding: 0; border: 0;';
      input.setAttribute('type', 'file');
      input.setAttribute('name', 'file');
      isMultiple && input.setAttribute('multiple', isMultiple);
      acceptType && input.setAttribute('accept', acceptType);
      document.body.appendChild(input);

      input.addEventListener('change', (e) => {
        const files = e.target.files;
        cb(files);
        setTimeout(() => {
          document.body.removeChild(input);
        });
      });

      // 需要主动调用click事件，才能弹出文件选择框
      input.click();
    },
    /**
     * 上传文件
     * @param {String} urlFunc - 上传文件的接口路径（apis里定义的方法）
     * @param {Object|null} [params] - 接口参数（除文件流参数）
     * @param {Object} [config] - 方法配置
     * @example this.uploadFile(this.$apis.login.fileUpload, {userName: 'addd'}, {acceptType: '.zip,.rar', acceptTypeErrMsg: '限.zip,.rar', limitSize: 30000 * 1024})"
     */
    uploadFile(urlFunc, params, config) {
      const _config = Object.assign({
        isMultiple: true,           // 是否多文件上传
        acceptType: '',             // 文件类型[String] eg: image/*  、'.zip,.rar'
        acceptTypeErrMsg: '',       // 文件类型错误提示语
        limitSize: 0,               // 文件限制大小(单位字节) 1KB=1024B
        successMsg: '文件上传成功',  // 文件上传成功提示语
        successCb: null,            // 成功的回调
        paramsFileKey: 'file',      // 上传参数-文件key
        urlPrefix: 'BASE_URL',      // 地址前缀（防止多台服务器时，请求前缀不同）
        hasProgress: true             // 是否有notify提示
      }, config);
      this.fileUploadNode(async (files) => {
        // 检测文件大小
        let limitSizeFlag = true;
        _config.limitSize && (limitSizeFlag = this.$tools.checkFileSize(files, _config.limitSize));
        if (!limitSizeFlag) {
          this.$message.warning(`只能上传${this.$tools.formatByteSize(_config.limitSize)}的文件`);
          return;
        }

        // 检测文件类型
        let acceptTypeFlag = true;
        _config.acceptType && (acceptTypeFlag = this.$tools.checkFileType(files, _config.acceptType));
        if (!acceptTypeFlag) {
          _config.acceptTypeErrMsg && this.$message.error(_config.acceptTypeErrMsg);
          return;
        }

        // 请求参数
        const _params = Object.assign({
          [_config.paramsFileKey]: _config.isMultiple ? files : files[0]
        }, params);

        const notify = _config.hasProgress ? this.createNotify(this.uploadFileMsg) : false;
        const requestConfig = {
          // 获取上传文件进度
          onUploadProgress: progress => {
            const percentage = ((progress.loaded / progress.total) * 100).toFixed(2);
            this.uploadFileMsg = (progress.loaded === progress.total) ? '正在上传中，请稍后...' : `上传进度 ${percentage}%...`;
            // 设置notify的msg
            notify && (notify.message = this.notifyMessage(this.uploadFileMsg, percentage));
          },
          urlPrefix: _config.urlPrefix
        };
        // axios请求
        const result = await urlFunc(_params, requestConfig);
        notify && notify.close();
        if (result.status === 200) {
          this.$message.success(_config.successMsg);
          (typeof _config.successCb === 'function') && _config.successCb();
        } else {
          this.$message.error(result.message);
        }
      }, _config.isMultiple, _config.acceptType);
    },
    // notify进度条message
    notifyMessage(msg, percentage) {
      return `<div class="file-notify-container"><div>${msg}</div><div class="file-notify-percentage"><i style="width: ${percentage}%"></i></div></div>`;
    },
    // 创建notify
    createNotify(msg) {
      return this.$notify({
        duration: 0,
        position: 'bottom-left',
        iconClass: 'el-icon-loading',
        customClass: 'file-notify',
        dangerouslyUseHTMLString: true,
        message: this.notifyMessage(msg, 0)
      });
    },
    /**
     * a标签下载，利用浏览器自带的文件下载功能
     * @param {string} url - 接口地址
     * @param {Object} [params=null] - 下载参数，也可以使用qs.stringify(params)会将该对像转为形如：id=123&name=Ada
     * @param {String} [urlPrefix='BASE_URL'] - 接口前缀: 类似BASE_URL
     * @param {string} [downloadName=''] - 下载文件名, 对于pdf：若不设置download属性，则默认在浏览器上打开(预览功能)
     * @example this.downLoadEvt(`${this.$apis.login.fileDownload}/npm-1.1.0-1.zip`, null, 'FILE_DOWN')
     */
    downLoadEvt(url, params = null, urlPrefix, downloadName = '') {
      const el = document.createElement('a');
      el.style.display = 'none';
      el.setAttribute('target', '_blank');
      downloadName && el.setAttribute('download', downloadName);
      const queryParams = params ? this.$tools.transformRequestData('application/x-www-form-urlencoded', params) : '';
      el.href = url.startsWith('blob') ? url : this.$tools.getFullUrl(`${url}?${queryParams}`, urlPrefix);
      console.log(el.href);
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
    },
    // 获取文件下载进度
    bindFileDownloadProgress(ajax, notify) {
      ajax.addEventListener('progress', (progress) => {
        const percentage = ((progress.loaded / progress.total) * 100).toFixed(2);
        this.downloadFileMsg = (progress.loaded === progress.total) ? '正在下载中，请稍后...' : `下载进度 ${percentage}%...`;
        notify.message = this.notifyMessage(this.downloadFileMsg, percentage);
      });
    },
    /**
     * ajax实现文件下载（也可以使用封装的axios方法，雷同uploadFile）
     * @param {String} url - 接口地址，以'/'开头的接口地址
     * @param {Object} [params] - 请求参数，{name: '文件下载'}
     * @param {String} [method] - 请求方法get/post(不区分大小写)
     * @param {Object} [config] - 方法配置
     * @example this.downLoadAjaxEvt(`${this.$apis.login.fileDownload}`, {name: '检测异常邮件.zip'}, 'get', {urlPrefix: 'FILE_DOWN'})
     */
    downLoadAjaxEvt(url, params, method = 'get', config) {
      const _this = this;
      const _method = method.toUpperCase();
      const _config = Object.assign({
        contentType: _method === 'GET' ? 'application/x-www-form-urlencoded' : 'application/json',  // 请求头类型
        downloadName: '未知文件',                                   // 下载文件名
        async: true,                                               // 请求是否异步-true异步、false同步
        token: localStorage.getItem('current_user_token') || '',   // 用户token
        urlPrefix: 'BASE_URL',                                     // 接口前缀: 类似BASE_URL
        hasProgress: true                                          // 是否需要展示下载进度
      }, config);

      const queryParams = this.$tools.transformRequestData(_config.contentType, params);
      const _url = this.$tools.getFullUrl(`${url}${_method === 'GET' ? '?' + queryParams : ''}`, _config.urlPrefix);

      const ajax = new XMLHttpRequest();
      ajax.open(_method, _url, _config.async);
      ajax.setRequestHeader('Authorization', _config.token);
      ajax.setRequestHeader('Content-Type', _config.contentType);
      // responseType若不设置，会导致下载的文件可能打不开
      ajax.responseType = 'blob';
      let notify = false;
      if (_config.hasProgress) {
        notify = this.createNotify(this.downloadFileMsg);
        this.bindFileDownloadProgress(ajax, notify);
      }
      ajax.onload = function () {
        notify && notify.close();
        if (this.status === 200) {
          // 通过FileReader去判断接口返回是json还是文件流
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            if (this.getResponseHeader('content-type').includes('application/json')) {
              const result = JSON.parse(fileReader.result || '{message: 服务器出现问题，请联系管理员}');
              _this.$message.error(result.message);
            } else {
              // 两种解码方式，区别自行百度:decodeURIComponent/decodeURI
              const fileName = decodeURIComponent((this.getResponseHeader('content-disposition') || '; filename="未知文件"').split(';')[1].slice(10));
              const file = new Blob([this.response]);
              const blobUrl = URL.createObjectURL(file);
              _this.downLoadEvt(blobUrl, null, undefined, fileName);
              // 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象
              URL.revokeObjectURL(blobUrl);
            }
          };
          // 调用readAsText读取文件，少了readAsText将不会触发onloadend事件
          fileReader.readAsText(this.response);
        } else {
          _this.$message.error('服务器出现问题，请联系管理员');
        }
      };
      ajax.send(queryParams);   // send(string): string：仅用于 POST 请求
    }
  }
};
