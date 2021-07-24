<template>
  <div class="menu-left-container" :style="{'width': menuIsFork ? '60px' : '240px'}">
    <el-menu router
            :default-active="activeIndex"
            :collapse="menuIsFork"
            class="full"
            unique-opened>
      <menu-item :menuList="leftMenuList"></menu-item>
    </el-menu>
  </div>
</template>

<script>
import MenuItem from './MenuItem';
export default {
  name: 'MenuLeft',
  components: {MenuItem},
  props: {
    menuIsFork: {
      type: Boolean,
      default: false
    },
    leftMenuList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      activeIndex: ''
    };
  },
  watch: {
    $route: {
      deep: true,
      handler: function(newVal) {
        this.activeIndex = newVal.fullPath;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.menu-left-container {
  .w(@menuLeftWidth);
  height : calc(~"100% - " @menuTopHeight);
}
// 解决el-menu collapse 卡顿问题
.el-menu:not(.el-menu--collapse) {
  width: @menuLeftWidth;
  height: 100%;
}
</style>
