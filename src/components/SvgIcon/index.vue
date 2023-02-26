<template>
  <svg aria-hidden="true" :width="width" :height="height" :style="{ color }">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
// 注意svg文件的<svg> 标签上必须有 fill="currentColor" 字段,这样才能从外部的span等标签复制颜色,否则颜色不可变
import { computed } from 'vue'
const props = withDefaults(defineProps<{
  prefix?: string,
  name: string,
  color?: string,
  width?: string,
  height?: string
}>(),
  {
    prefix: "icon",
    color: '',
    width: "20px",
    height: '20px'
  });
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
