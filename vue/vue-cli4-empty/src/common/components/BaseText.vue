<template>
  <el-tooltip class="ellipsis" :disabled="disabled || !isShowTooltip" placement="top">
    <div slot="content" v-html="content || text"></div>
    <p v-html="text || '-'"></p>
  </el-tooltip>
</template>

<script>
/**
 * @example <base-text text="baseText组件content测试测试测试测试试测试测试测试" content="<i style='display: inline-block;width:5px;height:5px;border-radius:50%;background:red;margin-right:8px;'></i>tooltip的content" style="width: 200px"></base-text>
 */
export default {
  name: 'BaseText',
  props: {
    // 文本展示内容
    text: {
      type: String,
      default: ''
    },
    // tooltip显示内容(默认展示text的内容)
    content: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowTooltip: true
    };
  },
  watch: {
    text() {
      this.getShowTooltip();
    }
  },
  methods: {
    // 判断是否展示el-tooltip
    getShowTooltip() {
      this.$nextTick(() => {
        this.isShowTooltip = this.$el.scrollWidth > this.$el.clientWidth;
      });
    }
  },
  mounted() {
    this.getShowTooltip();
    window.addEventListener('resize', this.getShowTooltip);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getShowTooltip);
  }
};
</script>
