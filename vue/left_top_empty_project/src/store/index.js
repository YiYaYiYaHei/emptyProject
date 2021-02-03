/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

/* 通用组件 Vuex对象 */
import common from './modules/common';

/* 解决刷新浏览器，数据消失问题 */
import createPersistedState from 'vuex-persistedstate';

/* 实例化Vuex状态管理器对象 */
const store = new Vuex.Store({
  plugins: [createPersistedState()],
  modules: {
    common
  }
})

export default store;
