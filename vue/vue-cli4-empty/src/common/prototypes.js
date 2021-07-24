import { getModules } from '../utils/tools.js';

/* 引入工具方法 */
import tools from '../utils/tools.js';
/* 引入uni-app工具方法 */
import uniTools from '../utils/uniTools.js';
/* 引入校验方法 */
import validates from '../utils/validates.js';
/* 引入接口请求公用方法 */
const apis = getModules('apis');


export {
  apis,
  tools,
	uniTools,
  validates
};
