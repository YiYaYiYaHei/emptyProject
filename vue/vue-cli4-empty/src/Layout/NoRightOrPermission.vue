/*********************************************************************
* 页面404/无权限页面
*********************************************************************/

<template>
  <div class="no-right-or-permission-container">
    <img :src="imgSrc">

    <div class="btn-box tc pdt20">
      <el-button @click="goBack">{{btnMsg}}({{count}}s)</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'NoRightOrPermission',
  data() {
    return {
      imgSrc: '',
      btnMsg: '',
      timer: null,
      count: 5
    };
  },
  methods: {
    goBack() {
      this.timer && clearInterval(this.timer);
      if (window.history.length) {
        this.$router.go(-2);
      } else {
        this.$router.push('/login');
      }
    }
  },
  created() {
    this.imgSrc = this.$route.path === '/noright' ? require('../assets/images/common/no-right.jpg') : require('../assets/images/common/no-permission.jpg');
    this.btnMsg = window.history.length ? '返回上一页' : '登录';
    this.timer = setInterval(() => {
      this.count--;
      (this.count === 0) && this.goBack();
    }, 1000);
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
.no-right-or-permission-container {
  position: fixed;
  left: 50%;
  top: 5%;
  transform: translateX(-50%);
}
</style>
