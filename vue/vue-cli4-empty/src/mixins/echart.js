import * as echarts from 'echarts';

export default {
  data() {
    return {
      resizeFunctionList: []
    };
  },
  methods: {
    initChart(selector) {
      const dom = document.querySelector(selector);
      if (!dom) return;
      return echarts.init(dom);
    },
    // 绑定resize事件
    bindChartResizeEvt(cb) {
      const resizeCallback = () => {
        try { cb(); } catch (e) {}
      };
      window.addEventListener('resize', resizeCallback);
      this.resizeFunctionList.push(resizeCallback);
    },
    // 移除所有监听的resize方法
    removeResizeHandler() {
      this.resizeFunctionList.map(func => window.removeEventListener('resize', func));
      this.resizeFunctionList = [];
    },
    // 销毁图表实例释放资源
    disposeCharts(chartsList) {
      chartsList.map(item => {
        if (item.chart) {
          echarts.dispose(item.chart);
          item.chart = null;
        }
      });
    }
  },
  beforeDestroy() {
    this.removeResizeHandler();
  }
};
