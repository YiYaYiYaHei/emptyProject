<template>
  <div class="application-main-container full cls-float">
    <menu-top :topMenuList="topMenuList"
              @menuIsForkEvt="menuIsFork = $event;"
              @menuTopSelect="menuTopSelectEvt"
              :topActiveIndex="topActiveIndex"></menu-top>
    <menu-left v-if="!!leftMenuList.length"
               :menuIsFork="menuIsFork"
               :leftMenuList="leftMenuList"
               :leftActiveIndex="leftActiveIndex"></menu-left>

    <div class="application-content-container pd20" :class="[menuType, {'has-left-menu': leftMenuList.length}]" :data-menu-fork="menuIsFork">
      <router-view />
    </div>
  </div>
</template>

<script>
import MenuTop from './MenuLayout/MenuTop';
import MenuLeft from './MenuLayout/MenuLeft';
import user from '@m/user.js';
import {MENU_CONFIG} from '@/router/config.js';

export default {
  name: 'MainLayout',
  mixins: [user],
  components: {
    MenuTop, MenuLeft
  },
  data() {
    return {
      menuType: MENU_CONFIG.type,
      menuIsFork: this.$store.state.menuFork,
      menuList: [],
      topMenuList: [],
      leftMenuList: [],
      leftActiveIndex: '',
      topActiveIndex: ''
    };
  },
  watch: {
    $route: {
      deep: true,
      handler: function(newVal) {
        this.getMenuActiveIndex();
      }
    }
  },
  methods: {
    // 获取导航激活项的地址：通过循环matched，防止访问隐藏的子菜单时，导航对应菜单没有高亮（比如访问/goods/list/detail/:id时，/goods/list未高亮）
    getActivePath() {
      const length = this.$route.matched.length - 1;
      for (let i = length; i >= 0; i--) {
        const item = this.$route.matched[i];
        if (!item.meta.isHidden) return item.path;
      }
    },
    // 设置导航激活项
    getMenuActiveIndex(type) {
      const _type = type || this.menuType;
      const fullPath = this.getActivePath();
      switch (_type) {
        case 'left':
          this.topActiveIndex = '';
          this.leftActiveIndex = fullPath;
          break;
        case 'top':
          this.topActiveIndex = fullPath;
          this.leftActiveIndex = '';
          break;
        case 'leftTop':
        {
          this.getTopActiveIndex();
          break;
        }
      }
    },
    // 获取顶部导航-激活的菜单
    getTopActiveIndex() {
      for (const item of this.$route.matched) {
        const obj = this.topMenuList.find(it => it.fullPath === item.path);
        if (obj) {
          this.topActiveIndex = obj.fullPath;
          break;
        }
      }
    },
    initPage() {
      const routes = this.$router.options.routes.filter(it => !!it.meta.level);
      for (const item of routes) {
        this.menuList.push(this.assembleMenuList(item));
      }
      switch (this.menuType) {
        case 'left':
          this.topMenuList = [];
          this.leftMenuList = this.menuList;
          this.getMenuActiveIndex('left');
          break;
        case 'top':
          this.topMenuList = this.menuList;
          this.leftMenuList = [];
          this.getMenuActiveIndex('top');
          break;
        case 'leftTop':
          {
            // 获取顶部导航
            const list = JSON.parse(JSON.stringify(this.menuList.filter(it => it.meta.level === 1) || []));
            list.map(it => {
              delete it.children;
              it.hasChildren = false;
            });
            this.topMenuList = list;
            // 获取左侧导航-激活菜单+左侧导航列表
            this.getTopActiveIndex();
            this.leftActiveIndex = this.getActivePath();
            this.menuTopSelectEvt(this.topActiveIndex, 'init');
          }
          break;
      }
    },
    // 组装数据：添加isHidden(是否隐藏，true-隐藏), hasChildren(是否有可展示的子菜单)
    assembleMenuList(item) {
      item.isHidden = (item.meta || {}).isHidden || false;
      item.hasChildren = !!item.children && !!item.children.length && !!item.children.find(it => !it.meta.isHidden);
      if (!item.children || (item.children && !item.children.length)) return item;
      if (!item.isHidden) {
        for (const it of item.children) {
          this.assembleMenuList(it);
        }
      }
      return item;
    },
    // 顶部导航点击事件
    menuTopSelectEvt(path, type) {
      if (this.menuType !== 'leftTop') return;

      // 获取左侧导航列表
      const item = this.menuList.find(it => it.fullPath === path && it.hasChildren);
      this.leftMenuList = item ? item.children : [];
      // 刷新浏览器时，只需要获取左侧导航列表，左侧激活菜单为当前路由地址
      if (type === 'init') return;
      // 点击顶部导航时，需设置默认展开项
      if (this.menuList.find(it => it.fullPath === path)) {
        const obj = this.leftMenuList.find(it => !it.isHidden && it.meta.authority.includes(this.userRole));
        this.leftActiveIndex = obj ? obj.hasChildren ? obj.children.find(ite => !ite.isHidden).fullPath : obj.fullPath : path;
        this.leftActiveIndex && this.$router.push(this.leftActiveIndex);
      }
    }
  },
  created() {
    this.initPage();
  }
};
</script>

<style lang="less" scoped>
.application-content-container {
  .wfull();
  .h(calc(~"100% - "@menuTopHeight));
  background: @bg-base;
  overflow: auto;
  &.left {
    .w(calc(~"100% - "@menuLeftWidth));
    .fl();
    &[data-menu-fork="true"] {
      .w(calc(~"100% - "@menuLeftForkWidth));
    }
  }
  &.leftTop {
    .wfull();
    .fl();
    &.has-left-menu {
      .w(calc(~"100% - "@menuLeftWidth));
      &[data-menu-fork="true"] {
        .w(calc(~"100% - "@menuLeftForkWidth));
      }
    }
  }
  &.top {
    &[data-menu-fork="true"] {
      .wfull();
    }
  }
}
</style>
