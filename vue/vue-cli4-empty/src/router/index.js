import VueRouter from 'vue-router';
import routes from './routes.js';
import store from '@/store';

/* 去除重复点击路由，控制台报错问题(push可替换为replace) */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

const router = new VueRouter({
  mode: 'history',
  // 基路径 例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 "/app/"
  base: '/',
  routes
});

/* 检查是否存在此路由 */
function isExistPath(path, routers) {
  for (let item of routers) {
    let flag = loopPath(path, item);
    if (flag) {
      return flag;
    }
  }
  return false;
}
function loopPath(path, item) {
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

// 路由守卫
router.beforeEach((to, from, next) => {
  // let token = localStorage.getItem('current_login_user_token') || '';
  let token = '213213';
  if (!token && to.fullPath !== '/login') {
    next('/login');
    return;
  }
  // 是否存在访问路由--404页面跳转至首页
  if (!isExistPath(to.path, routes)) {
    let _path = token ? '/home' : '/login';
    next(_path);
    return;
  }
  // 是否有权限访问--无权限页面跳转至首页
  let userRole = store.state.userInfo.userInfo.role || '普通用户';
  let pageHomePath = '/home';
  if (!to.meta.authority.includes(userRole)) {
    next(pageHomePath);
    return;
  }
  next();
})

export default router;
