<template>
  <div>
    商品列表
    <base-text text="baseText组件测试测试测试测试试测试测试测试" style="width: 200px"></base-text>
    <base-text text="baseText组件content测试测试测试测试试测试测试测试" content="<i style='display: inline-block;width:5px;height:5px;border-radius:50%;background:red;margin-right:8px;'></i>tooltip的content" style="width: 200px"></base-text>
    <base-text text="baseText组件disabled测试测试测试测试试测试测试测试" style="width: 200px" :disabled="true"></base-text>
    <base-text text="<i style='color: red'>baseText组件v-html测试测试测试测试试测试测试测试</i>" style="width: 200px"></base-text>
    <base-text text="baseText组件测试" style="width: 200px"></base-text>
  </div>
</template>

<script>
export default {
  name: 'GoodsList'
};
</script>
