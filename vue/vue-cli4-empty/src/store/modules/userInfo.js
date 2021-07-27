// 用户信息缓存
const state = {
  userInfo: {role: '普通用户', userName: 'admin'} // 用户信息
};

const getters = {
  getUserInfo: state => state.userInfo
};

const actions = {
  setUserInfo({commit}, data) {
    commit('mutationUserInfo', data);
  },
  resetStore({commit}) {
    commit('mutationResetStore');
  }
};

const mutations = {
  mutationUserInfo(state, data) {
    /* 扭转数据状态 */
    state.userInfo = data;
  },
  mutationResetStore(state) {
    /* 扭转数据状态 */
    state.userInfo = {};
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
