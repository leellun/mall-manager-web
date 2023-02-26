<template>
  <a-layout-sider :class="['sider', isDesktop ? null : 'shadow', theme, defaultSettings.fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256" :collapsible="collapsible" v-model:collapsed="collapsedValue" :trigger="null">
    <logo />
    <Menu :collapsed="collapsed" :menus="menus" :theme="theme" :mode="mode"></Menu>
  </a-layout-sider>
</template>
<script setup lang="ts">
import { ref,  watch } from 'vue';
import Logo from '@/components/tools/Logo.vue'
import Menu from '@/components/menu/Menu.vue'
import { isDesktop } from '@/utils/device'
import defaultSettings from '@/config/defaultSettings';

const props = withDefaults(defineProps<{
  mode?: string,
  theme?: string,
  collapsible?: boolean,
  collapsed?: boolean,
  menus: Array<any>
}>(), {
  mode: 'inline',
  theme: 'light',
  collapsible: false,
  collapsed: false
})
const collapsedValue = ref(props.collapsed);
watch(() => props.collapsed, (newVal) => {
  collapsedValue.value = newVal;
})
</script>
<style lang="less">

</style>