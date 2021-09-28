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
  render(createElement) {
    return createElement(this.currentComp);
  },
  data() {
    return {
      currentComp: 'main-layout',
      // 前端控制超时自动退出
      operatorData: {
        timer: null,               // 定时器id
        timeout: process.env.VUE_APP_TIMEOUT_INTERVAL * 60 * 1000,   // 10分钟
        actions: ['mousemove', 'keyup', 'click']
      }
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
  },
  mounted() {
    // 同一浏览器以最后一次登录为准
    window.addEventListener('storage', e => {
      if (!window.localStorage.length) {
        location.replace('/login');
        return;
      }
      if (e.key === 'userName' && e.newValue !== e.oldValue) {
        if (window.location.pathname.includes('/login')) return;
        this.$message.warning('用户信息已更新，即将刷新页面...');
        setTimeout(() => location.reload(), 2000);
      }
    });
  },
  beforeDestroy() {
    this.clearOperatorTimer();
    this.operatorData.actions.map(type => document.removeEventListener(type, this.updateOperatorTime));
  }
};
</script>
