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
import {PIE, LINE, BAR, MAP, MAP1, MAP2, MAP_P, MAP_PL, PIE_POLY, PIE_BG} from '@a/js/echartOptions.js';
import '@a/js/map/js/china.js';
import {areaCoordMap} from '@a/js/map/longAndLat.js';

export default {
  name: 'Home',
  mixins: [mixins.echarts],
  data() {
    return {
      chartList: [
        {id: 'pie', chart: null, isLoading: false, requestApi: this.$apis.home.getPieChartData, params: null, option: JSON.parse(JSON.stringify(PIE)), successCb: this.drawPie, cls: 'pd10'},
        {id: 'pie1', chart: null, isLoading: false, requestApi: this.$apis.home.getPieChartData, params: null, option: JSON.parse(JSON.stringify(PIE_POLY)), successCb: this.drawPiePoly, cls: 'pd10'},
        {id: 'pie2', chart: null, isLoading: false, requestApi: this.$apis.home.getPieChartData, params: null, option: JSON.parse(JSON.stringify(PIE_BG)), successCb: this.drawPieBg, cls: 'pd10'},
        {id: 'line', chart: null, isLoading: false, requestApi: this.$apis.home.getLineChartData, params: null, option: JSON.parse(JSON.stringify(LINE)), successCb: this.drawLine, cls: 'pd10', pCls: 'w5'},
        {id: 'bar', chart: null, isLoading: false, requestApi: this.$apis.home.getPieBarData, params: null, option: JSON.parse(JSON.stringify(BAR)), successCb: this.drawBar, cls: 'pd10', pCls: 'w5'},
        {id: 'map', chart: null, isLoading: false, requestApi: this.$apis.home.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP)), successCb: this.drawMap, cls: 'pd10', pCls: 'w5'},
        {id: 'map1', chart: null, isLoading: false, requestApi: this.$apis.home.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP1)), successCb: this.drawMap, cls: 'pd10', pCls: 'w5'},
        {id: 'map2', chart: null, isLoading: false, requestApi: this.$apis.home.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP2)), successCb: this.drawMap, cls: 'pd10', pCls: 'w5'},
        {id: 'mapP', chart: null, isLoading: false, requestApi: this.$apis.home.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP_P)), successCb: this.drawMapP, cls: 'pd10', pCls: 'w5'},
        {id: 'mapPL', chart: null, isLoading: false, requestApi: this.$apis.home.getMapData, params: null, option: JSON.parse(JSON.stringify(MAP_PL)), successCb: this.drawMAPPL, cls: 'pd10', pCls: 'wfull mgb0'}
      ]
    };
  },
  methods: {
    // 绘制饼状图
    drawPie(item, data) {
      item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}（${params.percent}%）`);
      item.option.series[0].data = data;
    },
    // 绘制五环图
    drawPiePoly(item, data) {
      const colorList = {
        电脑数码: '#8841c5',
        日用百货: '#be9ddb',
        个护清洁: '#12a2e1',
        图书影像: '#6ae4f8',
        家具厨具: '#d96b21',
        其他: '#262e54'
      };
      item.option.tooltip.formatter = (params) => {
        const nameList = params.seriesName.split(' ');
        return `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${colorList[nameList[0]]}"></span>${params.seriesName}`;
      };
      const total = data.reduce((init, current) => init + current.value, 0);
      item.option.series.map(it => {
        const seriesData = [];
        const obj = data.find(item => item.name === it.name) || {value: 0};
        // 图例，也可以使用div然后定位过去。由于图例项的名称，应等于某系列的name值（如果是饼图，也可以是饼图单个数据的 name），所以这里直接将name处理“电脑数码 164（13%）”这种格式
        const name = `${it.name} ${obj.value}（${total ? ((obj.value / total) * 100).toFixed(2) : 0}%）`;

        // itemStyle是因为直接在series中写color会导致部分环颜色不对  https://blog.51cto.com/u_11871779/2385888
        seriesData.push({name, value: obj.value, itemStyle: {color: colorList[it.name]}});
        seriesData.push({name: '', value: total - obj.value, itemStyle: {color: colorList['其他']}});

        it.name = name;
        it.data = seriesData;
      });
    },
    // 绘制带有背景图的南丁格尔玫瑰图
    drawPieBg(item, data) {
      item.option.tooltip.formatter = (params) => (params.name ? `<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}（${params.percent}%）` : '');
      item.option.series[1].data = data;
      console.log(item, data);
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
