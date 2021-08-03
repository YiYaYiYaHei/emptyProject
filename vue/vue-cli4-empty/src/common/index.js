/**
 * 过滤器、指令、原型、组件全局注册
 */
import {getModules} from '../utils/tools.js';
import Filters from './filters.js';

export default {
  install(Vue) {
    this.registerFilter(Vue);
    this.registerDirective(Vue);
    this.registerPrototype(Vue);
    this.registerComponents(Vue);
  },

  registerFilter(Vue) {
    for (const name in Filters) {
      if (Object.prototype.hasOwnProperty.call(Filters, name)) {
        /* 注册过滤器 */
        Vue.filter(name, Filters[name]);
      }
    }
  },

  registerDirective(Vue) {
    const Directives = getModules('directives');
    for (const name in Directives) {
      if (Object.prototype.hasOwnProperty.call(Directives, name)) {
        /* 注册指令 */
        Vue.directive(name.toLowerCase(), Directives[name]);
      }
    }
  },

  registerPrototype(Vue) {
    const Prototypes = Object.assign({apis: getModules('apis')}, getModules('prototype'));
    for (const name in Prototypes) {
      if (Object.prototype.hasOwnProperty.call(Prototypes, name)) {
        /* 将方法挂载在原型上 */
        Vue.prototype['$' + name] = Prototypes[name];
      }
    }
  },

  registerComponents(Vue) {
    const Components = getModules('components');
    for (const name in Components) {
      if (Object.prototype.hasOwnProperty.call(Components, name)) {
        // 生成组件名：comp-name格式
        const key = name.replace(/[A-Z]/g, (char, index) => {
          let res = char.toLowerCase();
          res = index > 0 ? `-${res}` : res;
          return res;
        });
        /* 注册组件 */
        Vue.component(key, Components[name]);
      }
    }
  }
};
