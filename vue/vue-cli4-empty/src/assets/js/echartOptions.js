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
  data: ['2020-11-11', '2021-01-01']
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

// 饼状图
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
    // example: item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}（${params.percent}%）`);
    formatter: (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}（${params.percent}%）`)
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
    // 饼图图形上的文本标签
    label: {
      show: true,
      position: 'outside',
      color: '#fff',
      fontStyle: 'normal',
      fontFamily: 'Microsoft YaHei',
      // formatter若是函数需要动态设置PIE.option.series[0].label.formatter = (val) => `${val.name}：${val.value}`才会生效
      formatter: '{b}：{d}%'
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
    },
    data: [{name: '高风险', value: 22}]
  }]
};

// 折线图
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
    data: [20, 30]
  }]
};

// 柱状图
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
  xAxis: Object.assign({}, xAxis, {name: '种类'}),
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
    data: [20, 30]
  }]
};

// echarts5.1.2 移除了内置的map数据（原先在nodo_modules/echarts/map文件夹下），这里引用map数据是从4.8版本里移出来的
// map组件
const baseMapConfig = {
  name: '中国地图',
  type: 'map',
  map: 'china',
  // 控制地图鼠标缩放和拖拽
  roam: true,
  // 控制缩放比列
  scaleLimit: {
    min: 1,
    max: 10
  },
  // 地图上显示的字
  label: {
    show: true,
    color: '#fff',
    fontSize: 10
  },
  // 设置地图样式
  itemStyle: {
    areaColor: '#09295b', // 地图区域的颜色
    borderColor: '#00ffff', // 边界线颜色
    borderWidth: 2 // 边际线大小
  },
  // 鼠标滑过样式
  emphasis: {
    // 鼠标滑过区域样式
    itemStyle: {
      areaColor: '#3066ba'
    },
    // 鼠标滑过文本样式
    label: {
      textStyle: {
        color: '#fff'
      }
    }
  },
  left: '10%',
  right: '10%',
  top: '10%',
  bottom: '20%',
  // 自定义地区的名称映射
  nameMap: 'china',
  data: [{name: '新疆', value: 200}]
};
// geo组件  -- 地理坐标系组件用于地图的绘制
const baseMapGeo = {
  zoom: 1,
  map: 'china',
  // 控制地图鼠标缩放和拖拽
  roam: true,
  // 地图区域文本展示
  label: {
    show: true,
    color: 'rgba(138,146,246,0.58)',
    fontSize: 14,
    // 显示城市名
    formatter: '{a}'
  },
  scaleLimit: {
    min: 1,
    max: 8
  },
  // 地图高亮区域样式
  emphasis: {
    // 设置地图区域高亮时的文本颜色
    label: {
      show: true,
      fontWeight: 'bold',
      opacity: 0.54,
      color: 'rgba(138,146,246,0.58)',
      letterSpacing: '12.3px',
      textAlign: 'right'
    },
    itemStyle: {
      areaColor: '#353555',
      // 高亮区域边框-可以设置为线性渐变颜色: item.option.geo.emphasis.itemStyle.borderColor = this.creatLinearGradient();
      borderColor: '',
      borderWidth: 2
    }
  },
  // 地图区域样式
  itemStyle: {
    borderColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1,
    areaColor: '#333354',
    shadowColor: 'rgba(0,0,0,0.13)',
    shadowOffsetX: 0,
    shadowOffsetY: 25,
    label: {
      fontWeight: 'bold',
      opacity: 0.54,
      color: 'rgba(138,146,246,0.58)',
      letterSpacing: '12.3px',
      textAlign: 'right'
    }
  }
};
// 气泡图组件
const baseMapEffectScatter = {
  // 气泡图
  type: 'effectScatter',
  // 使用地理坐标系
  coordinateSystem: 'geo',
  tooltip: Object.assign({}, tooltipStyle, {
    // example: item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`);
    formatter: '{b}'
  }),
  // 气泡上显示的字
  label: {
    show: true,
    color: '#fff',
    fontSize: 12,
    // 气泡上显示的文字内容
    formatter: '',
    position: ['50%', '60%'],
    lineHeight: 20,
    verticalAlign: 'middle',
    align: 'center'
  },
  // 修改气泡标记的图形，本地图片以"image://"开头 -- `image://${require('@a/images/common/domain.png')}`
  symbol: 'arrow',
  symbolSize: 12,
  // 设置气泡样式
  itemStyle: {
    borderColor: '#00ffff', // 边界线颜色
    borderWidth: 1 // 边际线大小
  },
  // 鼠标滑过样式
  emphasis: {
    // 鼠标滑过区域样式
    itemStyle: {
      borderColor: '#00ffff', // 边界线颜色
      borderWidth: 2 // 边际线大小
    }
  },
  // 数据为二维经纬度数组
  data: [{name: '吐鲁番市', value: [89.184078, 42.947613]}]
};
const titleTextStyle = {
  textStyle: {
    color: '#fff',
    fontStyle: 'normal'
  }
};

// 地图
const MAP = {
  title: Object.assign({text: '中国地图'}, titleTextStyle),
  // 滑上tooltip
  tooltip: Object.assign({}, tooltipStyle, {
    trigger: 'item',
    // example: item.option.tooltip.formatter = (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value}`);
    formatter: (params) => (`<p>${params.seriesName}</p>${params.marker}${params.name}：${params.value || 0}`)
  }),
  series: [Object.assign({}, baseMapConfig)]
};

// 地图 - 带文字区间
const MAP1 = Object.assign({}, MAP, {
  // 地图 左下角区间 颜色控制
  dataRange: {
    show: true,
    x: 'left',
    y: 'bottom',
    // splitList控制线与点的颜色，start意思是大于等于，end是小于等于，当满足条件时可以改变颜色
    splitList: [
      {start: 1500, color: '#c5b43a'},
      {start: 1000, end: 1500, color: '#fa9c08'},
      {start: 310, end: 1000, color: '#fc0c38'},
      {start: 200, end: 300, color: '#f1ff0e'},
      {start: 10, end: 200, label: '10 到 200（火灾数量）', color: '#39f60e'},
      {start: 5, end: 5, label: '5（火灾数量）', color: '#d0d0d0'},
      {end: 10, color: '#fd4261'}
    ],
    // 区间文字颜色
    textStyle: {
      color: '#fff'
    }
  }
});

// 地图 - 带滑块区间（根据所选区间，划分地图区域颜色）
const MAP2 = Object.assign({}, MAP, {
  // 根据所选区间，划分地图区域颜色
  visualMap: {
    show: true,
    min: 0,
    max: 5000,
    text: ['High', 'Low'],
    realtime: false,
    calculable: true,
    inRange: {
      color: ['#fd4261', '#d0d0d0', '#39f60e', '#f1ff0e', '#fc0c38', '#fa9c08', '#c5b43a']
    },
    // 区间文字颜色
    textStyle: {
      color: '#fff'
    }
  }
});

// 地图 - 气泡
const MAP_P = {
  title: Object.assign({text: '中国地图'}, titleTextStyle),
  tooltip: Object.assign({}, tooltipStyle),
  // 地图
  geo: Object.assign({}, baseMapGeo),
  series: [Object.assign({}, baseMapEffectScatter)]
};

// 地图 - 起点 指向 终点
const MAP_PL = {
  title: Object.assign({text: '中国地图'}, titleTextStyle),
  tooltip: Object.assign({}, tooltipStyle),
  // 地图
  geo: Object.assign({}, baseMapGeo),
  series: [
    // 起点
    Object.assign({}, baseMapEffectScatter, {
      // 修改气泡标记的图形，本地图片以"image://"开头 -- `image://${require('@a/images/common/domain.png')}`
      symbol: 'circle',
      tooltip: {
        formatter: (params) => `起点：${params.name}`
      },
      itemStyle: {
        color: '#fd4261',
        borderColor: '#00ffff',
        opacity: 0.6
      }
    }),
    // 终点
    Object.assign({}, baseMapEffectScatter, {
      // 修改气泡标记的图形，本地图片以"image://"开头 -- `image://${require('@a/images/common/domain.png')}`
      symbol: `image://${require('@a/images/common/domain.png')}`,
      tooltip: {
        formatter: (params) => `终点：${params.name}`
      }
    }),
    // 地图上的线
    {
      type: 'lines',
      // 使用地理坐标系
      coordinateSystem: 'geo',
      tooltip: Object.assign({}, tooltipStyle, {show: false}),
      // 是否为多端点的连线 -- 若连接多个端点，data里的coords设置多个经纬度即可
      polyline: false,
      // 线两端的标记类型
      symbol: ['circle', `image://${require('@a/images/common/domain.png')}`],
      // 连接线样式
      lineStyle: {
        color: '#00ffff',
        opacity: 0.9,
        width: 2,
        type: 'dotted',
        // 连接线的弧度（仅在polyline为false时有效）；修改方向，可设置为负数
        curveness: -0.3
      },
      progressiveThreshold: 500,
      progressive: 200,
      // 连线数据
      data: [{coords: [[89.184078, 42.947613], [79.92533, 37.110687]]}]
    },
    // 线上移动的点
    {
      type: 'lines',
      // 使用地理坐标系
      coordinateSystem: 'geo',
      tooltip: Object.assign({}, tooltipStyle, {show: false}),
      // 连线是否为多端点的连线 -- 若连接多个端点，data里的coords设置多个经纬度即可
      polyline: false,
      // 线两端的标记类型
      symbol: ['none', 'arrow'],
      // 连接线样式
      lineStyle: {
        color: '#00ffff',
        opacity: 0.9,
        width: 2,
        type: 'dotted',
        // 连接线的弧度（仅在polyline为false时有效）；修改方向，可设置为负数
        curveness: -0.3
      },
      // 线特效的配置
      effect: {
        show: true,
        // 特效动画的时间，单位为 s
        period: 6,
        // 特效图形的标记
        symbol: 'arrow',
        symbolSize: 6,
        // 特效尾迹的长度。取从 0 到 1 的值，数值越大尾迹越长。
        trailLength: 0.6
      },
      progressiveThreshold: 500,
      progressive: 200,
      // 连线数据
      data: [{coords: [[89.184078, 42.947613], [79.92533, 37.110687]]}]
    }
  ]
};

export {
  PIE,
  LINE,
  BAR,
  MAP,
  MAP1,
  MAP2,
  MAP_P,
  MAP_PL
};
