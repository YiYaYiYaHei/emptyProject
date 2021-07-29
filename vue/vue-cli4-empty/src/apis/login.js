import * as ajax from '@/utils/request';
export default {
  login: params => ajax.post('/login', params),
  fileUpload: (params, requestConfig) => ajax.post('/file/upload', params, requestConfig),
  fileDownload: '/download'
};
