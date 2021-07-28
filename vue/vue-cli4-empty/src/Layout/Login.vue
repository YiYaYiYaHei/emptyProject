<template>
  <div class="login-container full">
    <el-button @click="uploadFile('fileUpload', {userName: 'addd'})">登录</el-button>
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
  }
};
</script>

<style lang="less" scoped>

</style>
