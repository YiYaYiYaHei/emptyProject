<template>
  <div class="home-container">
    首页
    <el-button @click="openPage">打开新页签</el-button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    openPage() {
      window.open('/goods/create', 'home');
    }
  },
  created() {
    console.log(window, top);
    (window.self !== window.top) && (top.location.href = window.location.href);
  }
};
</script>
