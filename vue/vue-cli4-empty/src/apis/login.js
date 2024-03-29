import * as ajax from '@/utils/request';
export default {
  login: params => ajax.post('/login', params),
  logout: params => ajax.get('/logout', params),
  checkOldPwd: params => ajax.post('/checkOldPwd', params),
  checkUserName: params => ajax.post('/checkUserName', params),
  editUserPwd: params => ajax.post('/editUserPwd', params)
};
