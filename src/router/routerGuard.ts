import NProgress from "nprogress"; // progress bar
import "@/components/NProgress/nprogress.less"; // progress bar custom style
import { generateApiAsyncRoutes } from "@/router/basicRouter";
import { useUserStore } from "@/store/user";
import { usePermissionStore } from "@/store/permission";
import type { Router } from "vue-router";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["login", "register", "registerResult"]; // 不进行拦截的路由名称集合

export const setupBeforeEach = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    NProgress.start(); // 加载进度条
    const permissionStore = usePermissionStore();
    const userStore = useUserStore();
    if (userStore.isLogin) {
      if (!permissionStore.isHasRouterMenu()) {
        try {
          let catalogues = await permissionStore.getCatalogues();
          if (catalogues.length == 0) {
            await userStore.loginOut();
            permissionStore.resetRouterMenu();
            next({ name: "login", query: { redirect: to.fullPath } });
          } else {
            generateApiAsyncRoutes(router, catalogues);
            permissionStore.getUserPermissions();
            next({ path: to.path, query: to.query });
          }
        } catch (e) {
          console.log(e);
          next({ name: "login", query: { redirect: to.fullPath } });
        }
        NProgress.done();
        return;
      }
      if (to.name === "login") {
        next({ path: "/" });
        NProgress.done();
      } else {
        next();
      }
    } else {
      if (whiteList.includes(to.name as any)) {
        // 在免登录白名单，直接进入
        next();
      } else {
        next({ name: "login", query: { redirect: to.fullPath } });
        NProgress.done();
      }
    }
  });
};

export const setupAfterEach = (router: Router) => {
  router.afterEach(() => {
    NProgress.done(); // finish progress bar
  });
};
