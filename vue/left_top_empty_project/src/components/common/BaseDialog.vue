<template>
  <el-dialog :title="title"
             :visible.sync="show"
             width="30%"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             @before-close="$emit('dialogClose')"
             :custom-class="`base-dailog-container ${!!show ? 'dialog-show' : ''}`">
    <slot></slot>
    <span slot="footer">
      <slot name="dialogFooter"></slot>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    nodeId: {
      type: Number,
      default: 0
    }
  },
  watch: {
    nodeId: function (val) {
      this.show = !!val;
    }
  },
  data() {
    return {
      show: false
    }
  },
  methods: {},
  created() { },
  mounted() { }
}
</script>

