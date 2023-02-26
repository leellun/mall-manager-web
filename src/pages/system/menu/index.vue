<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"  v-permission="['menu:add']"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" danger size="small" style="margin-left:10px"
                :disabled="selectedRowKeys.length == 0" @click="handleDeleteSelected"  v-permission="['menu:delete']"><delete-outlined />删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }" v-model:expandedRowKeys="expandedRowKeys"
            @expand="handleExpand" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'name'">
                    <template v-if="record.name != null && record.name != ''">
                        组件名： {{ record.name }} <br />
                    </template>
                    <template v-if="record.component != null && record.component != ''">
                        组件： {{ record.component }} <br />
                    </template>
                    <template v-if="record.path != null && record.path != ''">
                        地址： {{ record.path }}
                    </template>
                </template>
                <template v-else-if="column.key === 'keepAlive'">{{ record.keepAlive === 1 ? '缓存' : '不缓存' }}</template>
                <template v-else-if="column.key === 'hidden'">{{ record.hidden === 1 ? '隐藏' : '显示' }}</template>
                <template v-else-if="column.key === 'menuSort'">
                    <a-input-number :value="record.menuSort" size="small" :min="0" :max="1000"
                        @change="(value: number) => handleMenuSort(record, value)" />
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.id)" v-permission="['menu:update']">编辑</a>
                        <a-divider type="vertical"  v-permission="['menu:update']"/>
                        <a-switch :checked="record.enabled === 1" checked-children="启用" un-checked-children="禁用"
                            @change="handleEnableChange(record, record.enabled === 0 ? 1 : 0)"  v-permission="['menu:update']"/>
                        <a-divider type="vertical"  v-permission="['menu:update']"/>
                        <a-popconfirm title="是否删除菜单？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord(record)">
                            <a v-permission="['menu:delete']">删除</a>
                        </a-popconfirm>
                        <a-divider type="vertical"  v-permission="['menu:delete']"/>
                        <a @click="(e: Event) => handleAppendChildMenu(record, e)" v-permission="['menu:update']">追加</a>
                    </span>
                </template>
            </template>
        </a-table>
        <MenuModal v-model:visible="modalVisible" :id="menuId" :pid="menuPid" :parentName="menuParentName"
            v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { Modal } from 'ant-design-vue';
import type { MenuSearch, Menu } from '@/api/system/menuApi'
import { _getPageMenus, _getSubMenus, _deleteMenu, _updateMenuSort, _enableMenu } from '@/api/system/menuApi'
import MenuModal from './modals/MenuModal.vue';
const menuId = ref<string>()
const menuPid = ref<string>()
const menuParentName = ref<string>()
const modalVisible = ref<boolean>(false)
const selectedRowKeys = ref<string[]>([]);
const expandedRowKeys = ref<string[]>([]);
const data = ref<Array<Menu | any>>([]);
const pagination = reactive<any>({ pageSize: 10, pageNo: 1 })
const formRef = reactive<Partial<MenuSearch>>({
    pageSize: 10,
    pageNo: 1
})
const loading = ref<boolean>(false)
const columns = [
    {
        title: '菜单名',
        dataIndex: 'title',
        key: 'title',
        width: 100
    }, {
        title: '组件',
        key: 'name',
        width: 160
    }, {
        title: '排序',
        key: 'menuSort',
        dataIndex: 'menuSort',
        width: 80
    }, {
        title: '图标',
        key: 'icon',
        dataIndex: 'icon',
        width: 60
    }, {
        title: '权限',
        key: 'permission',
        dataIndex: 'permission',
        width: 100
    }, {
        title: '缓存',
        key: 'keepAlive',
        dataIndex: 'keepAlive',
        width: 50
    }, {
        title: '隐藏',
        key: 'hidden',
        dataIndex: 'hidden',
        width: 50
    }, {
        title: '创建日期',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 120
    }, {
        title: '操作',
        fixed: 'right',
        width: 180,
        key: 'action'
    }
];
const onSelectChange = (keys: string[]) => {
    selectedRowKeys.value = keys;
};
const handleSearch = () => {
    formRef.pageNo = 1
    getPageMenus()
}
const getPageMenus = () => {
    loading.value = true
    _getPageMenus(formRef as MenuSearch).then(res => {
        pagination.pageNo = res.data.pageNum
        pagination.total = res.data.total
        data.value = res.data.list
        data.value.forEach(item => {
            item.key = item.id
            if (item.subCount > 0) {
                item.children = []
            }
        })
        expandedRowKeys.value = []
    }).finally(() => {
        loading.value = false
    })
}
const handleTableChange = (page: any, filters: any, sorter: any) => {
    pagination.pageNo = page.current;
    getPageMenus();
}
const handleExpand = (expanded: boolean, record: Menu) => {
    if (expanded && record.subCount > 0 && record.children.length == 0) {
        _getSubMenus(record.id).then(res => {
            let result = res.data as Array<Menu> | Array<any>
            result.forEach(item => {
                item.key = item.id
                if (item.subCount > 0) {
                    item.children = []
                }
            })
            record.children = result
            if (result.length == 0) {
                removeMenuExpandIds([record])
            }
        })
    }
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    menuId.value = undefined
    menuPid.value = undefined
    menuParentName.value = undefined
    modalVisible.value = true;
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        Modal.confirm({
            title: "系统提示",
            content: "是否删除选中菜单？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                handleDeleteRecord(selectedRowKeys.value)
            },
        });

    }
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    menuId.value = id
    menuPid.value = undefined
    menuParentName.value = undefined
    modalVisible.value = true;
}
const handleAppendChildMenu = (record: Menu, e?: Event) => {
    e?.preventDefault()
    menuId.value = undefined
    menuPid.value = record.id
    menuParentName.value = record.title
    modalVisible.value = true

}
const handleDeleteRecord = (ids: string[] | Menu) => {
    let arr: Array<string> = []
    if (ids instanceof Array) {
        arr.push(...ids)
    } else {
        arr.push(ids.id)
    }
    _deleteMenu(arr).then(res => {
        if (!(ids instanceof Array)) {
            let pid = ids.pid
            if (pid === undefined || pid === null || pid === '0') {
                handleSearch()
            } else {
                refreshParentMenu(pid, false)
            }
        } else {
            getPageMenus()
        }
    })
}
const handleOk = (pid: string) => {
    if (pid === undefined || pid === null || pid === '0') {
        handleSearch()
    } else {
        refreshParentMenu(pid, true)
    }
};
const refreshParentMenu = (pid: string, add: boolean) => {
    let menu = findMenu(pid, data.value)
    removeMenuExpandIds([menu])
    if (add) {
        if (menu.subCount === 0) {
            menu.subCount = 1
        }
    } else {
        menu.subCount -= 1
    }

    if (menu.subCount > 0) {
        menu.children = []
        handleExpand(true, menu)
        expandedRowKeys.value.push(menu.id)
    } else {
        menu.children = undefined
    }
}
const handleEnableChange = (record: Menu, enabled: number) => {
    let prevEnabled = record.enabled
    record.enabled = enabled
    _enableMenu(record.id, enabled).catch(err => {
        record.enabled = prevEnabled
    })
}
const findMenu = (id: string, menus: Array<any>) => {
    for (let menu of menus) {
        if (menu.id === id) {
            return menu
        } else if (menu.children && menu.children.length > 0) {
            let n: any = findMenu(id, menu.children)
            if (n != null) {
                return n
            }
        }
    }
    return null
}
const removeMenuExpandIds = (menus: Array<any>) => {
    for (let menu of menus) {
        let index = expandedRowKeys.value.indexOf(menu.id)
        if (index >= 0) {
            expandedRowKeys.value.splice(index, 1)
        }
        if (menu.children && menu.children.length > 0) {
            removeMenuExpandIds(menu.children)
        }
    }
}
let sortTimeOut: any = {};
const handleMenuSort = (menu: Menu, value: number) => {
    menu.menuSort = value
    if (sortTimeOut[menu.id] !== undefined) {
        clearTimeout(sortTimeOut[menu.id])
    }
    sortTimeOut[menu.id] = setTimeout(() => {
        _updateMenuSort(menu.id, value).then(res => {
            refreshGroupMenuSort(menu.id, data.value)
        })
    }, 1000)
}
const refreshGroupMenuSort = (id: string, menus: Array<Menu>) => {
    var result = false
    for (let menu of menus) {
        if (id === menu.id) {
            result = true
            break
        }
        if (menu.children && menu.children.length > 0) {
            refreshGroupMenuSort(id, menu.children)
        }
    }
    if (result) {
        menus.sort((a, b) => a.menuSort - b.menuSort)
    }
}
handleSearch()
</script>
<style lang="less" scoped>

</style>