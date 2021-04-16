/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
import Router from 'vue-router';

/* 各个功能模块 --start-- */
import Home from './home';
/* 各个功能模块 --end-- */


/* 获取路由集合 */
const RouterCollection = [
  ...Home
]

/* 去除重复点击路由，控制台报错问题 */
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

let router = new Router({
  mode: 'history',
  routes: RouterCollection
});

/* 检查是否存在此路由 */
let isExistPath = (path, routers) => {
  for (let item of routers) {
    let flag = loopPath(path, item);
    if (flag) {
      return flag;
    }
  }
  return false;
};

let loopPath = (path, item) => {
  if (item.path === path) {
    return true;
  }
  if (!!item.children && item.children.length > 0) {
    for (let it of item.children) {
      if (loopPath(path, it)) {
        return true;
      }
    }
  }
  return false;
};

/* 路由守卫 */
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('current_login_user_token') || '';
  if (!token && to.fullPath !== '/login') {
    next('/login');
    return;
  }
  /* 是否存在访问路由 */
  if (!isExistPath(to.path, RouterCollection)) {
    next("/home");
    return;
  }
  if (!!token && to.fullPath === '/login') {
    next('/home')
  } else {
    next();
  }
})

export default router;
