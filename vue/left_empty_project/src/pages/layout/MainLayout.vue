/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<template>
  <div class="application-main-container cls-float">
    <!-- 菜单 -->
    <menu-layout :menuExpand="menuExpand"></menu-layout>

    <div class="application-right-container"
         :style="{'margin-left': menuExpand ? '210px' : '40px'}">
      <!-- 顶部导航 -->
      <navigation :menuExpand="menuExpand"
                  @menuExpandEvt="menuExpandEvt"></navigation>

      <div class="application-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import MenuLayout from './MenuLayout.vue'
import Navigation from './Navigation.vue'

export default {
  components: {
    MenuLayout,
    Navigation
  },
  data() {
    return {
      menuExpand: true
    }
  },
  methods: {
    menuExpandEvt(data) {
      this.menuExpand = data ? data : !this.menuExpand;
    }
  }
}
</script>

