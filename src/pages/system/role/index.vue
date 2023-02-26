<template>
    <div class="main-container">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" @submit="handleSearch">
            <a-form-item>
                <a-input size="small" v-model:value="formRef.name" placeholder="输入名称">
                    <template #prefix>
                        <search-outlined style="color: rgba(0, 0, 0, 0.25)" />
                    </template>
                </a-input>
            </a-form-item>
            <a-form-item>
                <a-select v-model:value="formRef.enabled" size="small" style="width: 200px" placeholder="状态">
                    <a-select-option value="1">启用</a-select-option>
                    <a-select-option value="0">禁用</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <a-button size="small" type="primary" html-type="submit" v-permission="['role:select']">
                    <template #icon>
                        <SearchOutlined />
                    </template>
                    搜索
                </a-button>
            </a-form-item>
            <a-form-item>
                <a-button size="small" type="primary" @click="handleResetSearch">
                    <template #icon><undo-outlined /></template>
                    重置
                </a-button>
            </a-form-item>
        </a-form>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd" v-permission="['role:add']"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" danger size="small" style="margin-left:10px"
                :disabled="selectedRowKeys.length == 0" @click="handleDeleteSelected" v-permission="['role:delete']"><delete-outlined />删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'enabled'">
                    <a-tag color="green" v-if="record.enabled === 1">启用</a-tag>
                    <a-tag color="red" v-else>禁用</a-tag>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.id)" v-permission="['role:update']">编辑</a>
                        <a-divider type="vertical" v-permission="['role:update']"/>
                        <a-switch :checked="record.enabled === 1" checked-children="启用" un-checked-children="禁用"
                            @change="handleEnableChange(record, record.enabled === 0 ? 1 : 0)"  v-permission="['role:update']"/>
                        <a-divider type="vertical" v-permission="['role:update']"/>
                        <a-popconfirm title="是否删除角色？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord([record.id])">
                            <a v-permission="['role:delete']">删除</a>
                        </a-popconfirm>
                        <a-divider type="vertical" v-permission="['role:delete']"/>
                        <a @click="(e?: Event) => handlePermission(e, record.id)" v-permission="['role:update']">权限设置</a>
                    </span>
                </template>
            </template>
        </a-table>
        <RoleModal v-model:visible="modalVisible" :id="roleId" v-if="modalVisible" @ok="handleOk" />
        <MenuPermission v-model:visible="permissionModalVisible" :id="(roleId as string)" v-if="permissionModalVisible" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import type { RoleSearch, Role } from '@/api/system/roleApi'
import { _getRolesPage, _deleteRole, _enableRole } from '@/api/system/roleApi'
import { Form, Modal } from 'ant-design-vue';
import RoleModal from './modals/RoleModal.vue';
import MenuPermission from '@/pages/system/menu/modals/MenuPermission.vue';
const roleId = ref<string>()
const modalVisible = ref<boolean>(false)
const permissionModalVisible = ref<boolean>(false)
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Role | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<RoleSearch>>({
    name: undefined,
    enabled: undefined
})
formRef.pageSize = pagination.pageSize
formRef.pageNo = pagination.current
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
    {
        title: '角色名',
        dataIndex: 'name',
        key: 'name',
        width: 100
    }, {
        title: '状态',
        key: 'enabled',
        width: 60
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
    getPageRoles()
}
const getPageRoles = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getRolesPage(formRef as RoleSearch).then(res => {
        pagination.pageNo = res.data.pageNum
        pagination.total = res.data.total
        data.value = res.data.list
        data.value.forEach(item => {
            item.key = item.id
        })
    }).finally(() => {
        loading.value = false
    })
}
const handleTableChange = (page: any, filters: any, sorter: any) => {
    pagination.pageNo = page.current;
    getPageRoles();
}
const handleResetSearch = () => {
    resetFields()
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    roleId.value = undefined
    modalVisible.value = true;
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        Modal.confirm({
            title: "系统提示",
            content: "是否删除选中角色？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                handleDeleteRecord(selectedRowKeys.value)
            },
        });

    }
}
const handlePermission = (e?: Event, id?: string) => {
    e?.preventDefault()
    roleId.value = id
    permissionModalVisible.value = true;
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    roleId.value = id
    modalVisible.value = true;
}
const handleDeleteRecord = (ids: string[]) => {
    _deleteRole(ids).then(res => {
        getPageRoles()
    })
}
const handleOk = () => {
    handleSearch()
};
const handleEnableChange = (record: Role, enabled: number) => {
    record.enabled = enabled
    _enableRole(record.id, enabled).then(res => {
        getPageRoles()
    })
}
handleSearch()
</script>
<style lang="less" scoped>

</style>