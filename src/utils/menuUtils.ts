import { TRouter } from "@/router/types";

export const getOpenMenuName = (
  routers: Array<TRouter>,
  name: any
): Array<string> | null => {
  for (let router of routers) {
    if (router.name == name) {
      return new Array<string>();
    } else if (router.children != undefined && router.children.length > 0) {
      let array: Array<string> | null = getOpenMenuName(router.children, name);
      if (array != null) {
        array.unshift(router.name);
      }
      return array;
    }
  }
  return null;
};
export const getOpenMenuPath = (
  routers: Array<TRouter>,
  path: string
): Array<string> => {
  let menus: Array<string> | null = getMenuPaths(routers, path);
  return menus ? menus : [];
};
export const getMenuPaths = (
  routers: Array<TRouter>,
  path: string
): Array<string> | null => {
  for (let router of routers) {
    if (router.path === path) {
      return new Array<string>();
    } else if (router.children != undefined && router.children.length > 0) {
      let array: any = getMenuPaths(router.children, path);
      if (array != null) {
        array.unshift(router.path);
        return array;
      }
    }
  }
  return null;
};
export const getMenuFilePath = (
  routers: Array<TRouter>,
  path: string
): string | null => {
  var array = routers;
  while (array.length > 0) {
    let newArray: Array<TRouter> = [];
    for (let router of array) {
      if (router.path === path) {
        return router.component;
      } else if (router.children != undefined && router.children.length > 0) {
        newArray.push(...router.children);
      }
    }
    array = newArray;
  }
  return null;
};
