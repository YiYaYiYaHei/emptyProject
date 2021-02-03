/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
/**
 * 状态数据库对象
 */
const state = {
  userInfo: {}, // 用户信息
  menuExpand: true, // 菜单展开收起
};

/**
 * 状态数据库设值方法
 */
const getters = {
  getUserInfo: state => state.userInfo,
  getMenuExpand: state => state.menuExpand,
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
