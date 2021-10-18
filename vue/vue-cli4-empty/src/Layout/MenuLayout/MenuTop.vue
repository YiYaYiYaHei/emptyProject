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
               background-color="#1a1a2e"
               text-color="#fff"
               active-text-color="#ffd04b"
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
          <div @click="editPwdData.nodeId = +new Date()">修改密码</div>
          <div @click="logoutEvt">退出登录</div>
        </div>
      </el-popover>
    </div>

    <!--修改密码弹框-->
    <base-dialog ref="dialog"
                 title="修改密码"
                 :dialogId.sync="editPwdData.nodeId"
                 @dialogConfirm="submitForm(editPwdConfirm, 'editPwdForm')"
                 @dialogClose="resetForm('editPwdForm');">
      <el-form :model="editPwdData.formData" :rules="editPwdData.formRules" ref="editPwdForm" label-width="80px" size="small">
        <el-form-item label="原始密码" prop="oldPwd">
          <el-input maxlength=20 type="password" placeholder="请输入原始密码" v-trim v-model="editPwdData.formData.oldPwd" clearable onpaste="return false"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input maxlength=20 type="password" placeholder="请输入新密码" v-trim v-model="editPwdData.formData.newPwd" clearable onpaste="return false"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="newPwdRepeat">
          <el-input maxlength=20 type="password" placeholder="请再次输入新密码" v-trim v-model="editPwdData.formData.newPwdRepeat" clearable onpaste="return false"/>
        </el-form-item>
      </el-form>
    </base-dialog>
  </div>
</template>

<script>
import MenuItem from './MenuItem';
import mixins from '@m';
import {MENU_CONFIG} from '@/router/config.js';
import SHA256 from 'js-sha256';

export default {
  name: 'MenuTop',
  mixins: [mixins.user, mixins.form],
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
      popoverVisiable: false,
      editPwdData: {
        nodeId: null,
        formData: {
          oldPwd: '',
          newPwd: '',
          newPwdRepeat: ''
        },
        formRules: {
          oldPwd: [{
            required: true,
            trigger: 'blur',
            fieldType: '原始密码',
            encryValue: () => {
              return SHA256.hmac(this.userInfo.userName, this.editPwdData.formData.oldPwd);
            },
            validator: this.$validates.oldPwd
          }],
          newPwd: [{required: true, trigger: 'blur', fieldType: '新密码', validator: this.$validates.password}],
          newPwdRepeat: [{
            required: true,
            trigger: 'blur',
            fieldType: '确认密码',
            validator: (rule, value, callback) => {
              rule.newPwdRepeat = this.editPwdData.formData.newPwd;
              this.$validates.password(rule, value, callback);
            }
          }]
        }
      }
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
    },
    // 退出操作
    async logoutEvt() {
      const result = await this.$apis.login.logout();
      if (result.status === 200) {
        this.logout();
      } else {
        this.$message.error(result.message);
      }
    },
    // 修改密码-提交
    async editPwdConfirm() {
      this.$refs.dialog.openLoading();
      const result = await this.$apis.login.editUserPwd({
        newPassward: SHA256.hmac(this.userInfo.userName, this.editPwdData.formData.newPwd)
      });
      this.$refs.dialog.closeLoading();
      if (result.status === 200) {
        this.logout('密码修改成功，请重新登录');
      } else {
        this.$message.error(result.message);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.menu-top-container {
  height: @menuTopHeight;
  background: @bg-nav;
  .pdr20();
  .fork-icon {
    color: white;
    .fs(24);
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
