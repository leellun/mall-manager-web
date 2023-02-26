import { defineStore } from "pinia";
import storage from "@/utils/Storage";
import { SITE_SETTINGS } from "@/store/mutation-types";

export interface Setting {
  sidebar: boolean;
  device: string;
}
export const useSettingStore = defineStore("setting", {
  state: (): Setting => {
    return {
      sidebar: false,
      device: "desktop",
    };
  },
  getters: {
    getSidebar(): boolean {
      return this.sidebar;
    },
  },
  actions: {
    setSideBar(sidebar: boolean) {
      this.sidebar = sidebar;
      this.setSetting(this.$state)
    },
    setSetting(setting: Setting) {
      this.$state = setting;
      storage.setObj(SITE_SETTINGS, setting);
    }
  },
});
