import * as ajax from '@/utils/request';
export default {
  fileUpload: (params, requestConfig) => ajax.post('/upload', params, requestConfig),
  fileDownload: '',
  fileDownloadAsync: '/download',
  getTableList: params => ajax.post('/table/list', params),
  getTableDetail: params => ajax.post('/table/detail', params),
  getPieChartData: params => ajax.post('/chart/pie', params),
  getLineChartData: params => ajax.post('/chart/line', params),
  getPieBarData: params => ajax.post('/chart/bar', params),
  getMapData: params => ajax.post('/chart/map', params),

  treeList: () => ajax.get('/tree/list')
};
