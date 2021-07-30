<template>
  <el-dialog :center="true"
             :loading="isLoading"
             :width="width"
             :visible.sync="visible"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :append-to-body="true"
             @closed="$emit('dialogClose')"
             custom-class="base-dialog-container">
    <template #title>
      <base-text :content="title" class="el-dialog__title"></base-text>
    </template>
    <slot></slot>
    <template v-if="hasFooter" #footer>
      <el-button type="primary" @click="$emit('dialogConfirm')">确 定</el-button>
      <el-button type="info" @click="visible = false">取 消</el-button>
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
    hasFooter: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      isLoading: false
    };
  },
  methods: {
    loadingOpen() {
      this.isLoading = true;
    },
    loadingClose() {
      this.isLoading = false;
    }
  },
  watch: {
    dialogId(val) {
      this.visible = !!val;
    }
  }
};
</script>
