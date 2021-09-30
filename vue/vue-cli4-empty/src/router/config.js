const NoRightOrPermission = () => {
  return import( /* webpackChunkName: "NoRightOrPermission" */ '@/Layout/NoRightOrPermission.vue');
}
const Login = () => {
  return import( /* webpackChunkName: "Login" */ '@/Layout/Login.vue');
}

// 菜单配置
const MENU_CONFIG = {
  type: 'leftTop',
  isFork: true
};

// 页面权限配置--若authority为空数组，表示任何角色都无权查看
const pageUserAdmin = {
  authority: ['管理员']
}
const PAGE_USER_All = {
  authority: ['管理员', '普通用户']
};

// router-view
const EMPTY_PATH = 'RouterViewPage.vue';

/**
 * 路由配置--0表示非导航路由，1/2/3表示一/二/三级菜单
 * [菜单级别, 菜单名称, 路由地址, 组件, {layout: '布局方式', iconCls: 'icon类名', redirect: '重定向路由地址', isHidden: '是否隐藏(true隐藏)', authority: ['权限']}]
 */
const ROUTES_LIST = [
  [0, '无权限页面', '/nopermission', NoRightOrPermission, {layout: 'blank-layout'}],
  [0, '页面不存在', '/noright', NoRightOrPermission, {layout: 'blank-layout'}],
  [0, '登录', '/login', Login, {layout: 'blank-layout'}],
  // 导航配置
  [1, '首页', '/home', 'Home/Index.vue', {iconCls: 'el-icon-s-home'}],
  [1, '商品管理', '/goods', EMPTY_PATH, {iconCls: 'el-icon-s-grid', redirect: '/goods/create'}, [
    [2, '商品创建', 'create', 'GoodsManage/GoodsCreate.vue', {iconCls: 'el-icon-shopping-bag-1'}],
    [2, '商品列表', 'list', 'GoodsManage/GoodsList.vue', {iconCls: 'el-icon-present'}, [
      [3, '商品详情', 'detail/:id', 'GoodsManage/GoodsList/Detail.vue', {isHidden: true}],
      [3, '商品简介', 'introduce/:id', 'GoodsManage/GoodsList/Introduce.vue', {isHidden: true}]
    ]]
  ]],
  [1, '订单管理', '/order', EMPTY_PATH, {iconCls: 'el-icon-s-data', redirect: '/order/create'}, [
    [2, '订单创建', 'create', 'OrderManage/OrderCreate.vue', {...pageUserAdmin, iconCls: 'el-icon-s-open'}],
    [2, '订单列表', 'list', 'OrderManage/OrderList.vue', {iconCls: 'el-icon-tickets'}],
  ]],
  [1, '物流管理', '/logistics', 'LogisticsManage/Index', {iconCls: 'el-icon-takeaway-box', redirect: '/logistics/overview'}, [
    [2, '物流概览', 'overview', 'LogisticsManage/Overview.vue', {...pageUserAdmin, iconCls: 'el-icon-data-line'}],
    [2, '物流配置', 'setting', EMPTY_PATH, {iconCls: 'el-icon-setting'}, [
      [3, '物流公司', 'company', 'LogisticsManage/LogisticsSetting/Company.vue', {}],
      [3, '渠道配置', 'channel', 'LogisticsManage/LogisticsSetting/Channel.vue', {}]
    ]],
  ]],
  [1, '系统管理', '/system', EMPTY_PATH, {iconCls: 'el-icon-coin', redirect: '/system/user'}, [
    [2, '用户管理', 'user', 'SystemManage/UserManage.vue', {...pageUserAdmin, iconCls: 'el-icon-user'}],
    [2, '系统日志', 'log', 'SystemManage/SystemLog.vue', {iconCls: 'el-icon-notebook-1'}]
  ]]
];

export {
  MENU_CONFIG,
  PAGE_USER_All,
  EMPTY_PATH,
  ROUTES_LIST
};