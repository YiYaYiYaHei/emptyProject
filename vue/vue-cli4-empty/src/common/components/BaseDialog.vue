<template>
  <el-dialog :width="width"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :append-to-body="true"
             :before-close="dialogClose"
             :custom-class="`base-dailog-container${visible ? ' base-dialog-show' : ''}`">
    <template #title>
      <base-text :text="title" class="el-dialog__title" ref="baseText"></base-text>
    </template>
    <div v-if="tips" class="full tc">{{tips}}</div>
    <slot></slot>
    <template v-if="hasFooter" #footer>
      <el-button type="primary" @click="$emit('dialogConfirm')">确 定</el-button>
      <el-button type="info" @click="dialogClose">取 消</el-button>
    </template>
    <template v-else #footer>
      <slot name="dialogFooter"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'BaseDialog',
  props: {
    width: {
      type: String,
      default: () => {
        return document.body.clientWidth <= 1440 ? '40%' : '30%';
      }
    },
    title: {
      type: String,
      default: ''
    },
    dialogId: {
      type: Number,
      default: 0
    },
    tips: {
      type: String,
      default: ''
    },
    hasFooter: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      dialogLoading: null
    };
  },
  watch: {
    dialogId(val) {
      this.visible = !!val;
      // 标题超出...同时显示tooltip
      this.visible && this.$nextTick(() => this.$refs.baseText && this.$refs.baseText.getShowTooltip());
    }
  },
  methods: {
    // 开启加载框
    openLoading(className = '.base-dailog-container.base-dialog-show') {
      // 防止目标元素还未渲染完成而导致添加到body上
      this.$nextTick(() => {
        this.dialogLoading = this.$loading({
          lock: true,
          text: '',
          spinner: '',
          background: 'rgba(255, 255, 255, 0.9)',
          target: className,
          customClass: 'loading'
        });
      });
    },
    // 关闭加载框
    closeLoading() {
      this.dialogLoading.close();
    },
    // 关闭弹框
    dialogClose() {
      this.$emit('update:dialogId', 0);
      // 作表单重置等操作
      this.$emit('dialogClose');
    }
  }
};
</script>
