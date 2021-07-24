<template>
  <div class="menu-top-container wfull dflex fai">
    <!-- 系统logo -->
    <div class="system-logo-box transition" :style="{'width': menuIsFork ? '60px' : '240px'}">
      <img class="system-logo" :src="logoSrc" height="35" width="147"/>
    </div>
    <!-- 导航折叠icon -->
    <template v-if="menuHasFork">
      <span class="fork-icon pointer" :class="{'el-icon-s-fold': !this.menuIsFork, 'el-icon-s-unfold': this.menuIsFork}" @click="menuForkEvt"></span>
    </template>

    <!-- 水平菜单 -->
    <template v-if="topMenuList.length">
      <el-menu router
               mode="horizontal"
               :default-active="activeIndex"
               class="full">
        <menu-item :menuList="leftMenuList"></menu-item>
      </el-menu>
    </template>

    <!-- 用户操作 -->
    <div class="user-info-box">
      <el-popover placement="top-end" width="140" trigger="click" :visible-arrow="false" popper-class="user-operator-popover">
        <div class="logout-container pointer">
          <span class="logout-img"></span>
          <span class="logout">退出</span>
        </div>
        <div slot="reference" class="pointer">
          <span class="user-img"></span>
          <span class="user-name ellipsis">{{userInfo.userName || 'admin'}}</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem';
import {MENU_CONFIG} from '@/router/config.js';

export default {
  name: 'MenuTop',
  components: {MenuItem},
  props: {
    topMenuList: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      logoSrc: require('@a/images/common/logo.png'),
      menuHasFork: MENU_CONFIG.isFork,
      menuIsFork: false
    };
  },
  methods: {
    // 导航折叠操作
    menuForkEvt() {
      this.menuIsFork = !this.menuIsFork;
      this.$emit('menuIsForkEvt', this.menuIsFork);
    }
  }
};
</script>

<style lang="less" scoped>
.menu-top-container {
  height: @menuTopHeight;
  background: @bg-base;
  .fork-icon {
    .w(32px);
    color: white;
    .fs(24px);
  }
}
/deep/.system-logo-box {
  .mdflex(row, center, center, nowrap);
  width: @menuLeftWidth;
  .hfull();
  background: @bg-base;
  overflow: hidden;
}
</style>
