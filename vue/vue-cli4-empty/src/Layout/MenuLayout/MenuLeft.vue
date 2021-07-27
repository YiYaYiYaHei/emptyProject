<template>
  <div class="menu-left-container fl" :style="{'width': menuIsFork ? '60px' : '240px'}">
    <el-menu router
            :default-active="leftActiveIndex"
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
    // 导航是否可折叠
    menuIsFork: {
      type: Boolean,
      default: false
    },
    // 左侧导航列表
    leftMenuList: {
      type: Array,
      default: () => ([])
    },
    // 高亮菜单fullPath
    leftActiveIndex: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="less" scoped>
.menu-left-container {
  .w(@menuLeftWidth);
  .h(calc(~"100% - " @menuTopHeight));
}
// 解决el-menu collapse 卡顿问题
.el-menu:not(.el-menu--collapse) {
  width: @menuLeftWidth;
  height: 100%;
}
</style>
