<template>
    <a-modal v-model:visible="props.visible" :title="id ? '编辑部门' : '新增部门'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.name">
                <a-input placeholder="请输入部门名称" v-model:value="form.name" />
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.deptSort">
                <a-input-number v-model:value="form.deptSort" size="small" :min="0" :max="1000" />
            </a-form-item>
            <a-form-item label="父部门" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.pid">
                <a-tree-select v-model:value="form.pid" tree-data-simple-mode style="width: 100%"
                    placeholder="请选择..." :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :tree-data="orgaTree" :load-data="onLoadData">
                    <template #title="{ value: val, title }">
                        <template v-if="val === undefined && form.pid !== undefined">{{ form.parentName }}</template>
                        <template v-else>{{ title }}</template>
                    </template>
                </a-tree-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { message, TreeSelectProps, Form } from 'ant-design-vue';
import type { Dept } from '@/api/system/deptApi'
import { _addDept, _getDept, _updateDept, _getSubDepts } from '@/api/system/deptApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    id?: string
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
const form = reactive<Partial<Dept|any>>({
    id: undefined,
    name: undefined,
    deptSort: 0,
    pid: undefined,
    pName: undefined
})
const rulesRef = reactive({
    name: [{
        required: true,
        message: '必须输入部门',
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
    deptSort: [{
        required: true,
        message: '必须输入排序',
        trigger: "blur"
    }],
})
const { validate, validateInfos } = useForm(form, rulesRef)
const orgaTree = ref<TreeSelectProps['treeData']>([]);
const onLoadData = (treeNode: any) => {
    return new Promise(resolve => {
        getSubDepts(treeNode, resolve)
    });
};
const getSubDepts = (treeNode?:any, resolve?: any) => {
    let pid = treeNode ? treeNode.id : '0'
    _getSubDepts(pid).then(res => {
        let tmpTreeData
        if (treeNode) {
            let node = findSubDept(treeNode.key, orgaTree.value as Array<any>)
            tmpTreeData = new Array<any>()
            node!.children = tmpTreeData
        } else {
            tmpTreeData = orgaTree.value
        }
        res.data.forEach(item => {
            item.isLeaf = item.subCount == 0
            tmpTreeData?.push({
                isLeaf: item.subCount === 0,
                id: item.id,
                key: item.id,
                value: item.id,
                pid: pid,
                title: item.name,
            })
        });
        if (treeNode) {
            treeNode!.children = tmpTreeData
            resolve()
        }
    })
}
getSubDepts()
const findSubDept = (key: string, menus: Array<any>) => {
    if (menus) {
        for (let node of menus) {
            if (node.key === key) {
                return node
            } else if (node.children && node.children.length > 0) {
                let n:any = findSubDept(key, node.children)
                if (n != null) {
                    return n
                }
            }
        }
    }
    return null
}
const handleOk = () => {
    validate().then(async () => {
        if (props.id) {
            _updateDept(form as Dept).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addDept(form as Dept).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        }
    })
}
const handleCancel = () => {
    emit("update:visible", false)
    emit("cancel")
}
const getDept = (id: string) => {
    _getDept(id).then(res => {
        let result = res.data
        form.id = result.id
        form.name = result.name
        form.parentName = result.parentName
        form.pid = result.pid
        form.deptSort = result.deptSort
    })
}
if (props.id) {
    getDept(props.id)
}
</script>
<style lang="less" scoped>

</style>