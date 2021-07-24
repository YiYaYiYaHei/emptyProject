import Vue from 'vue';
import store from './store';
import '@a/styles/index.less';

// 引入element-ui组件库
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 项目入口文件
import Index from './pages/Index.vue';

// 加载路由模块
import Router from 'vue-router';
import router from './router';
Vue.use(Router);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  data: {
    eventBus: new Vue()
  },
  render(creatElement) {
    let layout = this.$route.meta.layout || 'main-layout';
    return creatElement(Index, {
      props: {
        layout
      }
    })
  }
}).$mount('#app');
