import * as echarts from 'echarts';

/**
 * 注意 echarts5.1.2 移除了内置的map数据（原先在nodo_modules/echarts/map文件夹下），这里引用map数据是从4.8版本里移出来的
 * 按需引入地市json @example import '@a/js/map/js/china.js';
 */
export default {
  data() {
    return {
      chartList: [],
      resizeFunctionList: []
    };
  },
  methods: {
    /**
     * 初始化echart页面
     * @param {Array} chartList - echart列表
     * @param {String} item.id - echart容器id，由于可能要使用循环创建dom，使用querySelector获取不到动态创建的dom，所以强制使用id
     * @param {Object | null} item.chart - echart对象
     * @param {Object} item.isLoading - echart对象
     * @param {Function | String} item.requestApi - 接口路径
     * @param {Object | null} item.params - 接口参数
     * @param {Object} item.option - echarts配置项
     * @param {Function} [item.successCb] - 请求成功的回调函数（用于处理echart配置项数据）
     * @example {id: 'pie', chart: null, isLoading: false, requestApi: this.$apis.login.getPieChartData, params: null, option: JSON.parse(JSON.stringify(PIE)), successCb: this.drawPie}
     */
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
    // 初始化echart
    initChart(idName) {
      const dom = document.getElementById(idName);
      if (!dom) return;
      return echarts.init(dom);
    },
    // 获取echart数据
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
    },
    // 创建echarts线性渐变
    creatLinearGradient() {
      return new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: '#f78879'
      },
      {
        offset: 0.5,
        color: '#6af651'
      },
      {
        offset: 1,
        color: '#51b3f6'
      }]);
    }
  },
  mounted() {
    this.initChartList();
  },
  beforeDestroy() {
    this.removeResizeHandler();
  }
};
