// 通用的枚举类型
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

export default Dict;