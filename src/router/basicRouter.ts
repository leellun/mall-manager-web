import { TRouter } from "./types";
import { Router, RouteRecordRaw } from "vue-router";
import { BasicLayout, RouteView, BlankLayout } from "@/layouts";

import { getRoutePages } from "@/utils/batchImportFiles";
import { usePermissionStore } from "@/store/permission";
import { cloneDeep } from "lodash";
import { AnyFn } from "@vueuse/core";
import { Menu } from "@/api/system/menuApi";

const layouts: { [x: string]: Function } = {
  BasicLayout,
  RouteView,
  BlankLayout,
  ...getRoutePages(),
};
// 根级菜单
export const rootRouter: TRouter = {
  name: "index",
  path: "/",
  component: BasicLayout,
  meta: {
    title: "",
  },
  children: [],
};

//获取第一个菜单
export const getLeafMenuForFShowPath = (menu: TRouter) => {
  var router: TRouter = getLeafMenuForFShow(menu);
  return router?.path;
};
//获取第一个叶子菜单
export function getLeafMenuForFShow(menu: TRouter) {
  let menuArray = new Array<TRouter>();
  menuArray.push(menu);
  while (menuArray.length > 0) {
    let tempMenuArray = new Array<TRouter>();
    for (let item of menuArray) {
      if (item.children != undefined && item.children.length > 0) {
        tempMenuArray.push(...item.children);
      } else {
        if (
          item.meta == undefined ||
          item.meta.hidden == undefined ||
          !item.meta.hidden
        ) {
          return item;
        }
      }
    }
    menuArray = tempMenuArray;
  }
  return menu;
}
export function loadMenus(router: Router) {
  generateAsyncRoutes(router, rootRouter.children);
}
export const generateApiAsyncRoutes = (router: Router, menus: Array<Menu>) => {
  menus.sort((a, b) => a.menuSort - b.menuSort);
  let rootMenus = new Array<TRouter>();
  let pMenuObj: any = {};
  menus.forEach((menu) => {
    let tRouter = covertMenuToTRouter(menu);
    if (pMenuObj[menu.id] === undefined) {
      pMenuObj[menu.id] = [];
    }
    tRouter.children = pMenuObj[menu.id];
    if (menu.pid === null) {
      rootMenus.push(tRouter);
    } else {
      if (pMenuObj[menu.pid] != undefined) {
        pMenuObj[menu.pid].push(tRouter);
      } else {
        pMenuObj[menu.pid] = [tRouter];
      }
    }
  });
  generateAsyncRoutes(router, rootMenus);
};
const covertMenuToTRouter = (menu: Menu) => {
  let router: TRouter = {
    name: menu.name,
    path: menu.path,
    meta: {
      title: menu.title,
      keepAlive: menu.keepAlive === 1,
      icon: menu.icon,
      target: menu.target !== 0 ? menu.path : undefined,
      blank: menu.target === 2,
      hidden: menu.hidden === 1,
    },
    component: menu.component,
    children: [],
  };
  return router;
};
//构建路由
export const generateAsyncRoutes = (router: Router, menus?: Array<any>) => {
  if (!menus) {
    return;
  }
  resetMenuPath("", menus);
  const permissionStore = usePermissionStore();
  permissionStore.setMenus(cloneDeep(menus));
  rootRouter.children = menus;

  refreshMenuData(rootRouter);
  rootRouter.redirect = getLeafMenuForFShowPath(rootRouter);
  router.removeRoute(rootRouter.name);
  router.addRoute(rootRouter as unknown as RouteRecordRaw);
};

//刷新菜单数据
const resetMenuPath = (parentPath: string, menus: Array<TRouter>) => {
  menus.forEach((item) => {
    if (item.path == undefined) {
      item.path = item.name;
    }
    if (!item.path.startsWith("/")) {
      item.path = parentPath + "/" + item.path;
    }
    if (item.children != undefined && item.children.length > 0) {
      resetMenuPath(item.path, item.children);
    } else {
      item.children = undefined;
    }
  });
};
//刷新菜单数据
const refreshMenuData = (menu: TRouter) => {
  if (menu.children != undefined && menu.children.length > 0) {
    menu.children.forEach((item) => {
      if (
        item.component != undefined &&
        item.component != "" &&
        typeof item.component == "string"
      ) {
        item.component = layouts[item.component];
        if (item.component === undefined) {
          item.meta!.hidden = true;
        }
      }
      refreshMenuData(item);
    });
  } else {
    delete menu.children;
  }
};
