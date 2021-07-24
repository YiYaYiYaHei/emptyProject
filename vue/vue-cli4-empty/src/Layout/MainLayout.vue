<template>
  <div class="application-main-container full">
    <menu-top :topMenuList="topMenuList"
              @menuIsForkEvt="menuIsFork = $event;"></menu-top>
    <menu-left v-if="!!leftMenuList.length"
               :menuIsFork="menuIsFork"
               :leftMenuList="leftMenuList"></menu-left>

    <div class="application-content-container" :class="[menuType]">
      <router-view />
    </div>
  </div>
</template>

<script>
import MenuTop from './MenuLayout/MenuTop';
import MenuLeft from './MenuLayout/MenuLeft';
import {MENU_CONFIG} from '@/router/config.js';

export default {
  name: 'MainLayout',
  components: {
    MenuTop, MenuLeft
  },
  data() {
    return {
      menuType: MENU_CONFIG.type,
      menuIsFork: false,
      menuList: [],
      topMenuList: [],
      leftMenuList: []
    };
  },
  computed: {

  },
  methods: {
    initPage() {
      const routes = this.$router.options.routes.filter(it => !!it.meta.level);
      for (const item of routes) {
        this.menuList.push(this.assembleMenuList(item));
      }
      this.topMenuList = ['top', 'leftTop'].includes(this.menuType) ? this.menuList : [];
      this.leftMenuList = this.menuType === 'left' ? this.menuList : [];
    },
    assembleMenuList(item) {
      item.isHidden = (item.meta || {}).isHidden || false;
      item.hasChildren = !!item.children && !!item.children.length && item.children.find(it => !it.meta.isHidden);
      if (!item.children || (item.children && !item.children.length)) return item;
      if (!item.isHidden) {
        for (const it of item.children) {
          this.assembleMenuList(it);
        }
      }
      return item;
    }
  },
  created() {
    this.initPage();
  }
};
</script>
