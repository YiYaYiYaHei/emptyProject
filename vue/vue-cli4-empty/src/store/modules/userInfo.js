// 用户信息缓存
const defaultState = {
  userInfo: {role: '普通用户', userName: 'admin'} // 用户信息
};
const state = {
  ...defaultState
};

const getters = {
  getUserInfo: state => state.userInfo
};

const actions = {
  setUserInfo({commit}, data) {
    commit('mutationUserInfo', data);
  }
};

const mutations = {
  mutationUserInfo(state, data) {
    /* 扭转数据状态 */
    state.userInfo = data;
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  defaultState
};
