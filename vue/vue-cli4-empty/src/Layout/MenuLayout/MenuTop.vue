<template>
  <div class="menu-top-container wfull dflex fai fjc" :class="{'menu-top-container--collapse': menuIsFork}">
    <!-- 系统logo -->
    <div class="system-logo-box transition" :style="{'width': menuIsFork ? '60px' : '240px'}">
      <img class="system-logo" :src="logoSrc" height="35" width="147"/>
    </div>
    <!-- 导航折叠icon -->
    <template v-if="menuHasFork">
      <span class="fork-icon pointer el-icon-s-fold" :data-fork-status="menuIsFork" @click="menuForkEvt"></span>
    </template>

    <!-- 水平菜单 -->
    <div class="menu-top-box">
      <el-menu v-if="topMenuList.length"
               :router="menuType==='top'"
               mode="horizontal"
               :default-active="topActiveIndex"
               class="full"
               @select="(index) => $emit('menuTopSelect', index)">
        <menu-item :menuList="topMenuList"></menu-item>
      </el-menu>
    </div>

    <!-- 用户操作 -->
    <div class="user-info-box">
      <el-popover placement="top-end"
                  width="140"
                  trigger="click"
                  popper-class="user-operator-popover"
                  @show="popoverVisiable = true"
                  @hide="popoverVisiable = false">
        <div slot="reference" class="pointer">
          <span class="user-name ellipsis dinlineb">{{userInfo.userName || 'admin'}}</span>
          <i class="user-name-arrow dinlineb el-icon-caret-bottom" :data-arrow-type="popoverVisiable"></i>
        </div>
        <div class="content-container pointer">
          <div>修改密码</div>
          <div>退出登录</div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem';
import user from '@m/user.js';
import {MENU_CONFIG} from '@/router/config.js';

export default {
  name: 'MenuTop',
  mixins: [user],
  components: {MenuItem},
  props: {
    // 顶部导航列表
    topMenuList: {
      type: Array,
      default: () => ([])
    },
    // 顶部高亮导航fullPath
    topActiveIndex: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      logoSrc: require('@a/images/common/logo.png'),
      menuHasFork: MENU_CONFIG.isFork,
      menuType: MENU_CONFIG.type,
      menuIsFork: this.$store.state.menuFork,
      popoverVisiable: false
    };
  },
  methods: {
    // 导航折叠操作
    menuForkEvt() {
      this.menuIsFork = !this.menuIsFork;
      this.$store.dispatch('setMenuFork', this.menuIsFork);
      setTimeout(() => {
        this.$store.dispatch('resetStore', this.menuIsFork);
      }, 5000);
      this.$emit('menuIsForkEvt', this.menuIsFork);
    }
  }
};
</script>

<style lang="less" scoped>
.menu-top-container {
  height: @menuTopHeight;
  background: @bg-base;
  .pdr20();
  .fork-icon {
    color: white;
    .fs(24px);
    .transition();
    &[data-fork-status="true"] {
      transform: rotate(180deg);
    }
  }
  &.menu-top-container--collapse {
    .menu-top-box {
      .w(calc(~"100% - 20px - " @menuLeftForkWidth));
    }
  }
}
.system-logo-box {
  .mdflex(row, center, center, nowrap);
  flex-shrink: 0;
  width: @menuLeftWidth;
  .hfull();
  background: @bg-base;
  overflow: hidden;
}
.menu-top-box {
  .w(calc(~"100% - 20px - " @menuLeftWidth));
  .hfull();
  .pd(0, 20, 0, 20);
  /deep/.el-submenu__icon-arrow {
    right: 10px;
  }
  /deep/.menu-item-container {
    .dflex();
    .hfull();
    .el-menu-item,
    .el-submenu > div  {
      .hfull();
    }
  }
}
.user-info-box {
  position: relative;
  .mgl20();
  .pdr20();
  .line-height(@menuTopHeight);
  color: white;
  .fs16();
  .user-name {
    max-width: 140px;
  }
  .user-name-arrow {
    position: absolute;
    top: 52%;
    right: 0;
    transform: translateY(-50%);
    .transition();
    &[data-arrow-type="true"] {
      transform: translateY(-50%) rotate(180deg);
    }
  }
}
</style>
