/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<template>
  <div class="application-main-container cls-float">
    <!-- 菜单 -->
    <menu-layout></menu-layout>

    <div class="application-right-container">
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
    return {}
  },
  methods: {}
}
</script>

