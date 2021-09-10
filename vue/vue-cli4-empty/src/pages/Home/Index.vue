<template>
  <div class="home-container full">
    <div class="full dflex fjc fw">
      <div class="chart-box" v-for="(item, i) in chartList" :key="`chart_${i}`" v-loading="item.isLoading" :class="item.pCls">
        <div v-if="!item.isEmpty" :id="item.id" class="full chart" :class="item.cls"></div>
        <div v-else class="full box--empty"></div>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@m';
import {PIE, LINE, BAR, mapPL} from '@a/js/echartOptions.js';
export default {
  name: 'Home',
  mixins: [mixins.echarts],
  data() {
    return {
      chartList: [
        {id: 'pie', chart: null, isLoading: false, requestApi: this.$apis.login.getPieChartData, params: null, option: JSON.parse(JSON.stringify(PIE)), successCb: this.drawPie, cls: 'pd10'},
        {id: 'line', chart: null, isLoading: false, requestApi: this.$apis.login.getLineChartData, params: null, option: JSON.parse(JSON.stringify(LINE)), successCb: this.drawLine, cls: 'pd10'},
        {id: 'bar', chart: null, isLoading: false, requestApi: this.$apis.login.getPieBarData, params: null, option: JSON.parse(JSON.stringify(BAR)), successCb: this.drawBar, cls: 'pd10'},
        {id: 'map', chart: null, isLoading: false, requestApi: this.$apis.login.getPieBarData, params: null, option: JSON.parse(JSON.stringify(mapPL)), successCb: this.drawBar, cls: 'pd10', pCls: 'w5'},
        {id: 'mapPL', chart: null, isLoading: false, requestApi: this.$apis.login.getPieBarData, params: null, option: JSON.parse(JSON.stringify(mapPL)), successCb: this.drawBar, cls: 'pd10', pCls: 'w5'},
        {id: 'mapM', chart: null, isLoading: false, requestApi: this.$apis.login.getPieBarData, params: null, option: JSON.parse(JSON.stringify(mapPL)), successCb: this.drawBar, cls: 'pd10', pCls: 'wfull mgb0'}
      ]
    };
  },
  methods: {
    drawPie(item, data) {
      item.option.series[0].data = data;
    },
    drawLine(item, data) {
      const xAxis = [], seriesData = [];
      data.map(it => {
        xAxis.push(it.time);
        seriesData.push(it.value);
      });
      item.option.xAxis.data = xAxis;
      item.option.series[0].data = seriesData;
    },
    drawBar(item, data) {
      const xAxis = [], seriesData = [];
      data.map(it => {
        xAxis.push(it.name);
        seriesData.push(it.value);
      });
      item.option.xAxis.data = xAxis;
      item.option.series[0].data = seriesData;
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
}
</style>
