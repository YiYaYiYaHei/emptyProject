/**
 * 拿到指定路径下面的模块，减少index.js文件 require.context - dir reg 不能用变量（注意：export default 才可以被引入）
 * @param {string} name
 * @return {Object}
 */
const getModules = (name) => {
  let modulesFiles;
  switch (name) {
    case 'directives':
      modulesFiles = require.context('@/common/directives/', true, /^.+(?<!index)\.js$/);
      break;
    case 'components':
      modulesFiles = require.context('@/common/components/', true, /^.+(?<!index)\.(js|vue)$/);
      break;
    case 'mixins':
      modulesFiles = require.context('@/mixins/', true, /^.+(?<!index)\.(js|vue)$/);
      break;
    case 'apis':
      modulesFiles = require.context('@/apis/', true, /^.+(?<!url.config)\.js$/);
      break;
    case 'prototype':
      modulesFiles = require.context('@/utils/', true, /^.+(?<!request)\.(js|vue)$/);
      break;
  }
  return modulesFiles.keys().reduce((modules, modulePath) => {
    const moduleName = modulePath.replace(/^\.\/(.+)\.(js|vue)$/, '$1');
    const value = modulesFiles(modulePath);
    value.default && (modules[moduleName] = value.default);
    return modules;
  }, {});
};

export {
  getModules
};

export default {

};
