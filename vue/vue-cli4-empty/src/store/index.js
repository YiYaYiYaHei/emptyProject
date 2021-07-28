import Vue from 'vue';
import Vuex from 'vuex';
// 解决刷新浏览器，数据消失问题
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex);

// 用户信息
import userInfo from './modules/userInfo';

// state初始值
const defaultState = {
  menuFork: false // 菜单展开收起
};
const state = {
  ...defaultState
};

const getters = {
  getMenuFork: state => state.menuFork
};

const actions = {
  setMenuFork({commit}, data) {
    commit('mutationMenuFork', data);
  },
  resetStore({commit}) {
    commit('mutationResetStore');
  }
};

const mutations = {
  mutationMenuFork(state, data) {
    /* 扭转数据状态 */
    state.menuFork = data;
  },
  // 重置vuex
  mutationResetStore(state) {
    const defaultStateAll = {
      ...defaultState,
      userInfo: {
        ...userInfo.defaultState
      }
    };
    for (const key in defaultStateAll) {
      if (Object.prototype.hasOwnProperty.call(state, key)) {
        state[key] = defaultStateAll[key];
      }
    }
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
