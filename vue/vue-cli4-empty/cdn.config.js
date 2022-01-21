module.exports = {
  // 是否使用cdn
  useCDN: false,
  // key是'包名', value是静态资源引入后全局的名称 import Vue from 'vue'
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    echarts: 'echarts',
    // 必须是ELEMENT，否则会报‘ElementUI is not defined’
    'element-ui': 'ELEMENT'
  },
  CDN: {
    // CDN链接地址：https://www.jsdelivr.com/
    css: [
      'https://cdn.jsdelivr.net/npm/element-ui@2.15.3/lib/theme-chalk/index.css'
    ],
    js: [
      'https://cdn.jsdelivr.net/npm/vue@2.6.11',
      'https://cdn.jsdelivr.net/npm/vue-router@3.2.0/dist/vue-router.min.js',
      'https://cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
      'https://cdn.jsdelivr.net/npm/echarts@5.2.1/dist/echarts.min.js',
      // 地址得是lib/index.js,使用/lib/element-ui.common.min.js会报module is not defined、ELEMENT is not defined
      'https://cdn.jsdelivr.net/npm/element-ui@2.15.3/lib/index.js',
      'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js'
    ]
  }
};
