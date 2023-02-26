import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "virtual:svg-icons-register";
import "@/style/global.less";
import { useSettingStore } from "@/store/setting";
import { usePermissionStore } from "@/store/permission";
import storage from "@/utils/Storage";
import { SITE_SETTINGS } from "@/store/mutation-types";
import * as Icons from "@ant-design/icons-vue";

const app = createApp(App);
app.use(createPinia());
app.use(router);

// 开始使用全局图标
const icons: any = Icons;
for (const i in icons) {
  // 循环注册组件
  app.component(i, icons[i]);
}
app.mount("#app");

const setting = storage.get(SITE_SETTINGS);
useSettingStore().setSetting(setting);

//按钮权限
app.directive("permission", {
  mounted(el, binding) {
    let type = binding.value || "";
    let status = false;
    const permissionStore = usePermissionStore();
    ///这里表示用户所拥有的所有权限
    let permissionBtns = permissionStore.permissions;

    permissionBtns.forEach((item: any) => {
      let sta =
        type === item ||
        (type.constructor === Array && type.indexOf(item) != -1);
      if (sta) {
        status = true;
      }
    });
    if (!status) {
      el.style.display = "none";
    }
  },
});
