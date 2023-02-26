<template>
    <a-modal v-model:visible="props.visible" :title="id ? '添加商品' : '修改商品'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="商品名称" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.categoryName">
                <a-input placeholder="请输入商品名称" v-model:value="form.configName" />
            </a-form-item>
            <a-form-item label="跳转链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入跳转链接" v-model:value="form.redirectUrl" />
            </a-form-item>
            <a-form-item label="商品编号" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.goodsId">
                <a-input placeholder="请输入商品编号" v-model:value="form.goodsId" />
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.configRank">
                <a-input-number v-model:value="form.configRank" size="small" :min="0" :max="1000" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form } from 'ant-design-vue';
import type { IndexConfigParamDTO, IndexConfig } from '@/api/sms/indexConfigApi'
import { _getIndexConfig, _updateIndexConfig, _addIndexConfig } from '@/api/sms/indexConfigApi'
//商品属性分类下拉选项
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
    configType: number,
    id?: any
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
const form = reactive<Partial<IndexConfigParamDTO>>({
    configName: undefined,
    redirectUrl: undefined,
    goodsId: undefined,
    configRank: 0
})
form.configType = props.configType
const rulesRef = reactive({
    configName: [{
        required: true,
        message: '请必须输入名称',
        trigger: "blur"
    }],
    goodsId: [{
        required: true,
        message: '必须输入',
        trigger: "blur"
    }],
    configRank: [{
        required: true,
        message: '必须输入排序',
        trigger: "blur"
    }],
})
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
    validate().then(async () => {
        if (props.id) {
            _updateIndexConfig(form as any).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addIndexConfig(form as any).then(res => {
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
const getDetail = (id: string) => {
    _getIndexConfig(id).then(res => {
        let result = res.data
        Object.assign(form, result)
    })
}
if (props.id && props.id !== 0) {
    getDetail(props.id)
}
</script>
<style lang="less" scoped></style>