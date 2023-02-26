export const getRoutePages2 = () => {
  const pages = import.meta.glob("/src/pages/**/*.vue");
  const files: { [x: string]: Function } = {};
  for (let p in pages) {
    const name = getFileName(p);
    if (name) {
      files[name] = pages[p];
    }
  }
  return files;
};
export const getRoutePages = () => {
  const pages = import.meta.glob("/src/pages/**/*.vue");
  const files: { [x: string]: Function } = {};
  for (let p in pages) {
    const name = getPageComponent(p);
    if (name) {
      files[name] = pages[p];
    }
    if (p.indexOf("components") > 0) {
      files[p] = pages[p];
    }
  }
  return files;
};
const getPageComponent = (path: string) => {
  // 组只需要加载页面文件,组件不需要
  if (path.indexOf("components") > 0) {
    return false;
  }
  const pattern = /\/src\/pages\/([\w\d\/]*)\.vue/;
  const matched = path.match(pattern);
  if (!matched) {
    throw new Error("path is not right:" + path);
  }
  if (matched[1].endsWith("/index")) {
    return matched[1].substring(0, matched[1].lastIndexOf("/"));
  }
  return matched[1];
};

const getFileName = (path: string) => {
  // 组只需要加载页面文件,组件不需要
  if (path.indexOf("components") > 0) {
    return false;
  }
  const pattern = /\/(\w*)\.vue/;
  const matched = path.match(pattern);
  if (!matched) {
    throw new Error("path is not right:" + path);
  }
  if (matched[1] === "index") {
    const fileArr = path.split("/");
    const len = fileArr.length;
    const routeName = fileArr[len - 2];
    return routeName;
  }
  return matched[1];
};
