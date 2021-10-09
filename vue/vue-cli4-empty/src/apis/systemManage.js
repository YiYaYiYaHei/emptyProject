import * as ajax from '@/utils/request';
export default {
  getUserTableList: params => ajax.post('/user/table/list', params),
  deleteUser: params => ajax.del(`/user/delete/${params}`),
  addOrEditUser: params => ajax.post('/user/addOrEdit', params),
  getSystemLog: params => ajax.post('/system/log', params)
};
