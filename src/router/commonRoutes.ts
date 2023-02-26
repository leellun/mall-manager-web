import { UserLayout, BasicLayout, RouteView } from "@/layouts";
import { TRouter } from "./types";
import { rootRouter } from './basicRouter'

export default [
  rootRouter,
  {
    path: "/user",
    name: "user",
    component: UserLayout,
    redirect: "/login",
    hidden: true,
    children: [

    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
    meta: { title: "用户登录" },
  },
  {
    path: "/:path(.*)",
    name: "NoMatch",
    component: () => import("@/pages/exception/404.vue"),
  },
] as TRouter[];
