// 自动引入mixins文件夹下.js结尾的文件（注意：export default 才可以被引入）
import {getModules} from '../utils/tools.js';
const modules = getModules('mixins');

export default {
  ...modules
};
