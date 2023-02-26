<template>
  <a-result status="403" title="403" sub-title="Sorry, you don't have access to this page.">
    <template #extra>
      <a-button type="primary" @click="toHome">
        返回首页
      </a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import { Router, useRouter } from "vue-router";
let router: Router = useRouter();
const toHome = () => {
  router.push({ path: "/" })
}
</script>
