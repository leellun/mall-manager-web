<template>
  <a-menu v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys" :mode="mode" :theme="theme" class="SysMenu"
    :inline-collapsed="collapsed" @openChange="onOpenChange">
    <template v-for="m in menus" :key="m.path">
      <sub-menu :menu="m" v-if="!m.meta?.hidden" />
    </template>
  </a-menu>
</template>
<script setup lang="ts">
import { TRouter } from '@/router/types';
import { ref, watch, ComputedRef, computed } from 'vue';
import { useRouter } from 'vue-router'
import { getOpenMenuPath } from '@/utils/menuUtils'
const router = useRouter()
const route = router.currentRoute
const props = withDefaults(defineProps<{
  mode?: string,
  theme?: string,
  collapsible?: boolean,
  collapsed?: boolean,
  menus: Array<TRouter>
}>(), {
  mode: 'inline',
  theme: 'dark',
  collapsible: false,
  collapsed: false
})
const selectedKeys = ref<Array<any>>([]);
const openKeys = ref<Array<any>>(getOpenMenuPath(props.menus, route.value.path));
selectedKeys.value.push(route.value.path)
watch(() => route.value, (val) => {
  openKeys.value = getOpenMenuPath(props.menus, val.path)
  selectedKeys.value.splice(0, selectedKeys.value.length)
  selectedKeys.value.push(val.path)
})
// select menu item
const onOpenChange = (openKeysParams: Array<any>) => {
}
</script>

