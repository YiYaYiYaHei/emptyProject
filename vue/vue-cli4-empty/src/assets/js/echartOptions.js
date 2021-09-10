const tooltipStyle = {
  backgroundColor: '#C9D2FF',
  transitionDuration: 0.5,
  textStyle: {
    color: '#10101D',
    fontSize: 12
  },
  borderColor: 'transparent'
};
const xAxis = {
  name: '时间',
  // 设置横坐标name位置
  nameLocation: 'end',
  // 设置横坐标name样式
  nameTextStyle: {
    color: '#c9d2ff'
  },
  type: 'category',
  // 坐标轴刻度标签
  axisLabel: {
    color: '#c9d2ff',
    fontSize: 10
  },
  // 坐标轴在 grid 区域中的分隔线。
  splitLine: {
    show: true,
    lineStyle: {
      color: '#262e54',
      width: 0.7,
      type: 'solid'
    }
  },
  // 坐标轴轴线
  axisLine: {
    lineStyle: {
      color: '#262e54'
    }
  },
  data: []
};
const yAxis = {
  name: '数量',
  // 设置纵坐标name位置
  nameLocation: 'end',
  // 设置纵坐标name样式
  nameTextStyle: {
    color: '#c9d2ff',
    // padding 可以更改name位置[上、右、下、左]
    padding: [0, 0, 0, -20]
  },
  type: 'value',
  min: 0,
  // 坐标轴轴线
  axisLine: {
    lineStyle: {
      color: '#262e54'
    }
  },
  // 坐标轴刻度标签
  axisLabel: {
    color: '#c9d2ff'
  },
  // 坐标轴在 grid 区域中的分隔线。
  splitLine: {
    lineStyle: {
      color: '#262e54',
      width: 0.7,
      type: 'solid'
    }
  }
};

const PIE = {
  // 直角坐标系区域位置
  grid: {
    top: 10,
    bottom: 10,
    left: 20,
    right: 10
  },
  // 滑上tooltip
  tooltip: Object.assign({}, tooltipStyle, {
    trigger: 'item',
    // example: item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`);
    formatter: (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`)
  }),
  // 图例（左上角各区域颜色说明）
  legend: {
    orient: 'vertical',
    left: 'left',
    // 可滚动翻页的图例。当图例数量较多时可以使用
    type: 'scroll',
    textStyle: {
      color: '#fff'
    }
  },
  color: ['#fd4261', '#ff9626', '#c5b43a', '#3ed88f', '#3bc1c4'],
  series: [{
    name: '饼状图',
    type: 'pie',
    // 最小角度
    minAngle: 15,
    // 圆心位置
    center: ['50%', '60%'],
    // radius为数组-空心圆
    radius: '50%',
    data: [],
    // 饼图图形上的文本标签
    label: {
      show: true,
      position: 'outside',
      color: '#fff',
      fontStyle: 'normal',
      fontFamily: 'Microsoft YaHei',
      // formatter若是函数需要动态设置PIE.option.series[0].label.formatter = (val) => `${val.name}：${val.value}`才会生效
      formatter: '{b}：{d}'
    },
    // 饼图图形上的文本标签 引导线
    labelLine: {
      show: true,
      length: 8
    },
    // 高亮状态的扇区和标签样式
    emphasis: {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(0, 0, 0, 0.5)'
      }
    }
  }]
};

const LINE = {
  // 直角坐标系区域位置
  grid: {
    top: 30,
    bottom: 10,
    left: 20,
    right: 40,
    // grid 区域是否包含坐标轴的刻度标签。
    containLabel: true
  },
  // 滑上tooltip
  tooltip: Object.assign({}, tooltipStyle, {
    trigger: 'axis',
    // example: item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`);
    formatter: (params) => (`<p>${params[0].seriesName}</p>${params[0].marker}${params[0].name}：${params[0].value}`),
    // 展示tooltip的同时横纵坐标轴是否展示提示
    axisPointer: {
      type: 'cross'
    }
  }),
  xAxis: Object.assign({}, xAxis, {
    // 坐标轴两边留白策略
    boundaryGap: true
  }),
  yAxis: Object.assign({}, yAxis, {}),
  series: [{
    name: '折线图',
    type: 'line',
    // 线条样式
    lineStyle: {
      color: '#ff8800'
    },
    data: []
  }]
};

const BAR = {
  // 直角坐标系区域位置
  grid: {
    top: 30,
    bottom: 10,
    left: 20,
    right: 40,
    // grid 区域是否包含坐标轴的刻度标签。
    containLabel: true
  },
  // 滑上tooltip
  tooltip: Object.assign({}, tooltipStyle, {
    trigger: 'item',
    // example: item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`);
    formatter: (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`)
  }),
  xAxis: Object.assign({}, xAxis, {name: '名称'}),
  yAxis: Object.assign({}, yAxis, {}),
  series: [{
    name: '柱状图',
    type: 'bar',
    // 柱条的最小宽度
    barMinWidth: 10,
    // 柱条的最大宽度
    barMaxWidth: 20,
    showBackground: true,
    backgroundStyle: {
      color: 'rgba(180, 180, 180, 0.2)'
    },
    data: []
  }]
};

// 地图-源 指向 目的
const mapPL = {

};

export {
  PIE,
  LINE,
  BAR,
  mapPL
};
