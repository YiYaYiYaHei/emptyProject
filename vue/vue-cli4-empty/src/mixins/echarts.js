import * as echarts from 'echarts';

export default {
  data() {
    return {
      chartList: [],
      resizeFunctionList: []
    };
  },
  methods: {
    initChartList(chartList = this.chartList) {
      if (!chartList.length) {
        this.$message.warning('chartList为空');
        return;
      }
      this.$nextTick(() => {
        chartList.map(it => {
          // 获取chart数据
          this.getChartData(it);
        });
      });
    },
    initChart(idName) {
      const dom = document.getElementById(idName);
      if (!dom) return;
      return echarts.init(dom);
    },
    async getChartData(config) {
      if (!config.requestApi) {
        this.$message.warning('requestApi为空');
        return;
      }
      config.isLoading = true;
      const res = await config.requestApi(config.params);
      config.isLoading = false;
      if (res.status === 200) {
        config.isEmpty = this.$tools.dataIsEmpty(res.data);
        if (config.isEmpty) return;
        if (config.chart) {
          config.chart.clear();
        } else {
          // 初始化chart
          config.chart = this.initChart(config.id);
        }
        typeof config.successCb === 'function' ? config.successCb(config, res.data) : config.option.series[0].data = res.data;
        config.chart.setOption(config.option);
        // chart绑定resize事件
        !config.isEmpty && this.bindChartResizeEvt(config.chart.resize);
      } else {
        this.$message.error(res.message);
        config.isEmpty = true;
      }
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
  mounted() {
    this.initChartList();
  },
  beforeDestroy() {
    this.removeResizeHandler();
  }
};
