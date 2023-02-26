<template>
  <template v-if="menu.children && !menu.meta.hidden">
    <a-sub-menu :key="menu.path">
      <template #icon>
        <SvgIcon :name="menu.meta.icon" v-if="menu.meta.icon" />
      </template>
      <template #title>{{ menu.meta.title }}</template>
      <template v-for="sub in menu.children">
        <!-- 递归组件 -->
        <sub-menu :menu="sub" />
      </template>
    </a-sub-menu>
  </template>
  <template v-else-if="!menu.meta.hidden">
    <!-- renderMenuItem -->
    <a-menu-item :key="menu.path">
      <template #icon>
        <SvgIcon :name="menu.meta.icon" v-if="menu.meta.icon" />
      </template>
      <!-- 外部链接 -->
      <a v-if="menu.meta.target" @click="handleClick(menu.name)" :href="menu.meta.target"
        :target="menu.meta.blank === false ? '' : '_blank'">
        <!-- span重复了吧?这就是template的弊端,jsx才是王道 -->
        <span>{{ menu.meta.title }}</span>
      </a>
      <router-link :to="{ path: menu.path }" v-else>
        <span>{{ menu.meta.title }}</span>
      </router-link>
    </a-menu-item>
  </template>
</template>
<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue'
const props = defineProps<{
  menu: any
}>()
const handleClick = (name: string) => {
}
</script>
<style lang="less" scoped>
.menuName {

  svg,
  span {
    vertical-align: middle;
  }

  svg {
    margin-right: 10px;
  }
}
</style>
