<template>
    <a-modal v-model:visible="props.visible" :title="id ? '编辑岗位' : '新增岗位'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="岗位" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.name">
                <a-input placeholder="请输入岗位名称" v-model:value="form.name" />
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.jobSort">
                <a-input-number v-model:value="form.jobSort" size="small" :min="0" :max="1000" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { Form } from 'ant-design-vue';
import type { Job } from '@/api/system/jobApi'
import { _addJob, _getJob, _updateJob } from '@/api/system/jobApi'
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
const form = reactive<Partial<Job>>({
    id: undefined,
    name: undefined,
    jobSort: 0
})
const rulesRef = reactive({
    name: [{
        required: true,
        message: '必须输入岗位',
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
    jobSort: [{
        required: true,
        message: '必须输入排序',
        trigger: "blur"
    }],
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        if (props.id) {
            _updateJob(form as Job).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addJob(form as Job).then(res => {
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
const getJob = (id: string) => {
    _getJob(id).then(res => {
        let result = res.data
        form.id = result.id
        form.name = result.name
        form.jobSort = result.jobSort
    })
}
if (props.id) {
    getJob(props.id)
}
</script>
<style lang="less" scoped>

</style>