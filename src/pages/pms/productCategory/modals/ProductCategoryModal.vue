<template>
    <a-modal v-model:visible="props.visible" :title="id ? '编辑分类' : '新增分类'" @ok="handleOk" @cancel="handleCancel">
        <a-form :model="form">
            <a-form-item label="分类" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.categoryName">
                <a-input placeholder="请输入分类名称" v-model:value="form.categoryName" />
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.categoryRank">
                <a-input-number v-model:value="form.categoryRank" size="small" :min="0" :max="1000" />
            </a-form-item>
            <a-form-item label="父类" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.parentId">
                <a-tree-select v-model:value="form.parentId" style="width: 300px" placeholder="请选择..."
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="productCateOptions">
                    <template #title="{ value: val, title }">
                        <template v-if="val === undefined || val === 0">顶级分类{{ val }}</template>
                        <template v-else>{{ title }}</template>
                    </template>
                </a-tree-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TreeSelectProps, Form } from 'ant-design-vue';
import type { ProductCategoryParamDTO, ProductCateSelectItem } from '@/api/pms/productCategoryApi'
import { _getAllProductCategorySelect, _getProductCategoryDetail, _updateProductCategory, _addProductCategory } from '@/api/pms/productCategoryApi'
//商品属性分类下拉选项
const productCateOptions = ref<TreeSelectProps['treeData']>([]);
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
const form = reactive<Partial<ProductCategoryParamDTO>>({
    categoryId: undefined,
    parentId: 0,
    categoryName: undefined,
    categoryRank: 0
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
            _updateProductCategory(form as any).then(res => {
                emit("update:visible", false)
                emit("ok")
            })
        } else {
            _addProductCategory(form as any).then(res => {
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
    _getProductCategoryDetail(id).then(res => {
        let result = res.data
        Object.assign(form, result)
    })
}
if (props.id && props.id !== 0) {
    getDetail(props.id)
}
const getProductCategoryItem = (cate: ProductCateSelectItem): any => {
    let categoryOption: any = {}
    if (cate.children != null && cate.children.length > 0) {
        categoryOption = { title: cate.categoryName, key: cate.categoryId, value: cate.categoryId, children: [], selectable: true }
        cate.children.forEach(item => {
            categoryOption.children.push(getProductCategoryItem(item))
        })
    } else {
        categoryOption = { title: cate.categoryName, key: cate.categoryId, value: cate.categoryId, selectable: true }
    }
    return categoryOption
}
_getAllProductCategorySelect().then(res => {
    productCateOptions.value = [];
    res.data.forEach(item => {
        productCateOptions.value?.push(getProductCategoryItem(item))
    })
})
</script>
<style lang="less" scoped></style>