<template>
    <transition name="showHeader">
        <div v-if="visible" class="header-animat">
            <a-layout-header v-if="visible"
                :class="[defaultSettings.fixedHeader && 'ant-header-fixedHeader', collapsed ? 'ant-header-side-closed' : 'ant-header-side-opened',]"
                :style="{ padding: '0' }">
                <div class="header">
                    <span @click="toggle">
                        <template v-if="device === 'mobile'">
                            <MenuFoldOutlined v-if="collapsed" class="trigger" />
                            <MenuUnfoldOutlined v-else class="trigger" />
                        </template>
                        <template v-else>
                            <MenuUnfoldOutlined v-if="collapsed" class="trigger" />
                            <MenuFoldOutlined v-else class="trigger" />
                        </template>
                    </span>
                    <user-menu :theme="theme"></user-menu>
                </div>
            </a-layout-header>
        </div>


    </transition>
</template>
<script setup lang="ts">
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons-vue'
import UserMenu from '../tools/UserMenu/index.vue'
import { ref, computed } from 'vue'
import defaultSettings from '@/config/defaultSettings';
import { useSettingStore } from '@/store/setting'


const emit = defineEmits(["toggle", "refresh"]);

const settingStore = useSettingStore();
const visible = ref<boolean>(true)
withDefaults(defineProps<{
  theme: string,
  collapsed?: boolean,
  device?: string
}>(), {
  mode: 'sidemenu',
  theme: 'dark',
  collapsed: false,
  device: 'desktop'
})
const toggle = () => {
    emit('toggle')
}
</script>
<style lang="less">
@import '../../style/index.less';

.header-animat {
  position: relative;
  z-index: @ant-global-header-zindex;
}
.showHeader-enter-active {
  transition: all 0.25s ease;
}
.showHeader-leave-active {
  transition: all 0.5s ease;
}
.showHeader-enter,
.showHeader-leave-to {
  opacity: 0;
}
</style>