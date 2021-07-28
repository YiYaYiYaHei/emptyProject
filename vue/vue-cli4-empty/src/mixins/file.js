export default {
  data() {
    return {
      uploadFileMsg: '正在上传中...',
      notifyList: {}
    };
  },
  methods: {
    // 使用input标签属性上传文件
    fileUploadNode(isMultiple = false, acceptType = '', cb) {
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
    // 检测文件类型
    checkFileType(files, acceptType, errorMsg) {
      const length = files.length;
      let flag = true;
      for (let i = 0; i < length; i++) {
        if (acceptType === 'image/*' && !files[i].type.startsWith('image/')) {
          errorMsg && this.$message.error(errorMsg);
          flag = false;
          break;
        } else {
          const accept = acceptType.split(',');
          const pointIndex = files[i].name.lastIndexOf('.');
          const fileType = files[i].name.slice(pointIndex);
          if (!accept.includes(fileType)) {
            errorMsg && this.$message.error(errorMsg);
            flag = false;
            break;
          }
        }
      }
      return flag;
    },
    // 检测文件大小
    checkFileSize(files, size) {
      for (const item of files) {
        if (item.size > size) {
          // this.$message.warning(`只能上传${this.$tool.formatFileSize(fileSizeLimit)}的文件`);
          this.$message.warning('只能上传2M的文件');
          return false;
        }
      }
      return true;
    },
    // 上传文件
    uploadFile(url, params, config) {
      const _config = Object.assign({
        isMultiple: true,           // 是否多文件上传
        acceptType: '',             // 文件类型
        acceptTypeErrMsg: '',       // 文件类型错误提示语
        limitSize: 0,               // 文件限制大小(单位字节)
        successMsg: '文件上传成功',  // 文件上传成功提示语
        successCb: null,            // 成功的回调
        paramsFileKey: 'file',      // 上传参数-文件key
        urlPrefix: 'BASE_URL',      // 地址前缀（防止多台服务器时，请求前缀不同）
        hasNotify: true             // 是否有notify提示
      }, config);
      this.fileUploadNode(_config.isMultiple, _config.acceptType, async (files) => {
        // 检测文件大小
        let limitSizeFlag = true;
        _config.limitSize && (limitSizeFlag = this.checkFileSize(files, _config.limitSize));
        if (!limitSizeFlag) return;

        // 检测文件类型
        let acceptTypeFlag = true;
        _config.acceptType && (acceptTypeFlag = this.checkFileType(files, _config.acceptType, _config.acceptTypeErrMsg));
        if (!acceptTypeFlag) return;

        // 请求参数
        params && (params[_config.paramsFileKey] = _config.isMultiple ? files : files[0]);
        const notify = _config.hasNotify ? this.createNotify(this.uploadFileMsg) : false;
        const requestConfig = {
          onUploadProgress: progress => {
            const percentage = ((progress.loaded / progress.total) * 100).toFixed(2);
            this.uploadFileMsg = `正在上传 ${percentage}%`;
            if (notify) {
              notify.message = this.uploadFileMsg;
              (progress.loaded === progress.total) && notify.close();
            }
          },
          urlPrefix: _config.urlPrefix
        };
        const result = await this.$apis.login[url](params, requestConfig);
        if (result.status === 200) {
          this.$message.success(_config.successMsg);
          (typeof _config.successCb === 'function') && _config.successCb();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 创建notify
    createNotify(msg) {
      return this.$notify({
        duration: 0,
        position: 'bottom-left',
        iconClass: 'el-icon-loading',
        customClass: 'file-notify',
        message: msg
      });
    }
  }
};
