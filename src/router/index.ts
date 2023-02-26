import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { setupBeforeEach, setupAfterEach } from './routerGuard'
import routes from './commonRoutes'

const router = createRouter({
  history: createWebHistory(),
  routes: routes as unknown as RouteRecordRaw[],
});

// 路由守卫,鉴权
setupBeforeEach(router)

setupAfterEach(router)

export default router;
