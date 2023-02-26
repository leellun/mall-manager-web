<template>
    <div>
        <a-card class="add-container">
            <a-form :model="formRef" :labelCol="{ style: { width: '100px' } }">
                <a-form-item required label="商品分类">
                    <a-tree-select v-model:value="formRef.goodsCategoryId" style="width: 300px" placeholder="请选择..."
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="productCateOptions">
                    </a-tree-select>
                </a-form-item>
                <a-form-item label="商品名称" v-bind="validateInfos.goodsName">
                    <a-input style="width: 300px" v-model:value="formRef.goodsName" placeholder="请输入商品名称"></a-input>
                </a-form-item>
                <a-form-item label="商品简介">
                    <a-input style="width: 300px" type="textarea" v-model:value="formRef.goodsIntro"
                        placeholder="请输入商品简介(100字)"></a-input>
                </a-form-item>
                <a-form-item label="商品价格" v-bind="validateInfos.originalPrice">
                    <a-input type="number" min="0" style="width: 300px" v-model:value="formRef.originalPrice"
                        placeholder="请输入商品价格"></a-input>
                </a-form-item>
                <a-form-item label="商品售卖价" v-bind="validateInfos.sellingPrice">
                    <a-input type="number" min="0" style="width: 300px" v-model:value="formRef.sellingPrice"
                        placeholder="请输入商品售价"></a-input>
                </a-form-item>
                <a-form-item label="商品库存" v-bind="validateInfos.stockNum">
                    <a-input type="number" min="0" style="width: 300px" v-model:value="formRef.stockNum"
                        placeholder="请输入商品库存"></a-input>
                </a-form-item>
                <a-form-item label="商品标签" v-bind="validateInfos.tag">
                    <a-input style="width: 300px" v-model:value="formRef.tag" placeholder="请输入商品小标签"></a-input>
                </a-form-item>
                <a-form-item label="上架状态">
                    <a-radio-group v-model:value="formRef.goodsSellStatus">
                        <a-radio :value="0">上架</a-radio>
                        <a-radio :value="1">下架</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item label="商品主图" v-bind="validateInfos.goodsCoverImg">
                    <single-upload v-model:value="formRef.goodsCoverImg"></single-upload>
                </a-form-item>
                <a-form-item label="详情内容">
                    <tinymce :width="595" :height="300" v-model:value="formRef.goodsDetailContent"></tinymce>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="submitAdd()">{{ id ? '立即修改' : '立即创建' }}</a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>
  
<script setup lang="ts">
import { reactive, ref } from 'vue'
import Tinymce from '@/components/Tinymce/index.vue'
import SingleUpload from '@/components/Upload/SingleUpload.vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product } from '@/api/pms/productApi'
import { _getProduct, _addProduct, _updateProduct } from '@/api/pms/productApi'
import { _getAllProductCategorySelect } from '@/api/pms/productCategoryApi'
import type { ProductCateSelectItem } from '@/api/pms/productCategoryApi'
import { TreeSelectProps, Form } from 'ant-design-vue';
const formRef = reactive<Partial<Product>>({
    goodsName: '',
    goodsIntro: '',
    originalPrice: 0,
    sellingPrice: 0,
    stockNum: 0,
    goodsSellStatus: 0,
    goodsCoverImg: '',
    tag: ''
})
//商品属性分类下拉选项
const productCateOptions = ref<TreeSelectProps['treeData']>([]);
const useForm = Form.useForm
const route = useRoute()
const router = useRouter()
const { id } = route.query
const rulesRef = reactive({
    goodsName: [
        { required: 'true', message: '请填写商品名称', trigger: "blur" }
    ],
    originalPrice: [
        { required: 'true', message: '请填写商品价格', trigger: "blur" }
    ],
    sellingPrice: [
        { required: 'true', message: '请填写商品售价', trigger: "blur" }
    ],
    stockNum: [
        { required: 'true', message: '请填写商品库存', trigger: "blur" }
    ],
    goodsCoverImg: [
        { required: 'true', message: '商品主图不能为空', trigger: "blur" }
    ],
    tag: [
        { required: 'true', message: '商品标签不能为空', trigger: "blur" }
    ],
})
const { validate, resetFields, validateInfos } = useForm(formRef, rulesRef)

if (id) {
    _getProduct(id).then(res => {
        Object.assign(formRef,res.data)
    }).catch(e => {
        router.push({ name: 'product' })
    })
}
const getProductCategoryItem = (cate: ProductCateSelectItem): any => {
    let categoryOption: any = {}
    if (cate.children != null && cate.children.length > 0) {
        categoryOption = { title: cate.categoryName, key: cate.categoryId, value: cate.categoryId,children:[], selectable: true }
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
const submitAdd = () => {
    validate().then(() => {
        if (id) {
            _updateProduct(formRef as any).then(res => {
                router.push({name:'product'})
            })
        } else {
            _addProduct(formRef as any).then(res => {
                router.push({name:'product'})
            })
        }
    }).catch(e=>{

    })
}

</script>
  
<style scoped>
.add {
    display: flex;
}

.add-container {
    flex: 1;
    height: 100%;
}

.avatar-uploader {
    width: 100px;
    height: 100px;
    color: #ddd;
    font-size: 30px;
}

.avatar-uploader-icon {
    display: block;
    width: 100%;
    height: 100%;
    border: 1px solid #e9e9e9;
    padding: 32px 17px;
}
</style>