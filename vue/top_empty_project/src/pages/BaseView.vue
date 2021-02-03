/*********************************************************************
 * Created by shuhui-meng on 2020/07/14
 * 所有继承页面，如果要用到表格分页功能，需要实现getTableData方法
 *********************************************************************/

<script>
export default {
  data() {
    return {
      pageLoading: false,
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
        srcData: [] // 前端分页: 所有数据
      },
      websock: null,
      acceptFileUpload:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
    }
  },
  methods: {
    /* 页面获取表格数据 */
    async getTableData() {
      console.log('base view method...')
    },

    /** 分页事件
     * @param val         值
     * @param type        分页类型：size：每页条数，current：当前页
     * @param isWebPage   是否前端分页：true/false
     */
    pagingEvent(val, type, isWebPage) {
      if (type === 'size') {
        this.pagingData.size = val
        this.pagingData.current = 1
      } else {
        this.pagingData.current = val
      }
      if (isWebPage) {
        this.setTableData()
      } else {
        this.getTableData()
      }
    },

    /** 前端分页调用 */
    setTableData(tableObj, pageData) {
      let _tableData = tableObj || this.tableData,
        _pageData = pageData || this.pagingData
      _tableData.loading = true
      _tableData.data = _tableData.srcData.slice(
        (_pageData.current - 1) * _pageData.size,
        _pageData.current * _pageData.size
      )

      setTimeout(() => {
        _tableData.loading = false
      })
    },

    /** 下载--带header
     * @param requestUrl        接口地址
     * @param params            下载参数，格式为：?id=123&&name="文件下载"
     * @param [downloadName]    下载文件名(必填，若为空，下载下来都是txt格式)
     * @param [isDownload]      是否下载
     */
    downLoadHasHeaderEvt(requestUrl, params, downloadName = '', isDownload = true) {
      let url = this.$api.getFullUrl(requestUrl)
      let downUrl = !!params ? `${url}${params}` : url
      let ajax = new XMLHttpRequest()
      ajax.open('get', downUrl)
      let token = sessionStorage.getItem('current_login_user_token') || ''
      ajax.setRequestHeader('Authorization', token)
      ajax.setRequestHeader('Content-Type', 'application/json')
      ajax.responseType = 'blob'
      ajax.onload = function() {
        if (this.status === 200) {
          let blob = this.response
          let file = new Blob([blob])
          let el = document.createElement('a')
          if (isDownload) el.download = downloadName
          el.setAttribute('target', '_blank')
          el.href = URL.createObjectURL(file)
          document.body.appendChild(el)
          el.click()
          document.body.removeChild(el)
        }
      }
      ajax.send()
    },

    /** 下载
     * @param requestUrl        接口地址
     * @param params            下载参数，格式为：?id=123&name="文件下载"
     * @param [downloadName]    下载文件名
     * @param [isDownload]      是否下载
     */
    downLoadEvt(requestUrl, params, downloadName = '', isDownload = true) {
      let url = this.$api.getFullUrl(requestUrl)
      let el = document.createElement('a')
      document.body.appendChild(el)
      if (isDownload) el.setAttribute('download', downloadName)
      el.setAttribute('target', '_blank')
      let downUrl = !!params ? `${url}${urlConcat}${params}` : url
      console.log('下载地址', downUrl)
      el.href = downUrl
      el.click()
      document.body.removeChild(el)
    },

    /** 上传方法
     * @param url                        上传地址
     * @param isMultiple                 是否多文件上传
     * @param acceptType                 上传的文件类型
     * @param acceptTypeMsg              上传文件类型错误的提示语
     * @param successMsg                 文件上传成功的提示语
     * @param successCb                  上传成功后的回调函数
     * @param params                     上传文件的参数,格式: [{key: '参数的键名', value: '参数的键值', type: '为file时，表示值为上传的文件流'}]；，默认参数:{file: 文件流}
     */
    uploadFileEvt(url, isMultiple, acceptType, acceptTypeMsg, successMsg, successCb, params = [{ key: 'file', type: 'file' }]) {
      this.$tool.fileUploadNode('fileName',async files => {
          if (!!acceptType) {
            for (let i = 0; i < files.length; i++) {
              if (acceptType === 'image/*') {
                if (!files[i].type.startsWith('image/')) {
                  this.$message.warning(acceptTypeMsg)
                  return
                }
              } else {
                let accept = acceptType.split(',')
                if (!accept.includes(files[i].type)) {
                  this.$message.warning(acceptTypeMsg)
                  return
                }
              }
            }
          }
          if (files === 'ERROR_CODE') {
            this.$message.error('未选择文件，请选择文件后再试')
          } else {
            this.pageLoading = true
            this.uploadLoadingTxt = '文件上传中...'
            let _params = {}
            for (let item of params) {
              if (item.type === 'file') {
                _params[item.key] = files
              } else {
                _params[item.key] = item.value
              }
            }
            console.log(_params)
            /* let result = await this.$api.postFileRequest(url, _params, progress => {
              this.uploadLoadingTxt = `文件上传：${(progress.loaded / progress.total * 100).toFixed(2)}%`
            }); */
            let result = {
              status: 200,
              message: '',
              data: []
            }
            setTimeout(() => {
              this.pageLoading = false
              if (!!result && result.status === 200) {
                this.$message.success(successMsg)
                successCb()
              } else {
                this.$message.error(result.message)
              }
            }, 1000)
          }
        },
        isMultiple,
        acceptType
      )
    },

    /* 表单验证提交 */
    submitForm(formName, success) {
      this.$refs[formName].validate(valid => {
        // 验证成功与后台交互
        if (valid) {
          if (typeof success === 'function') success()
        } else {
          return false
        }
      })
    },

    /* 重置表单 */
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName] && this.$refs[formName].resetFields()
      })
    },

    /* 退出 */
    logout() {
      sessionStorage.removeItem('current_login_user_token')
      this.$store.dispatch('resetStore')
      this.$router.push('/login')
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
      let protocol = ''
      if (window.location.protocol == 'https:') {
        protocol = 'wss:/'
      } else {
        protocol = 'ws:/'
      }
      // const wsuri = `wss://${this.$utils.CONFIG.api.webSocketBaseUrl}${url}`;
      const wsuri = `${protocol}${url}${!!params ? '?' + params : ''}`
      console.log('websocket:', wsuri)
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
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
      console.log('-------------发送数据:', Data)
      this.websock.send(Data)
    },
    /* 关闭 */
    websocketclose(e) {
      console.log('断开连接', e)
    }
  }
}
</script>