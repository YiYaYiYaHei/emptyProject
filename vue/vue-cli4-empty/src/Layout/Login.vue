<template>
  <div class="login-container full pr">
    <div class="login-box">
      <div class="login-title">
        <img src="../assets/images/common/logo.png" height="151" width="645"/>
      </div>
      <el-form :model="loginData" label-width="0" :rules="loginDataRule" ref="loginForm">
        <el-form-item prop="userName">
          <el-input maxlength=20
                    placeholder="请输入用户名"
                    v-model="loginData.userName"
                    @keyup.enter.native="loginEvt"
                    clearable
                    @focus="focusInput('userName')"
                    class="user-name"
                    :class="{'active': !!loginData.userName}"></el-input>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input maxlength=20
                    type="password"
                    placeholder="请输入密码"
                    v-model="loginData.userPwd"
                    @keyup.enter.native="loginEvt"
                    clearable
                    @focus="focusInput('userPwd')"
                    class="user-name password"
                    :class="{'active': !!loginData.userPwd}"
                    onpaste="return false"></el-input>
        </el-form-item>
        <el-form-item class="mgt50">
          <span class="login-msg">{{msg}}</span>
          <el-button @click="submitForm(loginEvt, 'loginForm')" plain :loading="loading" type="primary">{{`${loading?'登录中':'登 录'}`}}</el-button>
        </el-form-item>
        <div class="login-tip">
          <p v-if="!isDeviceMatch.resolution">当前分辨率过低会影响体验，推荐使用分辨率1366*768及以上终端。</p>
          <p v-if="isDeviceMatch.resolution && !isDeviceMatch.viewport">浏览器可视区域过小会影响体验，建议将浏览器最大化。</p>
          <p v-if="!isDeviceMatch.browserVersion">当前浏览器版本过低会影响体验，请升级到最新版本。</p>
          <p v-if="!isDeviceMatch.browser">推荐使用火狐或谷歌浏览器最新版或IE11浏览器，效果更佳。</p>
        </div>
      </el-form>
    </div>
    <p class="login-footer">{{systemName}} {{systemVersion}}</p>
  </div>
</template>
<script>
import SHA256 from 'js-sha256';
import form from '@m/form.js';
import {jumpRoute} from '@u/tools';

export default {
  name: 'Login',
  mixins: [form],
  data() {
    return {
      systemName: process.env.VUE_APP_SYSTEM_NAME,
      systemVersion: process.env.VUE_APP_SYSTEM_VERSION,
      loginData: {
        userName: 'admin',
        userPwd: 'Az123456..'
      },
      loginDataRule: {
        userName: [{required: true, message: ' * 请输入用户名'}],
        userPwd: [{required: true, message: ' * 请输入密码'}]
      },
      loading: false,
      msg: '',
      // 当前聚焦的输入框类型--可用于加样式
      focusType: '',
      isDeviceMatch: {
        viewport: false,
        browserVersion: false,
        browser: false,
        resolution: false
      }
    };
  },
  methods: {
    focusInput(type) {
      this.msg = '';
      this.focusType = type;
    },
    async loginEvt() {
      this.loading = true;
      const result = await this.$apis.login.login({
        userName: this.loginData.userName,
        password: SHA256.hmac(this.loginData.userName, this.loginData.userPwd)
      });
      this.loading = false;
      if (result.status === 200) {
        localStorage.setItem('token', `Bearer ${result.data.token}`);
        // {role: '普通用户', userName: 'user', userId: 1, token: ''}
        this.$store.dispatch('setUserInfo', result.data);
        // 根据用户角色跳转页面
        this.$router.push(jumpRoute(result.data.role));
      } else {
        this.$message.error(result.message);
      }
    },
    // 获取浏览器版本号
    getVersion(browser) {
      const userAgent = navigator.userAgent;
      // 对于ie浏览器，判断是否是11版本
      if (browser === 'compatible') return userAgent.includes('Trident') && userAgent.includes('rv:11.0');

      const reg = new RegExp(`(${browser}\\/[.0-9]*)`, 'i');
      const agent = userAgent.match(reg);
      return agent ? parseInt(agent[0].split('/')[1].split('.')[0]) : 0;
    },
    // 检查浏览器类型和版本号
    checkBrowser() {
      // 火狐/谷歌/IE11
      const chromeVersion = this.getVersion('chrome');
      const firefoxVersion = this.getVersion('firefox');
      const isIE11 = this.getVersion('compatible');
      this.isDeviceMatch.browser = chromeVersion || firefoxVersion || isIE11;
      // 检查火狐/谷歌版本号
      const [MIN_VERSION_CHROME, MIN_VERSION_FIREFOX] = [60, 60];
      this.isDeviceMatch.browserVersion = true;
      if (chromeVersion) this.isDeviceMatch.browserVersion = chromeVersion >= MIN_VERSION_CHROME;
      if (firefoxVersion) this.isDeviceMatch.browserVersion = firefoxVersion >= MIN_VERSION_FIREFOX;
    },
    // 检查分辨率
    checkResolution() {
      const [MIN_WIDTH, MIN_HEIGHT] = [1366, 768];
      const [screenWidth, screenHeight] = [window.screen.width, window.screen.height];
      this.isDeviceMatch.resolution = (screenWidth >= MIN_WIDTH && screenHeight >= MIN_HEIGHT);
    },
    // 检查视口
    checkViewPort() {
      console.log('dd');
      const [MIN_WIDTH, MIN_HEIGHT] = [1300, 700];
      let [pageWidth, pageHeight] = [window.innerWidth, window.innerHeight];
      // IE
      if (typeof pageWidth !== 'number') {
        if (document.compactMode === 'CSS1Compat') {
          // 严格模式-CSS1Compat-strict mode
          [pageWidth, pageHeight] = [document.documentElement.clientWidth, document.documentElement.clientHeight];
        } else {
          // 怪异模式-BackCompat-quirks mode
          [pageWidth, pageHeight] = [document.body.clientWidth, document.body.clientHeight];
        }
      }
      this.isDeviceMatch.viewport = (pageWidth >= MIN_WIDTH && pageHeight >= MIN_HEIGHT);
    }
  },
  created() {
    this.checkBrowser();
    this.checkResolution();
    this.checkViewPort();
    window.addEventListener('resize', this.checkViewPort);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkViewPort);
  }
};
</script>

<style lang="less" scoped>
@footer-height: 50px;
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
  height: 100%;
  padding-bottom: @footer-height;
  background: url(../assets/images/common/login-bg.png) 100% 100% no-repeat;
}
.login-box {
  width: 645px;
}
.el-form {
  width: 480px;
  height: 318px;
  padding:  30px 75px;
  margin: 30px auto;
  background: linear-gradient(to bottom, rgba(26, 26, 46, 1), rgba(26, 26, 46, 0));
  border-radius: 10px;
}
.el-form-item {
  margin-top: 30px;
  &::before {
    display: none !important;
  }
  &.mgt50 {
    margin-top: 50px!important;
  }
}
/deep/.el-input {
  &::before {
    position: absolute;
    top: 50%;
    left: 20px;
    width: 30px;
    height: 30px;
    content: '';
    background-image: url("../assets/images/common/login-user.png");
    transform: translateY(-50%);
  }
  &.password::before {
    background-position: 30px 0;
  }
  &.user-name.active::before {
    background-position: 0 -35px;
  }
  &.password.active::before {
    background-position: 30px -35px;
  }
  .el-input__inner {
    height: 50px;
    padding-left: 55px;
    border: 0 none;
    background-color: #262e54;
    border-radius: 31px;
  }
}
.el-button {
  width: 100%;
  height: 50px;
  border: 0 none;
  background-color: #41b2ff;
  color: white;
  border-radius: 25px;
}
.login-msg {
  padding-bottom: 4px;
  color: @error;
  line-height: 18px;
  text-align: center;
}
.login-tip {
  line-height: 20px;
}
.login-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  .wfull();
  background-color: @bg-darker;
  .tc();
  line-height: @footer-height;
}
</style>
