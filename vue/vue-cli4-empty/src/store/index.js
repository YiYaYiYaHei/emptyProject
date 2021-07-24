import Vue from 'vue';
import Vuex from 'vuex';
// 用户信息
import userInfo from './modules/userInfo';
// 解决刷新浏览器，数据消失问题
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {};
const mutations = {};
const actions = {};

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  mutations,
  actions,
  modules: {
    userInfo
  }
});
