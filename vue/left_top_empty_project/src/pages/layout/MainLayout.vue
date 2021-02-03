/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<template>
  <div class="application-main-container cls-float">
    <!-- 菜单 -->
    <menu-layout @changeMenuExpand="menuExpandEvt"></menu-layout>

    <div class="application-right-container" :style="{'left': menuExpand ? '210px' : '0', 'width': menuExpand ? 'calc(100% - 210px)' : '100%'}">
      <div class="application-container">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import MenuLayout from './MenuLayout.vue'

export default {
  components: {
    MenuLayout
  },
  data() {
    return {
      menuExpand: false
    }
  },
  methods: {
    menuExpandEvt(data) {
      this.menuExpand = data ? data : false
    }
  }
}
</script>

