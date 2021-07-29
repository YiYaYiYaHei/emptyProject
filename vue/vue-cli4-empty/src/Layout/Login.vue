<template>
  <div class="login-container full">
    <img :src="$tools.getNationalFlagSrc('中国')" />
    <el-button @click="uploadFile($apis.login.fileUpload, {userName: 'addd'}, {acceptType: '.zip,.rar', acceptTypeErrMsg: '限.zip,.rar', limitSize: 30000 * 1024})">登录</el-button>
    <el-button @click="downLoadEvt(`${$apis.login.fileDownload}/npm-1.1.0-1.zip`, null, 'FILE_DOWN')">下载</el-button>
    <el-button @click="downLoadAjaxEvt(`${$apis.login.fileDownload}`, {name: '检测异常邮件.zip'}, 'get', {urlPrefix: 'FILE_DOWN'})">下载ajax</el-button>
  </div>
</template>
<script>
import file from '@m/file.js';
export default {
  mixins: [file],
  data() {
    return {

    };
  },
  methods: {
    async loginEvt() {
      const result = await this.$apis.login.login({userName: 'user', passward: 'passward'});
      console.log(result);
      if (result.status >= 500) {
        this.$message.error(result.message);
      } else {
        this.$message.success(result.message);
      }
    }
  },
  created() {
    localStorage.setItem('current_login_user_token', '122');
    console.log(this.$tools.stringToArray('123123.333,111'));
  }
};
</script>

<style lang="less" scoped>

</style>
