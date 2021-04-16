/**
 * @param label                    菜单项名称
 * @param icon                     菜单项图标className
 * @param path                     菜单项路由
 * @param children                 菜单项子菜单
 * @param file                     菜单项文件路径
 * @param hidden                   是否影藏
 * @param redirect                 路由重定向
 * @param assembleChildren         是否需要手动组装children：true-不需要
 */
const MENU_LIST = [{
  label: '首页',
  icon: 'home-icon',
  path: "/home",
  children: [],
  file: 'home/Index.vue'
}, {
  label: '威胁中心',
  icon: 'evidence-icon',
  path: "",
  file: 'threaten/Index.vue',
  children: [{
    label: '威胁总览',
    path: '/threaten/list',
    icon: '&#xe6f9;',
    file: 'threaten/tpl/ThreatenList.vue'
  }, {
    label: '威胁事件',
    path: '/threaten/event',
    icon: '&#xe6f9;',
    file: 'threaten/tpl/ThreatenEvent.vue'
  }]
}, {
  label: '风险追朔',
  icon: 'evidence-icon',
  path: "",
  file: 'risk/Index.vue',
  children: [{
    label: '风险追朔1',
    icon: '',
    path: '',
    file: '',
    children: [{
      label: '风险追朔1-1',
      icon: '',
      path: '/risk/a/a',
      file: 'risk/tpl/List1',
      children: []
    }]
  }, {
    label: '风险追朔2',
    icon: '',
    path: '',
    file: '',
    children: [{
      label: '风险追朔2-1',
      icon: '',
      path: '/risk/b/a',
      file: 'risk/tpl/List2'
    }]
  }]
}, {
  label: '资产管理',
  icon: 'evidence-icon',
  path: "",
  file: 'resource/Index.vue',
  children: [{
    label: '资产',
    path: "",
    children: [{
      label: '资产列表',
      path: "/resource/a/list",
      file: 'resource/tpl/ResourceList.vue'
    }, {
      label: '资产详情',
      path: "/resource/a/detail",
      file: 'resource/tpl/ResourceDetail.vue',
      hidden: true,
    }]
  }, {
    label: '资产设置',
    path: "/resource/config",
    file: 'resource/tpl/ResourceConfig.vue'
  }, {
    label: '资产组',
    path: "",
    children: [{
      label: '资产组详情',
      path: "/resource/b/gdetail",
      file: 'resource/tpl/ResourceGDetail.vue'
    }]
  }]
}]

export {
  MENU_LIST
}
