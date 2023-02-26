/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 */

export default {
  navTheme: "light", // theme for nav menu
  primaryColor: "#1890FF", // ant design 默认主颜色(在node_modules/ant-design-vue/style/color/colors.less中@blue-base变量定义,实际上@primary-color = @blue-6 = @blue-base,禁止套娃,手动狗头)
  contentWidth: "Fluid", // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
  fixedHeader: true, // sticky header
  fixSiderbar: true, // sticky siderbar
  colorWeak: false, //色盲模式
  title: "Ant Design Pro",
  storage: {
    namespace: "PRO_",
  },
  multiTab: false, //多标签
  grayMode: false, //黑白模式
  darkMode: false, // 色弱模式
  timeout:5000,//请求超时时间
  menus: [
    {
      name: "dashboard",
      path: "dashboard",
      meta: {
        icon: "bx-analyse",
        title: "仪表盘",
        hidden: false,
      },
      component: "RouteView",
      redirect: "/dashboard/workplace",
      children: [
        {
          path: "workplace",
          name: "workplace",
          meta: {
            title: "工作台",
            keepAlive: true,
          },
          component: "dashboard/workspace",
        },
        {
          name: "monitor",
          path: "monitor",
          meta: {
            title: "监控页（外部）",
            target: "http://www.baidu.com",
            blank: true,
          },
        },
      ],
    }, // account
    {
      name: "account",
      meta: {
        title: "个人页",
        icon: "bx-analyse",
        show: true,
      },
      redirect: "/account/center",
      component: "RouteView",
      children: [
        {
          name: "center",
          meta: {
            title: "个人中心",
            show: true,
            keepAlive: true,
          },
          component: "account",
        },
      ],
    }, // 系统管理
    {
      name: "system",
      meta: {
        title: "系统管理",
        icon: "setting",
        show: true,
      },
      component: "RouteView",
      children: [
        {
          name: "user",
          meta: {
            title: "用户管理",
            show: true,
            keepAlive: true,
          },
          component: "system/user",
        },{
          name: "job",
          meta: {
            title: "岗位管理",
            show: true,
            keepAlive: true,
          },
          component: "system/job",
        },{
          name: "department",
          meta: {
            title: "部门管理",
            show: true,
            keepAlive: true,
          },
          component: "system/department",
        },{
          name: "menu",
          meta: {
            title: "菜单管理",
            show: true,
            keepAlive: true,
          },
          component: "system/menu",
        },{
          name: "role",
          meta: {
            title: "角色管理",
            show: true,
            keepAlive: true,
          },
          component: "system/role",
        },
        
      ],
    },
  ],
};
