/*********************************************************************
 * Vue directive & filter register file
 * Created by shuhui-meng on 2020/07/09
 *********************************************************************/
<template>
  <div class="top-navigation cls-float">
    <div class="menu-collopse-icon" @click="$emit('menuExpandEvt')" :class="{'active': !this.menuExpand}"></div>

    <div class="user-info">
      <el-popover placement="top-end" width="140" trigger="click" :visible-arrow="false" popper-class="logout-popover">
        <div class="logout-container pointer" @click="logoutEvt">
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
import BaseView from '@/pages/BaseView.vue'
import { mapGetters } from 'vuex'

export default {
  extends: BaseView,
  props: ['menuExpand'],
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  data() {
    return {}
  },
  methods: {
    /* 退出 */
    async logoutEvt() {
      let result = await this.$api.getDataRequest('USER_LOGOUT', {})
      if (!!result && result.status === 200) {
        this.logout()
      }
    }
  }
}
</script>

