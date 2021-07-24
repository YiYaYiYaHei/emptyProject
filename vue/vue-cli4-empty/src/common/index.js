/*********************************************************************
 * 过滤器、指令、原型、组件全局注册
 *********************************************************************/
import { getModules } from '../utils/tools.js';
import * as Filters from "./filters.js";
import * as Prototypes from "./prototypes.js";

export default {
  install(Vue) {
    this.registerFilter(Vue);
    this.registerDirective(Vue);
    this.registerPrototype(Vue);
		this.registerComponents(Vue);
  },

  registerFilter(Vue) {
    for (let name in Filters) {
      if (Filters.hasOwnProperty(name)) {
        /* 注册过滤器 */
        Vue.filter(name, Filters[name]);
      }
    }
  },

  registerDirective(Vue) {
		const Directives = getModules('directives');
    for (let name in Directives) {
      if (Directives.hasOwnProperty(name)) {
        /* 注册指令 */
        Vue.directive(name.toLowerCase(), Directives[name]);
      }
    }
  },

  registerPrototype(Vue) {
    for (let name in Prototypes) {
      if (Prototypes.hasOwnProperty(name)) {
        /* 将方法挂载在原型上 */
        Vue.prototype["$" + name] = Prototypes[name];
      }
    }
  },

	registerComponents(Vue) {
		const Components = getModules('components');
		for (let name in Components) {
			if (Components.hasOwnProperty(name)) {
				// 生成组件名：comp-name格式
				let key = name.replace(/[A-Z]/g, (char, index) => {
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
