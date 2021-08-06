// 嵌套子系统
<template>
  <div class="page-entry-container full">
    <div class="header-box dflex">
      <div class="system-logo dflex fai">
        <img :src="logoSrc" height="35" width="147"/>
      </div>
      <div class="tab-box dflex fai">
        <span v-for="item in tabList"
              :key="item.value"
              @click="activeTabName = item.value"
              :class="{'active': activeTabName === item.value}"
              class="tab-item pointer">{{item.label}}</span>
      </div>
    </div>
    <component v-if="activeTabName === 'first'" :is="currentComp"></component>
    <!-- iframe会引起跨域，用代理 或者 动态赋值，内嵌别人的网站且跨域情况下，地址栏无法获取实时地址-->
    <iframe v-if="activeTabName === 'second'" class="iframe" scrolling=auto :src="iframeSrc1" frameborder="0"></iframe>
    <iframe v-if="activeTabName === 'third'"  class="iframe" scrolling=auto :src="iframeSrc2" frameborder="0"></iframe>
  </div>
</template>

<script>
import MainLayout from '../Layout/MainLayout.vue';
import BlankLayout from '../Layout/BlankLayout.vue';
import user from '@m/user.js';

export default {
  props: ['layout'],
  mixins: [user],
  components: {
    MainLayout,
    BlankLayout
  },
  data() {
    return {
      logoSrc: require('@a/images/common/logo.png'),
      tabList: [
        {label: '第一个系统', value: 'first'},
        {label: '第二个系统', value: 'second'},
        {label: '第三个系统', value: 'third'}
      ],
      activeTabName: 'first',
      currentComp: 'main-layout',
      // 前端控制超时自动退出
      operatorData: {
        timer: null,               // 定时器id
        timeout: process.env.VUE_APP_TIMEOUT_INTERVAL * 60 * 1000,   // 10分钟
        actions: ['mousemove', 'keyup', 'click']
      },
      iframeSrc1: '',
      iframeSrc2: ''
    };
  },
  watch: {
    '$route.path': function(val) {
      this.currentComp = this.$route.meta.layout || 'main-layout';

      // 若当前页面被内嵌则修改浏览器访问地址为实际访问地址(避免访问子系统时，地址栏未改变)
      (window.self !== window.top) && (window.top.location.href = window.location.href);
    }
  },
  methods: {
    // 清除自动退出定时器
    clearOperatorTimer() {
      this.operatorData.timer && clearTimeout(this.operatorData.timer);
    },
    // 更新操作时间
    updateOperatorTime() {
      this.clearOperatorTimer();
      if (location.pathname === '/login') return;
      this.operatorData.timer = setTimeout(() => {
        this.logout('长时间未操作系统，请重新登录', 'error');
      }, this.operatorData.timeout);
    }
  },
  created() {
    this.currentComp = this.layout;
    this.updateOperatorTime();
    this.operatorData.actions.map(type => document.addEventListener(type, this.updateOperatorTime));
    this.iframeSrc1 = 'https://cn.vuejs.org/v2/guide/';
    this.iframeSrc2 = 'http://eslint.cn/docs/rules/';
  },
  beforeDestroy() {
    this.clearOperatorTimer();
    this.operatorData.actions.map(type => document.removeEventListener(type, this.updateOperatorTime));
  }
};
</script>

<style lang="less" scoped>
.page-entry-container {
  overflow: hidden;
}
.header-box {
  .wfull();
  height: 70px;
  background: @bg-base;
  border-bottom: 6px solid @text-base;
  .system-logo {
    width: @menuLeftWidth;
  }
  .tab-box {
    .w(calc(~"100% - "@menuLeftWidth));
    .hfull();
    .tab-item {
      .dinlineb();
      .line-height(70px);
      padding: 0 20px;
      .fs(20px);
      &.active {
        position: relative;
        color: @primary;
        &:after {
          content: '';
          position: absolute;
          bottom: -3px;
          right: 0;
          .wfull();
          height: 6px;
          background: @primary;
        }
      }
    }
  }
}
.self-system-container {
  .h(calc(~"100% - "@menuLeftWidth));
}
iframe {
  .full();
}
</style>
