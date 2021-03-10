/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
import { MENU_LIST } from "./config.js";

const Login = () => {
  return import( /* webpackChunkName: "Login" */ '@/components/common/Login.vue');
}
const RouterViewPage = () => {
  return import( /* webpackChunkName: "RouterViewPage" */ '@/components/common/RouterViewPage.vue');
}

const routes = [{
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
    meta: {
      layout: 'blank-layout'
    }
  },

  ...createRoute(MENU_LIST)
];

/* 创建菜单路由 */
function createRoute(menuList) {
  let routeList = [];
  menuList.forEach(item => {
    let _component = !!item.file ? resolve => require([`@/pages/${item.file}`], resolve) : RouterViewPage,
      _children = !!item.children && !!item.children.length ? createRoute(item.children) : [];
    routeList.push({
      path: item.path || '',
      name: item.label || '',
      meta: item.meta || {},
      component: _component,
      children: _children,
      redirect: item.redirect
    })
  })
  return routeList;
}
export default routes;
