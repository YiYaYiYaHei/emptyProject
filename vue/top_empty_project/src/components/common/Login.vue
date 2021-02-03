/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/10
 *********************************************************************/

<template>
  <div class="login-container">
    <div class="box">
      <div class="title"></div>
      <div class="login">
        <el-form :model="loginData" label-width="0">
          <el-form-item>
            <el-input maxlength=20 placeholder="用 户 名" v-model="loginData.userName" @keyup.enter.native="loginEvt" clearable @focus="focusInput('userName')" class="user-name" :class="{'active': !!loginData.userName, 'input-shadow': focusType === 'userName'}"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input maxlength=20 type="password" placeholder="密 码" v-model="loginData.userPwd" @keyup.enter.native="loginEvt" clearable @focus="focusInput('userPwd')" class="user-name password" :class="{'active': !!loginData.userPwd, 'input-shadow': focusType === 'userPwd'}"></el-input>
          </el-form-item>
          <el-form-item>
            <span class="fc-red">{{msg}}</span>
            <el-button @click="loginEvt" plain :loading="loading" type="primary">{{`${loading?'登录中':'登录'}`}}</el-button>
          </el-form-item>
          <div class="tip">
            <p v-show="visibleviewPort">当前分辨率过低会影响体验，推荐使用分辨率1366*768及以上版本终端。</p>
            <p v-if="visibleVersion">当前浏览器版本过低会影响体验，请升级到最新版本。</p>
            <p v-if="visibleRmd">推荐使用火狐或谷歌浏览器最新版，效果更佳。</p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SHA256 from 'js-sha256'
export default {
  data() {
    return {
      loginData: {
        userName: '',
        userPwd: ''
      },
      loading: false,
      msg: '',
      visibleviewPort: false,
      visibleVersion: false,
      visibleRmd: false,
      focusType: ''
    }
  },
  methods: {
    async loginEvt() {
      // 用户名或密码为空时
      if (!this.loginData.userName || !this.loginData.userPwd) {
        this.msg = '请输入用户名或密码'
        return false
      }

      this.loading = true
      let result = await this.$api.getDataRequest('USER_LOGIN', {
        userName: this.loginData.userName,
        userPwd: SHA256.hmac(this.loginData.userName, this.loginData.userPwd)
      })
      setTimeout(() => {
        this.loading = false
        if (!result || result.status !== 200) {
          this.$message.error(result.message)
        } else {
          sessionStorage.setItem('current_login_user_token', result.data.token)
          this.$store.dispatch('setUserInfo', {
            data: result.data.userInfo || {}
          })
          this.$router.push('/home')
        }
      }, 1000)
    },
    // 获取浏览器版本号
    getVersion(browser) {
      let arr = navigator.userAgent.split(' ')
      let chromeVersion = ''
      for (let i = 0; i < arr.length; i++) {
        if (new RegExp(browser, 'i').test(arr[i])) {
          chromeVersion = arr[i]
        }
      }
      if (chromeVersion) {
        return chromeVersion.split('/')[1]
      }
      return false
    },
    // 检查是否低于规定版本 谷歌.2987.133  火狐.2
    isLessThan(browser, version) {
      let minChromeVersion = '57.0'
      let minFirefoxVersion = '59.0'
      let minVersionArr =
        browser === 'chrome'
          ? minChromeVersion.split('.')
          : minFirefoxVersion.split('.')
      let versionArr = version.split('.')
      for (let i = 0; i < versionArr.length; i++) {
        if (Number(versionArr[i]) < Number(minVersionArr[i])) {
          return true
        }
      }
    },
    // 浏览器版本过低提示
    checkVersion() {
      let chromeVersion = this.getVersion('chrome')
      let firefoxVersion = this.getVersion('Firefox')
      if (chromeVersion) {
        this.visibleVersion = this.isLessThan('chrome', chromeVersion)
      } else if (firefoxVersion) {
        this.visibleVersion = this.isLessThan('Firefox', firefoxVersion)
      } else {
        this.visibleVersion = false
        this.visibleRmd = true
      }
    },
    // 分辨率提示
    checkViewPort() {
      let minWidth = 1366
      let minHeight = 768
      let pageWidth = window.innerWidth
      let pageHeight = window.innerHeight
      if (typeof pageWidth !== 'number') {
        if (document.compactMode === 'CSS1Compat') {
          pageWidth = document.documentElement.clientWidth
          pageHeight = document.documentElement.clientHeight
        } else {
          pageWidth = document.body.clientWidth
          pageHeight = document.body.clientHeight
        }
      }
      if (pageWidth < minWidth || pageHeight < minHeight) {
        this.visibleviewPort = true
      } else {
        this.visibleviewPort = false
      }
    },
    focusInput(type) {
      this.msg = ''
      this.focusType = type
    }
  },
  created() {
    this.checkViewPort()
    this.checkVersion()

    window.addEventListener('resize', this.checkViewPort)
  },
  destroyed() {
    window.onresize = null
  }
}
</script>
