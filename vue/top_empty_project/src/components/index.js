/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/10
 *********************************************************************/

import * as Filter from "./filter";
import * as Directive from "./directive";
import * as Components from "./components";
import * as Prototypes from "./prototype";

export default {
  install(Vue) {
    this.registerFilter(Vue);
    this.registerDirective(Vue);
    this.registerPrototype(Vue);
    this.registerComponents(Vue);
  },

  registerFilter(Vue) {
    let Filters = Filter;
    for (let name in Filters) {
      if (Filters.hasOwnProperty(name)) {
        /* 注册过滤器 */
        Vue.filter(name, Filters[name]);
      }
    }
  },

  registerDirective(Vue) {
    let Directives = Directive;
    for (let name in Directives) {
      if (Directives.hasOwnProperty(name)) {
        /* 注册指令 */
        Vue.directive(name.toLowerCase(), Directives[name]);
      }
    }
  },

  registerPrototype(Vue) {
    let prototypes = Prototypes;
    for (let name in prototypes) {
      if (prototypes.hasOwnProperty(name)) {
        /* 将方法挂载在原型上 */
        Vue.prototype["$" + name] = prototypes[name];
      }
    }
  },

  registerComponents(Vue) {
    let Comps = Components;
    for (let name in Comps) {
      if (Comps.hasOwnProperty(name)) {
        /* 生成组件key */
        let key = name.replace(/[A-Z]/g, (char, index) => {
          let res = char.toLowerCase();
          res = index > 0 ? `-${res}` : res;
          return res;
        });

        /* 注册组件 */
        Vue.component(key, Comps[name]);
      }
    }
  }
};
