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

// 路由守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token') || '';
  if ((!token && to.path !== '/login') || to.path === '/') {
    next('/login');
    return;
  }
  // 是否存在访问路由--404页面（不能通过递归匹配path，递归函数对/goods/list/detail/:id形式的地址不好处理）
  if (!to.matched.length) {
    let _path = token ? '/noright' : '/login';
    next(_path);
    return;
  }
  // 是否有权限访问--无权限页面
  let userRole = store.state.userInfo.userInfo.role || '普通用户';
  let path = '/nopermission';
  if (!to.meta.authority.includes(userRole)) {
    next(path);
    return;
  }
  // 根据用户角色跳转首页：utils/tools/jumpRoute(userRole)
  next();
});

export default router;
