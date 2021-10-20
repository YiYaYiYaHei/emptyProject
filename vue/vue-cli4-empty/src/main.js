import Vue from 'vue';
import store from './store';
import '@a/styles/index.less';

// 引入element-ui组件库
import ElementUI from 'element-ui';
// 情况1：由于我们对element.ui进行了样式重置，所以这里不需要引入了。情况2：第三方库cdn加载：index.html已经引入了element.ui的css，所以这里不需要重复引入。
// import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 项目入口文件
import Index from './pages/Index.vue';

// 加载路由模块
import Router from 'vue-router';
import router from './router';
Vue.use(Router);

// 全局组件、过滤器、指令、原型注册
import GlobalOperation from './common/index.js';
Vue.use(GlobalOperation);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  data: {
    eventBus: new Vue()
  },
  render(creatElement) {
    if (this.$route.path === '/') {
      /* 此判断防止请求'/'路由报404 -- 防止刷新时，先进入/在进入当前路由*/
      return creatElement('div');
    }
    let layout = this.$route.meta.layout || 'main-layout';
    return creatElement(Index, {
      props: {
        layout
      }
    })
  }
}).$mount('#app');
