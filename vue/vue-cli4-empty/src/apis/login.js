import * as ajax from '@/utils/request';
export default {
  login: params => ajax.post('/login', params),
  logout: params => ajax.get('/logout', params),
  checkOldPwd: params => ajax.post('/checkOldPwd', params),
  checkUserName: params => ajax.post('/checkUserName', params),
  editUserPwd: params => ajax.post('/editUserPwd', params),
  fileUpload: (params, requestConfig) => ajax.post('/file/upload', params, requestConfig),
  fileDownload: '/download',
  getTableList: params => ajax.post('/table/list', params),
  getTableDetail: params => ajax.post('/table/detail', params)
};
