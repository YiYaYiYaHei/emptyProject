let BASE_URL = '/apis';

const env = process.env.NODE_ENV.trim();
switch (env) {
  case 'production':
    /* 生产环境 */
    BASE_URL = '/apis';
    break;
  case 'test':
    /* 测试环境 */
    BASE_URL = '/apis_test';
    break;
}

export {
  BASE_URL
};
