<template>
  <div class="d3-page-container full">
    <ul class="legend-list pointer">
      <li v-for="(item, i) in legendList" :key="`list_${i}`" :data-legend="item.value" :class="item.cls">{{item.label}}</li>
    </ul>

    <svg id="d3-container" class="full"></svg>
  </div>
</template>

<script>
import * as d3Config from './d3Config.js'
import dataConfig from './dataConfig.js'

export default {
  data() {
    return {
      legendList: [
        { label: '关系权重高', value: 'high' },
        { label: '关系权重低', value: 'low' },
        { label: '关系包含黑名单', value: 'blackList' },
        {
          label: '关系任务中包含该对象',
          value: 'contain',
          cls: 'el-icon-star-on'
        }
      ]
    }
  },
  methods: {},
  mounted() {
    this.$nextTick(() => {
      d3Config.initForceSimulation(dataConfig.NODES)
    })
  }
}
</script>

<style lang="less" scoped>
.d3-page-container {
  position: relative;
  .legend-list {
    width: 200px;
    position: absolute;
    left: 20px;
    bottom: 20px;
    font-size: 14px;
    color: #4e6471;
    > li {
      padding-left: 36px;
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 8px;
        width: 30px;
      }
      &[data-legend='high']:before {
        border: 1px solid #ccc;
      }
      &[data-legend='low']:before {
        top: 28px;
        border: 1px dashed #ccc;
      }
      &[data-legend='blackList']:before {
        top: 48px;
        border: 1px solid #f65a4b;
      }
      &[data-legend='contain']:before {
        content: '\e797';
        top: 62px;
        color: #f65a4b;
      }
    }
  }
}
#d3-container {
}
</style>

 