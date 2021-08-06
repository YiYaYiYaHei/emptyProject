<template>
  <div class="order-list-container full">
    <div class="echarts-box" id="geoMap"></div>
  </div>
</template>

<script>
import {GEO_MAP} from '@a/js/echartOptions.js';
import echart from '@m/echart';

export default {
  name: 'OrderList',
  mixins: [echart],
  data() {
    return {
      geoMapChart: null
    };
  },
  methods: {
    async drawLine() {
      this.geoMapChart = this.initChart('#geoMap');
      console.log(this.geoMapChart);
      this.geoMapChart.setOption(GEO_MAP);
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.drawLine();
    });
  }
};
</script>

<style lang="less" scoped>
.order-list-container {
  .echarts-box {
    width: 30%;
    height: 300px;

  }
}
</style>
