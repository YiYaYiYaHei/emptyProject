import Vue from 'vue';
import Vuex from 'vuex';
// 用户信息
import userInfo from './modules/userInfo';
// 解决刷新浏览器，数据消失问题
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

const state = {
  menuFork: false // 菜单展开收起
};

const getters = {
  getMenuFork: state => state.menuFork
};

const actions = {
  setMenuFork({commit}, data) {
    commit('mutationMenuFork', data);
  }
};

const mutations = {
  mutationMenuFork(state, data) {
    console.log(data);
    /* 扭转数据状态 */
    state.menuFork = data;
  }
};

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state,
  getters,
  actions,
  mutations,
  modules: {
    userInfo
  }
});
