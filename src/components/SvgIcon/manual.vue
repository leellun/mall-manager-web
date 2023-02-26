<template>
  <div>
    <Icon :style="{ color: 'hotpink',fontSize:'100px' }">
      <template #component>
        <!-- <logo /> -->
      </template>
    </Icon>
    <logo />
  </div>
</template>
<script setup lang="ts">
// 使用vite-plugin-vue-svg插件的demo
import Icon from '@ant-design/icons-vue';
</script>
<style lang="less">
</style>
