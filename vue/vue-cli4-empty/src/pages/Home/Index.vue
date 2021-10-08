<template>
  <div class="home-container full dflex fjc fw ofa pdr10">
    <div class="chart-box" v-for="(item, i) in chartList" :key="`chart_${i}`" v-loading="item.isLoading" :class="item.pCls">
      <div v-if="!item.isEmpty" :id="item.id" class="full chart" :class="item.cls"></div>
      <div v-else class="full box--empty"></div>
    </div>
  </div>
</template>

<script>
import mixins from '@m';
import {PIE, LINE, BAR, MAP, MAP1, MAP2, MAP_P, MAP_PL} from '@a/js/echartOptions.js';
import '@a/js/map/js/china.js';
import {areaCoordMap} from '@a/js/map/longAndLat.js';
export default {
  name: 'Home',
  mixins: [mixins.echarts],
  data() {
    return {
      chartList: [
        {id: 'pie', chart: null, isLoading: false, requestApi: this.$apis.login.getPieChartData, params: null, option: JSON.parse(JSON.stringify(PIE)), successCb: this.drawPie, cls: 'pd10'},
        {id: 'line', chart: null, isLoading: false, requestApi: this.$apis.login.getLineChartData, params: null, option: JSON.parse(JSON.stringify(LINE)), successCb: this.drawLine, cls: 'pd10'},
        {id: 'bar', chart: null, isLoading: false, requestApi: this.$apis.login.getPieBarData, params: null, option: JSON.parse(JSON.stringify(BAR)), successCb: this.drawBar, cls: 'pd10'},
        {id: 'map', chart: null, isLoading: false, requestApi: this.$apis.login.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP)), successCb: this.drawMap, cls: 'pd10', pCls: 'w5'},
        {id: 'map1', chart: null, isLoading: false, requestApi: this.$apis.login.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP1)), successCb: this.drawMap, cls: 'pd10', pCls: 'w5'},
        {id: 'map2', chart: null, isLoading: false, requestApi: this.$apis.login.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP2)), successCb: this.drawMap, cls: 'pd10', pCls: 'w5'},
        {id: 'mapP', chart: null, isLoading: false, requestApi: this.$apis.login.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP_P)), successCb: this.drawMapP, cls: 'pd10', pCls: 'w5'},
        {id: 'mapPL', chart: null, isLoading: false, requestApi: this.$apis.login.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP_PL)), successCb: this.drawMAPPL, cls: 'pd10', pCls: 'wfull mgb0'}
      ]
    };
  },
  methods: {
    // 绘制饼状图
    drawPie(item, data) {
      item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}（${params.percent}%）`);
      item.option.series[0].data = data;
    },
    // 绘制折线图
    drawLine(item, data) {
      const xAxis = [], seriesData = [];
      data.map(it => {
        xAxis.push(it.name);
        seriesData.push(it.value);
      });
      item.option.xAxis.name = '种类';
      item.option.xAxis.data = xAxis;
      item.option.series[0].data = seriesData;
    },
    // 绘制柱状图
    drawBar(item, data) {
      const xAxis = [], seriesData = [];
      data.map(it => {
        xAxis.push(it.name);
        seriesData.push(it.value);
      });
      item.option.xAxis.data = xAxis;
      item.option.series[0].data = seriesData;
    },
    // 绘制地图
    drawMap(item, data) {
      item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.name}：${params.value || 0}`);
      item.option.series[0].data = data;
    },
    // 绘制地图 - 气泡图
    drawMapP(item, data) {
      const temp = [];
      // 获取经纬度
      data.map(it => {
        temp.push({name: it.name, value: areaCoordMap[it.name]});
        it.coords = areaCoordMap[it.name];
      });
      item.option.series[0].data = temp;
      item.option.geo.emphasis.itemStyle.borderColor = this.creatLinearGradient();
      // 设置气泡图tooltip
      item.option.series[0].tooltip.formatter = (params) => {
        let str = '';
        const obj = data.find(it => JSON.stringify(it.coords) === JSON.stringify(params.value));
        obj && (str = `<p>${obj.name}</p><span>数量：</span><span>${obj.value}</span>`);
        return str;
      };
    },
    // 绘制地图 - 起点指向终点
    drawMAPPL(item, data) {
      const begin = [], end = [], line = [];
      let linePoint = [];
      // 获取经纬度
      data.map((it, i) => {
        if (i % 2 === 0) {
          begin.push({name: it.name, value: areaCoordMap[it.name]});
        } else {
          end.push({name: it.name, value: areaCoordMap[it.name]});
        }
      });
      const minLength = begin.length < end.length ? begin.length : end.length;
      for (let i = 0; i < minLength; i++) {
        line.push({coords: [begin[i].value, end[i].value]});
      }
      linePoint = line;
      // 起点数据
      item.option.series[0].data = begin;
      item.option.series[0].tooltip.formatter = (params) => (`起点：${params.name}`);
      // 终点数据
      item.option.series[1].data = end;
      item.option.series[1].tooltip.formatter = (params) => (`终点：${params.name}`);
      // 连接线数据
      item.option.series[2].data = line;
      // 连接线上移动的点 数据
      item.option.series[3].data = linePoint;

      item.option.geo.emphasis.itemStyle.borderColor = this.creatLinearGradient();
    }
  }
};
</script>

<style lang="less" scoped>
.chart-box {
  flex-shrink: 0;
  width: 32%;
  height: 49%;
  background: @bg-lighter;
  border-radius: 20px;
  margin-bottom: 2%;
  &.w5 {
    .w(49%);
  }
  &.wfull {
    .wfull!important;
  }
  &.mgb0 {
    .mgb0!important;
  }
}
</style>
