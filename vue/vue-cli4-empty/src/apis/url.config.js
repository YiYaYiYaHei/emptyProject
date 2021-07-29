let BASE_URL = '/apis';
let FILE_DOWN = '/file';

const env = process.env.NODE_ENV.trim();
switch (env) {
  case 'production':
    /* 生产环境 */
    BASE_URL = '/apis';
    FILE_DOWN = '/file';
    break;
  case 'test':
    /* 测试环境 */
    BASE_URL = '/apis_test';
    FILE_DOWN = '/file';
    break;
}

export {
  BASE_URL,
  FILE_DOWN
};
