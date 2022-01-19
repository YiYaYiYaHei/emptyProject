// 相关键值对字典
import {getModules} from './tools';
const Apis = getModules('apis');

const Dict = {};

// 任务状态
Dict.taskStatus = [
  {label: '已创建', value: '已创建', status: 'primary'},
  {label: '准备开始', value: '准备开始', status: 'info'},
  {label: '分析中', value: '分析中', status: 'warning'},
  {label: '分析中止', value: '分析中止', status: 'danger'},
  {label: '分析异常', value: '分析异常', status: 'danger'},
  {label: '分析完成', value: '分析完成', status: 'success'}
];

// 任务类型
Dict.taskType = [
  {label: '域名', value: '域名', cls: 'fa fa-internet-explorer'},
  {label: 'IP', value: 'IP', cls: 'fa fa-info'},
  {label: 'URL', value: 'URL', cls: 'fa fa-link'},
  {label: '样本', value: '样本', cls: 'fa fa-bug'},
  {label: '邮箱', value: '邮箱', cls: 'fa fa-envelope'}
];

// 如果枚举列表多个页面都会用到，可以在router/index路由守卫那统一获取/更新枚举列表，这样就不用每个页面都写一遍请求了  if (!/\/(login|relationalAnalysis|tag)$/.test(to.path)) Dict.updateAnalysisModel();
Dict.updateAnalysisModel = async function() {
  try {
    const res = await Apis.taskCenter.getAllModel();
    Dict.analysisModel = res.data;
  } catch (e) {
    Dict.analysisModel = [];
    console.log(e);
  }
};

// 码址等级
Dict.codeLevel = [
  {label: '黑名单', value: 3},
  {label: '白名单', value: 2},
  {label: '灰名单', value: 1}
];

export default Dict;
