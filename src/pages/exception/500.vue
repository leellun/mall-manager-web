<template>
  <a-result status="500" title="500" sub-title="Sorry, the server is reporting an error.">
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
