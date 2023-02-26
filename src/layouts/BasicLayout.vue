<template>
    <a-layout :class="['layout', device]">
        <!-- SideMenu -->
        <a-drawer v-if="isMobile" placement="left" :class="`drawer-sider ${setting.navTheme}`" :closable="false"
            :visible="collapsed" @close="drawerClose">
            <side-menu mode="inline" :menus="menus" :theme="setting.navTheme" :collapsed="false" :collapsible="true"
                @menuSelect="menuSelect"></side-menu>
        </a-drawer>
        <side-menu mode="inline" :menus="menus" :theme="setting.navTheme" :collapsed="collapsed"
            :collapsible="true"></side-menu>
        <a-layout :class="['sidemenu', `content-width-${setting.contentWidth}`]"
            :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
            <!-- layout header -->
            <global-header :theme="setting.navTheme" :collapsed="collapsed" :device="device" @toggle="toggle" />
            <!-- layout content -->
            <a-layout-content
                :style="{ height: '100%', margin: '24px 24px 0', paddingTop: setting.fixedHeader ? '64px' : '0', }">
                <multi-tab v-if="setting.multiTab"></multi-tab>
                <transition name="page-transition">
                    <section>
                        <route-view />
                    </section>
                </transition>
            </a-layout-content>
            <!-- layout footer -->
            <a-layout-footer >
                <global-footer v-if="false"/>
            </a-layout-footer>
        </a-layout>
    </a-layout>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import setting from '@/config/defaultSettings'
import { triggerWindowResizeEvent, isMobile, isDesktop } from '@/utils/device'
import RouteView from './RouteView.vue'
import GlobalHeader from '@/components/GlobalHeader/index.vue'
import GlobalFooter from '@/components/GlobalFooter/index.vue'
import MultiTab from '@/components/MultiTab/index.vue'
import { useSettingStore } from '@/store/setting';
import { usePermissionStore } from '@/store/permission'
const settingStore = useSettingStore()

const device = computed(() => settingStore.device)
const menus = usePermissionStore().getMenus
const collapsed = ref(settingStore.sidebar || false)
const contentPaddingLeft = computed(() => {
    if (!setting.fixSiderbar || isMobile.value) {
        return '0'
    }
    let settingStore = useSettingStore();
    if (!settingStore.sidebar) {
        return '256px'
    }
    return '80px'
})
const drawerClose = () => {
    collapsed.value = false
}

const menuSelect = () => {

}
const toggle = () => {
    collapsed.value = !collapsed.value
    settingStore.setSideBar(collapsed.value)
    triggerWindowResizeEvent()
}
</script>
<style lang="less">
@import url('./BasicLayout.less');

.page-transition-enter {
    opacity: 0;
}

.page-transition-leave-active {
    opacity: 0;
}

.page-transition-enter .page-transition-container,
.page-transition-leave-active .page-transition-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>