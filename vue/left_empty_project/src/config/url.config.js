/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/10
 *********************************************************************/

let BASE_URL = "/apis";

import HomeUrl from './home.url.config.js';

let env = process.env.NODE_ENV.trim();
switch (env) {
  case 'production':
    /* 生产环境 */
    BASE_URL = "/apis";
    break;
  case 'test':
    /* 测试环境 */
    BASE_URL = "/apis_test";
    break;
}

export default {
  BASE_URL,

  ...HomeUrl
}
