/*********************************************************************
 * Created by shuhui-meng on 2020/07/14
 * 所有继承页面，如果要用到表格分页功能，需要实现getTableData方法
 *********************************************************************/

<script>
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      pageLoading: false,
      dialogLoading: false,
      pagingData: {
        size: 30,
        current: 1,
        sizes: [30, 70, 100, 150],
        total: 0
      },
      tableData: {
        loading: false,
        column: [],
        data: [],
        defaultProp: {prop: 'createTime', order: 'descending'},
	      sortOrders: ['descending', 'ascending'],
        srcData: [] // 前端分页: 所有数据
      },
      orderField: '',
      orderBy: 'DESC',
      websock: null
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    /* 页面获取表格数据 */
    async getTableData() {
      console.log('base view method...');
    },
    /* 表格排序 */
    sortChange({column, prop, order}) {
      this.orderField = prop;
      this.orderBy = order === 'ascending' ? 'ASC' : 'DESC';
      this.getTableData();
    },
    /* 表格勾选 */
    tableSelection(row) {
      this.tableSelectionData = row;
    },
    /* 判断是否勾选 */
    isTableSelect() {
      return !!this.tableSelectionData && !!this.tableSelectionData.length;
    },
    /* 表格勾选参数 */
    tableSelectParams(key, temp = this.tableSelectionData) {
      let list = [];
      temp.map(it => list.push(it[key]));
      return list;
    },
    // 开启弹框加载圈
    openLoading(className = '.base-dailog-container.dialog-show') {
      this.dialogLoading = this.$loading({
        lock: true,
        text: '',
        spinner: '',
        background: 'rgba(255, 255, 255, 0.9)',
        target: className,
        customClass: 'loading'
      });
    },
    /* 关闭弹框加载圈 */
    closeLoading() {
      this.dialogLoading.close();
    },
    /** 分页事件
     * @param val         值
     * @param type        分页类型：size：每页条数，current：当前页
     * @param [isWebPage] 是否前端分页：true/false
     */
    pagingEvent(val, type, isWebPage = false) {
      if (type === 'size') {
        this.pagingData.size = val;
        this.pagingData.current = 1;
      } else {
        this.pagingData.current = val;
      }
      if (isWebPage) {
        this.setTableData();
      } else {
        this.getTableData();
      }
    },

    /** 前端分页调用 
     * @param [tableObj]   表格对象
     * @param [pageData]    分页对象
    */
    setTableData(tableObj, pageData) {
      let _tableData = tableObj || this.tableData,
        _pageData = pageData || this.pagingData;
      _tableData.loading = true;
      _tableData.data = _tableData.srcData.slice((_pageData.current - 1) * _pageData.size, _pageData.current * _pageData.size);

      setTimeout(() => {
        _tableData.loading = false;
      })
    },

    /** 下载--带header
     * @param requestUrl        接口地址
     * @param data              下载参数，get格式为：?id=123&&name="文件下载"
     * @param method            请求方法get/post
     * @param [configObj]       下载数据配置
     */
    downLoadAxiosEvt(requestUrl, data, method = 'get', configObj) {
      let contentType = configObj.contentType || 'application/json',   // 请求头的Content-Type
          downloadName = configObj.downloadName || '下载文件名必填',    // 下载文件名(必填，若为空，下载下来都是txt格式)
          isDownload = configObj.isDownload || true,                   // .pdf若不设置download属性，可直接在浏览器上打开             
          urlPrefix = configObj.urlPrefix || undefined;                // 获取接口地址的前缀，一般默认BASE_URL
      
      let ajax = new XMLHttpRequest();
      let url = this.$api.getFullUrl(requestUrl, false, urlPrefix);
      if (method === 'get') {
        url = data ? `${url}${data}` : url;
      }
      ajax.open(method, url);
      let token = localStorage.getItem('current_login_user_token') || '';
      ajax.setRequestHeader('Authorization', token);
      ajax.setRequestHeader('Content-Type', contentType);
      ajax.responseType = 'blob';
      ajax.onload = function () {
        if (this.status === 200) {
          let fileName = (this.getResponseHeader('content-disposition') || ';filename="未知文件"').split(';')[1].slice(9);
          let blob = this.response;
          let file = new Blob([blob]);
          let el = document.createElement('a');
          if (isDownload) el.download = fileName || downloadName;
          el.setAttribute('target', '_blank');
          el.href = URL.createObjectURL(file);
          document.body.appendChild(el);
          el.click();
          document.body.removeChild(el);
        }
      }
      if (method === 'get') {
        ajax.send();
      } else {
        if (contentType === 'application/json') ajax.send(JSON.stringify(data));
        if (contentType === 'application/x-www-form-urlencoded;charset=UTF-8') {
          let str = '';
          for (let key in data) {
            str += `${key}=${data[key]}&`
          }
          ajax.send(str);
        }
      }
    },

    /** 下载
     * @param requestUrl        接口地址
     * @param params            下载参数，格式为：?id=123&name="文件下载"
     * @param [downloadName]    下载文件名
     * @param [isDownload]      是否下载
     */
    downLoadEvt(requestUrl, params, downloadName = '', isDownload = true) {
      let url = this.$api.getFullUrl(requestUrl);
      let el = document.createElement('a');
      document.body.appendChild(el);
      if (isDownload) el.setAttribute('download', downloadName);
      el.setAttribute('target', '_blank');
      let downUrl = !!params ? `${url}${params}` : url;
      console.log('下载地址', downUrl);
      el.href = downUrl;
      el.click();
      document.body.removeChild(el);
    },

    /** 上传方法
     * @param url                        上传地址, 地址key
     * @param params                     上传文件的参数,格式: [{key: '参数的键名', value: '参数的键值', type: '为file时，表示值为上传的文件流'}]；，默认参数:{file: 文件流}
     * @param [configObj]                上传数据配置
     */
    uploadFileEvt(url, params = [{ key: 'file', type: 'file' }], configObj) {
      let successMsg = configObj.successMsg || '文件上传成功',        // 文件上传成功的提示语
          successCb = configObj.successCb || null,                   // 上传成功后的回调函数
          acceptType = configObj.acceptType || '',                   // 上传的文件类型
          acceptTypeMsg = configObj.acceptTypeMsg || '',             // 上传文件类型错误的提示语
          fileSizeLimit = configObj.fileSizeLimit || 0,              // 文件限制大小，以字节为单位
          isMultiple = configObj.isMultiple || false,                // 是否多文件上传
          urlPrefix = configObj.urlPrefix || undefined;              // 获取接口地址的前缀，一般默认BASE_URL

      this.$tool.fileUploadNode('fileName', async files => {
        if (files === 'ERROR_CODE') {
          this.$message.error('未选择文件，请选择文件后再试');
        } else {
          // 校验文件类型
          if (!!acceptType) {
            for (let i = 0; i < files.length; i++) {
              if (acceptType === 'image/*') {
                if (!files[i].type.startsWith('image/')) {
                  this.$message.warning(acceptTypeMsg);
                  return;
                }
              } else {
                let accept = acceptType.split(',');
                let pointIndex = files[i].name.lastIndexOf('.');
                let fileType = files[i].name.slice(pointIndex);
                if (!accept.includes(fileType)) {
                  this.$message.warning(acceptTypeMsg);
                  return;
                }
              }
            }
          }
          // 判断文件上传大小
          if (!!fileSizeLimit) {
            for (let item of files) {
              if (item.size > fileSizeLimit) {
                this.$message.warning(`只能上传${this.$tool.formatFileSize(fileSizeLimit)}的文件`);
                return;
              }
            }
          }
          this.uploadLoadingTxt = '文件上传中...';
          let _params = {};
          // 接口参数
          for (let item of params) {
            if (item.type === 'file') {
              _params[item.key] = files;
            } else {
              _params[item.key] = item.value;
            }
          }
          let result = await this.$api.postFileRequest(url, _params, progress => {
            this.uploadLoadingTxt = `文件上传：${(progress.loaded / progress.total * 100).toFixed(2)}%`;
          }, urlPrefix);
          setTimeout(() => {
            if (!!result && result.status === 200) {
              this.$message.success(successMsg);
              if (!!successCb && typeof successCb === 'function') successCb();
            } else {
              this.$message.error(result.message);
            }
          }, 800)
        }
      },
        isMultiple,
        acceptType
      )
    },

    /** 表单验证提交 
     * @param formName  表单名
     * @param success   回调函数
     */
    submitForm(formName, success) {
      this.$refs[formName].validate(valid => {
        // 验证成功与后台交互
        if (valid) {
          if (typeof success === 'function') success();
        } else {
          return false;
        }
      })
    },

    /* 重置表单 */
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName] && this.$refs[formName].resetFields();
      })
    },

    /* 退出 */
    logout() {
      localStorage.clear();
      this.$store.dispatch('resetStore');
      this.$router.push('/login');
    },

    /* 获取分页参数 */
    getPageParams() {
      return {
        page: this.pagingData.current,
        size: this.pagingData.size
      }
    },

    /* 初始化weosocket */
    initWebSocket(url, params) {
      let protocol = '';
      if (window.location.protocol == 'https:') {
        protocol = 'wss:/';
      } else {
        protocol = 'ws:/';
      }
      // const wsuri = `wss://${this.$utils.CONFIG.api.webSocketBaseUrl}${url}`;
      const wsuri = `${protocol}${url}${!!params ? '?' + params : ''}`;
      console.log('websocket:', wsuri);
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    /* 连接建立之后执行send方法发送数据 */
    websocketonopen() {
      // --
    },
    /* 连接建立失败重连 */
    websocketonerror() {
      // this.initWebSocket();
    },
    /* 数据接收 */
    websocketonmessage(e) {
      // --
    },
    /* 数据发送 */
    websocketsend(Data) {
      console.log('-------------发送数据:', Data);
      this.websock.send(Data);
    },
    /* 关闭 */
    websocketclose(e) {
      console.log('断开连接', e);
    }
  }
}
</script>