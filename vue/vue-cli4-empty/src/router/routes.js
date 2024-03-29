import {EMPTY_PATH, PAGE_USER_All, ROUTES_LIST} from './config.js';

/**
 * 创建路由
 * @param [String] name - 导航中文名
 * @param [String] path - 导航对应的路径
 * @param [String] fullPath - 导航全路径
 * @param [String] [redirect] - 非必填，重定向地址
 * @param [Function] component - 该页面组件
 * @param [Object] meta - 路由云信息 存一些额外的附件数据
 * [Number] meta-level 导航层级，1表示一级导航，依次类推
 * [String] meta-layout 页面布局方式：main-layout：带有导航布局，blank-layout: 空白页面
 * [Boolean] meta-isHidden 是否隐藏（true隐藏）
 * [String] meta-iconCls 表示该导航模块应用的css-class
 * [Array] meta-authority 该页面所属用户权限（['管理员'、'普通用户']）
 */
function createRoute(level, name, path, filePath, meta = {}, children = []) {
  const routeConfig = {
    name,
    path,
    fullPath: path,
    component: getComponent(filePath),
    meta: Object.assign({
      level,
      layout: 'main-layout',
      isHidden: false,
      authority: PAGE_USER_All.authority,
      iconCls: ''
    }, meta)
  };
  meta.redirect && (routeConfig.redirect = meta.redirect);
  if (children.length) {
    routeConfig.children = [];
    for (let item of children) {
      // 设置子页面全路径：参数对应数组下标，path 参数对应下标2，
      !item[2].startsWith('/') && (item[2] = path + `/${item[2]}`);
      // 保证父菜单无权限时，子菜单也无权限，meta 参数对应下标4
      routeConfig.meta.authority.length <= (item[4].authority || PAGE_USER_All.authority).length && (item[4].authority = routeConfig.meta.authority);
      routeConfig.children.push(createRoute(...item));
    }
  }
  return routeConfig;
}

/**
 * 路由懒加载 - 处理异步加载页面组件，传递组件文件路径（必须是相对路径）。
 * 组件路径如果是字面量直接引用就行：() => return import( /* webpackChunkName: "Login" 星号/ '@/components/common/Login.vue');
 *
 * require引用文件（模块），必须是字符串（可以是字符串+变量（路径必须是相对路径）），直接引用字符串变量会报错
 * 方法体中两种引用组件的写法都可以，核心就是require引入，import引入必须是字面量
 * @param [String | Function] filePath - 文件路径
 */
function getComponent(filePath) {
  // 如果filePath不是字符串类型，表示已经是组件，此时无需处理
  if (typeof filePath !== 'string') return filePath;

  if (filePath === EMPTY_PATH) {
    return () => Promise.resolve(require(`@/Layout/${filePath}`).default);
  }
  return resolve => require([`@p/${filePath}`], resolve);
};

const getRoutes = () => {
  const routes = [];
  for(const item of ROUTES_LIST) {
    routes.push(createRoute(...item));
  }
  return routes;
}

export default getRoutes();