<template>
    <a-modal v-model:visible="props.visible" :title="id ? '添加轮播图' : '修改轮播图'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="图片" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.carouselUrl">
                <single-upload v-model:value="form.carouselUrl"></single-upload>
            </a-form-item>
            <a-form-item label="跳转链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input placeholder="请输入跳转链接" v-model:value="form.redirectUrl" />
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.carouselRank">
                <a-input-number v-model:value="form.carouselRank" size="small" :min="0" :max="1000" />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Form } from 'ant-design-vue';
import type { Carousel } from '@/api/sms/carouselApi'
import { _getCarousel, _addCarousel, _updateCarousel } from '@/api/sms/carouselApi'
//商品属性分类下拉选项
const emit = defineEmits(["update:visible", "ok", "cancel"])
const useForm = Form.useForm
const props = withDefaults(defineProps<{
    visible: boolean,
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
const form = reactive<Partial<Carousel>>({
    redirectUrl: undefined,
})
const rulesRef = reactive({
    carouselUrl: [{
        required: true,
        message: '请选择图片',
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
            _updateCarousel(form as any).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addCarousel(form as any).then(res => {
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
if (props.id && props.id !== 0) {
    _getCarousel(props.id).then(res => {
        let result = res.data
        Object.assign(form, result)
    })
}
</script>
<style lang="less" scoped></style>