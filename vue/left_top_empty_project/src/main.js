import Vue from 'vue';

/* 加载路由模块 */
import Router from 'vue-router';
import router from './router';
Vue.use(Router);

/* 引入element-ui组件库 */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

/* 加载全局过滤器/指令 */
import GlobalComponent from "./components/index.js";
Vue.use(GlobalComponent);

/* 引入状态管理器 */
import store from './store/index.js';

/* 引入样式 */
import './styles/index.less';

/* 引入项目总入口 */
import Index from './pages/Index.vue';

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render(creatElement) {
    if (this.$route.path === '/') {
      /* 此判断防止请求'/'路由报404 */
      return creatElement('div')
    }
    let layout = this.$route.meta.layout || 'main-layout';
    return creatElement(Index, {
      props: {
        layout
      }
    })
  }
});
