<template>
  <div class="logo">
    <router-link :to="{ path: '/' }">
      <SvgIcon name="logo" />
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue'

withDefaults(defineProps<{
  title?: string,
  showTitle?: boolean
}>(), {
  title: 'Ant Design Pro',
  showTitle: true
})
</script>
