// 用户信息缓存

const state = {
  userInfo: {role: '管理员'}, // 用户信息
  menuExpand: true // 菜单展开收起
};

const getters = {
  getUserInfo: state => state.userInfo,
  getMenuExpand: state => state.menuExpand
};

const actions = {
  setUserInfo({commit}, {data}) {
    commit('mutationUserInfo', {data});
  },
  setMenuExpand({commit}, {data}) {
    commit('mutationMenuExpand', {data});
  },

  resetStore({commit}) {
    commit('mutationResetStore');
  }
};

const mutations = {
  mutationUserInfo(state, {data}) {
    /* 扭转数据状态 */
    state.userInfo = data;
  },
  mutationMenuExpand(state, {data}) {
    /* 扭转数据状态 */
    state.menuExpand = data;
  },
  mutationResetStore(state) {
    /* 扭转数据状态 */
    state.userInfo = {};
    state.menuExpand = true;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
