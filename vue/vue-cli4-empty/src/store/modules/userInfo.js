// 用户信息缓存
const defaultState = {
  // 用户信息
  userInfo: {role: '普通用户', userName: 'user', userId: 1, token: ''},
  // 用户登录时间（用于前端主动刷新token）
  userLoginTime: null
};
const state = {
  ...defaultState
};

const getters = {
  getUserInfo: state => state.userInfo,
  getUserLoginTime: state => state.userLoginTime
};

const actions = {
  setUserInfo({commit}, data) {
    commit('mutationUserInfo', data);
  },
  setUserLoginTime({commit}) {
    commit('mutationUserLoginTime');
  }
};

const mutations = {
  mutationUserInfo(state, data) {
    /* 扭转数据状态 */
    state.userInfo = data;
  },
  mutationUserLoginTime(state) {
    state.userLoginTime = Date.now();
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
  defaultState
};
