<template>
  <div class="ant-pro-multi-tab">
    <div class="ant-pro-multi-tab-wrapper">
      <a-tabs hideAdd type="editable-card" v-model:activeKey="activeKey"
        :tabBarStyle="{ margin: 0, paddingLeft: '16px', paddingTop: '1px' }" @edit="onEdit">
        <a-tab-pane v-for="page in pages" :key="page.fullPath" :closable="pages.length > 1" style="height: 0">
          <template #tab>
            <a-dropdown :trigger="['contextmenu']">
              <span :style="{ userSelect: 'none' }">{{ page.meta.customTitle || page.meta.title }}
                <ReloadOutlined v-if="router.currentRoute.value.fullPath == page.fullPath + '2323'" class="trigger"
                  style="font-size: 14px;line-height: 100%;padding: 0;margin-right: 0;margin-left: 5px;"
                  @click="() => { onRefreshPage(page.fullPath) }" />
              </span>
              <template #overlay>
                <a-menu @click="({ key, item, domEvent }: any) => { closeMenuClick(key, page.fullPath); }">
                  <a-menu-item key="closeSelf">关闭当前标签</a-menu-item>
                  <a-menu-item key="closeRight">关闭右侧</a-menu-item>
                  <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
                  <a-menu-item key="closeAll">关闭全部</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, getCurrentInstance, nextTick } from 'vue'
import { useRouter, Router, RouteLocationNormalizedLoaded } from 'vue-router'
import events from '@/utils/eventBus'
import { message } from 'ant-design-vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { usePermissionStore } from '@/store/permission'

const permissionStore = usePermissionStore();

let fullPathList: Array<string> = []
const pages = reactive<Array<RouteLocationNormalizedLoaded>>([])
const activeKey = ref('')
const router: Router = useRouter()
const { ctx } = getCurrentInstance() as any

const selectedLastPath = () => {
  activeKey.value = fullPathList[fullPathList.length - 1]
}

// 全局的事件绑定用于页面内控制tab标签,暂时用不上
// #region
events.once('multiTab.open', (val: any) => {
  if (!val) {
    throw new Error(`multi-tab: open tab ${val} err`)
  }
  activeKey.value = val
})
events.once('multiTab.close', (val: any) => {
  if (!val) {
    closeSelf(activeKey.value)
    return
  }
  closeSelf(val)
})
events.once('multiTab.remove', (val: any) => {
  remove(val)
})
events.once('multiTab.rename', ({ key, name }: any) => {
  try {
    const item = pages.find((item) => item.path === key)
    item!.meta.customTitle = name
    ctx.$forceUpdate()
  } catch (e) {
    console.error(e)
  }
})
// #endregion

pages.push(router.currentRoute.value)
fullPathList.push(router.currentRoute.value.fullPath)
permissionStore.tagPaths = fullPathList
selectedLastPath()

const onEdit = (targetKey: string, action: any) => {
  remove(targetKey)
}
const onRefreshPage = (targetKey: string) => {
  events.emit("routeview.close", targetKey)
  // permissionStore.tagPaths = fullPathList.filter((path) => path != targetKey)
  nextTick(() => {
    // permissionStore.tagPaths = fullPathList
    // router.push({path:targetKey,params:{time:Date.now()}})
    router.push({ path: '/' })
  })
}
const remove = (targetKey: string) => {
  const route = pages.find((page) => page.fullPath == targetKey)
  if (route != null) {
    const temp = pages.filter((page) => page.fullPath !== targetKey)
    pages.length = 0
    pages.push(...temp)
  }
  events.emit("routeview.close", targetKey)

  fullPathList = fullPathList.filter((path) => path !== targetKey)
  permissionStore.tagPaths = fullPathList
  // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
  if (!fullPathList.includes(activeKey.value)) {
    selectedLastPath()
  }
  if (route != null) {
    nextTick(() => {
      // route.meta.keepAlive = true
    })
  }
}

// content menu
const closeSelf = (e: any) => {
  // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
  if (fullPathList.length > 1) {
    remove(e)
  } else {
    message.info('这是最后一个标签了, 无法被关闭')
  }
}
const closeLeft = (e: any) => {
  const currentIndex = fullPathList.indexOf(e)
  if (currentIndex > 0) {
    fullPathList.forEach((item, index) => {
      if (index < currentIndex) {
        remove(item)
      }
    })
  } else {
    message.info('左侧没有标签')
  }
}
const closeRight = (e: any) => {
  const currentIndex = fullPathList.indexOf(e)
  if (currentIndex < fullPathList.length - 1) {
    fullPathList.forEach((item, index) => {
      if (index > currentIndex) {
        remove(item)
      }
    })
  } else {
    message.info('右侧没有标签')
  }
}
const closeAll = (e: any) => {
  const currentIndex = fullPathList.indexOf(e)
  fullPathList.forEach((item, index) => {
    if (index !== currentIndex) {
      remove(item)
    }
  })
}
const closeMenuClick = (key: string, route: any) => {
  switch (key) {
    case 'closeSelf':
      closeSelf(route)
      break;
    case 'closeLeft':
      closeLeft(route)
      break;
    case 'closeRight':
      closeRight(route)
      break;
    case 'closeAll':
      closeAll(route)
      break;
  }
}

watch(
  () => router.currentRoute.value,
  (newVal) => {
    activeKey.value = newVal.fullPath
    if (fullPathList.indexOf(newVal.fullPath) < 0) {
      fullPathList.push(newVal.fullPath)
      permissionStore.tagPaths = fullPathList
      pages.push(newVal)
    }
  }
)

watch(activeKey, (newPathKey) => {
  if (newPathKey.indexOf("?") == -1) {
    router.push({ path: newPathKey })
  } else {
    let queryStr = newPathKey.substring(newPathKey.indexOf("?") + 1)
    let query: any = {}
    queryStr.split("&").forEach(s => {
      let kv = s.split("=")
      query[kv[0]] = kv[1]
    })
    router.push({ path: newPathKey,query })
  }
})
</script>
<style lang="less">
@import url('./index.less');

.tab_style() {
  .ant-tabs-card-bar {
    padding-left: 0;

    .ant-tabs-nav-container {

      .ant-tabs-tab-prev:hover,
      .ant-tabs-tab-next:hover {
        // width: 22px;
        background-color: rgba(0, 0, 0, 0.03);
      }

      font-size: 13px;
      height: 39px;
    }

    .ant-tabs-tab {
      margin-right: 0;
      border-radius: 0px;
      border-top: 0px;
      line-height: 40px;

      .anticon-close {
        display: none;
      }
    }

    .ant-tabs-tab-active {
      padding-bottom: 0px;
      background-color: rgba(0, 0, 0, 0.1);

      .anticon-close {
        display: inline-block;
      }
    }

    .ant-tabs-tab:hover {
      padding-left: 20px;
      padding-right: 20px;

      .anticon-close {
        color: #333;
        display: inline-block;
      }
    }
  }
}

.ant-pro-multi-tab-wrapper {
  .tab_style() !important;
}
</style>
