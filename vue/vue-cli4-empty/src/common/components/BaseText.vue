<template>
  <el-tooltip class="ellipsis" :disabled="disabled || !isShowTooltip" placement="top">
    <div slot="content" v-html="content || '-'"></div>
    <p v-html="content || '-'"></p>
  </el-tooltip>
</template>

<script>
export default {
  name: 'BaseText',
  props: {
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
    content() {
      this.$nextTick(this.getShowTooltip);
    }
  },
  methods: {
    // 判断是否展示el-tooltip
    getShowTooltip() {
      this.isShowTooltip = this.$el.scrollWidth > this.$el.clientWidth;
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
