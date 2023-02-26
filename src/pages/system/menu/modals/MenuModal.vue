<template>
    <a-modal :visible="props.visible" :title="id ? '编辑菜单' : '新增菜单'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="菜单标题" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.title">
                <a-input placeholder="请输入菜单标题" v-model:value="form.title" />
            </a-form-item>
            <a-form-item label="父菜单" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-tree-select v-model:value="form.pid" tree-data-simple-mode style="width: 100%" placeholder="请选择..."
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="orgaTree"
                    :load-data="onLoadData">
                    <template #title="{ value: val, title }">
                        <template v-if="val === undefined && form.pid !== undefined">{{ form.parentName }}</template>
                        <template v-else>{{ title }}</template>
                    </template>
                </a-tree-select>
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.menuSort">
                <a-input-number v-model:value="form.menuSort" size="small" :min="0" :max="1000" />
            </a-form-item>
            <a-form-item label="菜单类型" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.type">
                <a-radio-group v-model:value="form.type" button-style="solid">
                    <a-radio-button :value="1">菜单</a-radio-button>
                    <a-radio-button :value="2">按钮</a-radio-button>
                </a-radio-group>
            </a-form-item>
            <a-form-item v-if="form.type === 1" label="地址类型" :labelCol="labelCol" :wrapperCol="wrapperCol"
                v-bind="validateInfos.target">
                <a-select placeholder="请选择" v-model:value="form.target">
                    <a-select-option :value="0">内部路由</a-select-option>
                    <a-select-option :value="1">内部外链</a-select-option>
                    <a-select-option :value="2">跳转外链</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-if="form.type === 1 && form.target === 0" label="组件名称" :labelCol="labelCol"
                :wrapperCol="wrapperCol">
                <a-input placeholder="请输入组件名称" v-model:value="form.name" />
            </a-form-item>
            <a-form-item v-if="form.type === 1 && form.target === 0" label="组件" :labelCol="labelCol"
                :wrapperCol="wrapperCol">
                <a-input placeholder="请输入组件" v-model:value="form.component" />
            </a-form-item>
            <a-form-item v-if="form.type === 1" label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol"
                v-bind="validateInfos.path">
                <a-input placeholder="请输入地址" v-model:value="form.path" />
            </a-form-item>
            <a-form-item v-if="form.type === 1" label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol"
                v-bind="validateInfos.icon">
                <a-input placeholder="请输入图标" v-model:value="form.icon" />
            </a-form-item>
            <a-form-item v-if="form.type === 1 && form.target === 0" label="缓存" :labelCol="labelCol"
                :wrapperCol="wrapperCol" v-bind="validateInfos.keepAlive">
                <a-select placeholder="请选择" v-model:value="form.keepAlive">
                    <a-select-option :value="1">缓存</a-select-option>
                    <a-select-option :value="0">不缓存</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item v-if="form.type === 1" label="显示" :labelCol="labelCol" :wrapperCol="wrapperCol"
                v-bind="validateInfos.hidden">
                <a-select placeholder="请选择" v-model:value="form.hidden">
                    <a-select-option :value="0">显示</a-select-option>
                    <a-select-option :value="1">隐藏</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item v-if="form.type === 2" label="权限" :labelCol="labelCol" :wrapperCol="wrapperCol"
                v-bind="validateInfos.permission">
                <a-input placeholder="请输入权限" v-model:value="form.permission" />
            </a-form-item>

        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message, TreeSelectProps, Form } from 'ant-design-vue';
import type { Menu } from '@/api/system/menuApi'
import { _addMenu, _getMenu, _updateMenu, _getSubMenus } from '@/api/system/menuApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: any,
    pid?: any,
    parentName?: string
}>(), {
    visible: false
})
const labelCol = {
    xs: { span: 24 },
    sm: { span: 5 },
}
const wrapperCol = {
    xs: { span: 24 },
    sm: { span: 16 },
}
const form = reactive<Partial<Menu | any>>({
    id: undefined,
    title: undefined,
    component: undefined,
    name: undefined,
    type: 1,
    menuSort: 0,
    target: 0,
    keepAlive: 1,
    hidden: 0,
    pid: undefined,
    icon: undefined,
    path: undefined,
    permission: undefined,
    parentName: undefined
})
if (props.pid != undefined) {
    form.pid = props.pid
    form.parentName = props.parentName
}
const rulesRef = reactive({
    title: [{
        required: true,
        message: '必须输入菜单标题',
        trigger: "blur"
    }, {
        validator: (rule: any, value: string) => {
            const regex = /^([\u4e00-\u9fa5\u4e00-\u9fa5]{2,10})|(\S{1,15})$/
            if (regex.test(value)) {
                return Promise.resolve()
            } else {
                return Promise.reject()
            }
        },
        trigger: 'change'
    }],
    menuSort: [{
        required: true,
        message: '必须输入排序',
        trigger: "blur"
    }],
    type: [{
        required: true,
        message: '必须选择类型',
        trigger: "blur"
    }],
    target: [{
        required: true,
        message: '必须地址类型',
        trigger: "blur"
    }],
    name: [{
        required: true,
        message: '必须组件名称',
        trigger: "blur"
    }],
    component: [{
        required: true,
        message: '必须组件',
        trigger: "blur"
    }],
    keepAlive: [{
        required: true,
        message: '缓存选择',
        trigger: "blur"
    }],
    hidden: [{
        required: true,
        message: '缓存设置',
        trigger: "blur"
    }],
    permission: [{
        required: true,
        message: '权限设置',
        trigger: "blur"
    }],
})
const { validate, validateInfos } = useForm(form, rulesRef)
const orgaTree = ref<TreeSelectProps['treeData']>([]);
const onLoadData = (treeNode: any) => {
    return new Promise(resolve => {
        getSubMenus(treeNode, resolve)
    });
};
const getSubMenus = (treeNode?: any, resolve?: any) => {
    let pid = treeNode ? treeNode.id : '0'
    _getSubMenus(pid).then(res => {
        let tmpTreeData
        if (treeNode) {
            let node = findMenu(treeNode.key, orgaTree.value as Array<any>)
            tmpTreeData = new Array<any>()
            node!.children = tmpTreeData
        } else {
            tmpTreeData = orgaTree.value
        }
        let result: Array<Menu> | Array<any> = res.data
        result.forEach(item => {
            item.isLeaf = item.subCount == 0
            tmpTreeData?.push({
                isLeaf: item.subCount === 0,
                id: item.id,
                key: item.id,
                value: item.id,
                pid: pid,
                title: item.title,
            })
        });
        if (treeNode) {
            treeNode!.children = tmpTreeData
            resolve()
        }
    })
}
getSubMenus()
const findMenu = (key: string, menus: Array<any>) => {
    if (menus) {
        for (let node of menus) {
            if (node.key === key) {
                return node
            } else if (node.children && node.children.length > 0) {
                let n: any = findMenu(key, node.children)
                if (n != null) {
                    return n
                }
            }
        }
    }
    return null
}
const handleOk = () => {
    let fields: Array<string> = ["title", "menuSort", "type"]
    if (form.type === 1) {
        fields.push(...["target"])
        if (form.target === 0) {
            if (form.path === undefined || form.path === null || form.path.trim() === '') {
                if (form.name === undefined || form.name === null || form.name.trim() === '' || form.component === undefined || form.component === null || form.component.trim() === '') {
                    message.error("组件名、组件或者地址必须选择其一")
                    return
                }
            }
            fields.push(...["keepAlive"])
        } else {
            if (form.path === undefined || form.path === null || form.path.trim() === '') {
                message.error("请输入地址")
                return;
            }
            fields.push(...["hidden"])
        }
    } else {
        if (form.pid === undefined || form.pid === 0) {
            message.error("请选择菜单")
            return;
        }
        fields.push(...["permission"])
    }
    validate(fields).then(async () => {
        if (props.id) {
            _updateMenu(form as Menu).then(res => {
                emit("update:visible", false)
                emit("ok", form.pid)
            })
        } else {
            _addMenu(form as Menu).then(res => {
                emit("update:visible", false)
                emit("ok", form.pid)
            })
        }
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
const getMenu = (id: string) => {
    _getMenu(id).then(res => {
        let result: Menu | any = res.data
        Object.keys(result).forEach(key => {
            if (form.hasOwnProperty(key)) {
                form[key] = result[key]
            }
        });
    })
}
if (props.id) {
    getMenu(props.id)
}
</script>
<style lang="less" scoped>

</style>