import { useSettingStore } from "@/store/setting";
import { TOGGLE_DEVICE, DEVICE_TYPE } from "@/store/mutation-types";
import { useBreakpoints, breakpointsAntDesign } from "@vueuse/core";
// { "xs": 480, "sm": 576, "md": 768, "lg": 992, "xl": 1200, "xxl": 1600 }
const breakpoints = useBreakpoints(breakpointsAntDesign);
export const isMobile:any = breakpoints.smaller("sm");
export const isTablet = breakpoints.between("sm", "xl");
export const isDesktop = breakpoints.greater("xl");

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event: any = document.createEvent("HTMLEvents");
  event.initEvent("resize", true, true);
  event.eventType = "message";
  window.dispatchEvent(event);
}

// clear:解决window.onresize会触发两次
let clear:any;
export const setDeviceType = () => {
  if (clear) {
    clearTimeout(clear);
  }
  clear = setTimeout(function () {
    const settingStore = useSettingStore();
    if (isMobile.value) {
      settingStore.$state.device = DEVICE_TYPE.MOBILE;
    }
    if (isTablet.value) {
      settingStore.$state.device = DEVICE_TYPE.TABLET;
    }
    if (isDesktop.value) {
      settingStore.$state.device = DEVICE_TYPE.DESKTOP;
    }
  });
};
