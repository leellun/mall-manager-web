<template>
    <a-modal :visible="props.visible" :title="id ? '编辑角色' : '新增角色'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.name">
                <a-input placeholder="请输入角色名称" v-model:value="form.name" />
            </a-form-item>
            <a-form-item label="编码" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.code">
                <a-input placeholder="请输入角色编码" v-model:value="form.code" />
            </a-form-item>
            <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-textarea placeholder="请输入描述" v-model:value="form.description" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'ant-design-vue';
import type { Role } from '@/api/system/roleApi'
import { _addRole, _getRole, _updateRole } from '@/api/system/roleApi'
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
const form = reactive<Partial<Role>>({
    id: undefined,
    name: undefined,
    code:undefined,
    description: undefined
})
const rulesRef = reactive({
    name: [{
        required: true,
        message: '必须输入角色',
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
    code: [{
        required: true,
        message: '必须输入编码',
        trigger: "blur"
    }],
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        if (props.id) {
            _updateRole(form as Role).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addRole(form as Role).then(res => {
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
const getRole = (id: string) => {
    _getRole(id).then(res => {
        let result = res.data
        form.id = result.id
        form.name = result.name
        form.code = result.code
        form.description = result.description
    })
}
if (props.id) {
    getRole(props.id)
}
</script>
<style lang="less" scoped>

</style>