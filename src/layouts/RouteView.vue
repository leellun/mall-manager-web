<template>
  <router-view v-slot="{ Component }" v-if="isKeep">
    <keep-alive ref="cacheViewsRef">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-else />
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import defaultSettings from '@/config/defaultSettings'
import events from '@/utils/eventBus'
import { usePermissionStore } from '@/store/permission'
import { getMenuFilePath } from '@/utils/menuUtils'

const permissionStore = usePermissionStore()
const route: any = useRoute()
const cacheViewsRef = ref()
const isKeep = computed(() => {
  // const status = defaultSettings.multiTab && route.meta.keepAlive
  const status = defaultSettings.multiTab
  return status
});
watch(() => route.fullPath, (val) => {
  if (!route.meta.keepAlive) {
    events.emit("routeview.close", val)
  }
})
events.once('routeview.close', (fullPath: any) => {
  const filePath = getMenuFilePath(permissionStore.getMenus, fullPath)
  if (cacheViewsRef.value != null) {
    for (let key of cacheViewsRef.value._.__v_cache.keys()) {
      let file: string = key.__file
      if (file.endsWith(filePath + ".vue") || file.endsWith(filePath + "/index.vue")) {
        cacheViewsRef.value._.__v_cache.delete(key)
        break
      }
    }
  }
})
</script>