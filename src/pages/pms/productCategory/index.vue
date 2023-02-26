<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" size="small" @click="handleBack" v-if="categoryLevelIds.length > 0"
                style="margin-left:15px">返回</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.categoryId)">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除岗位？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord(record.categoryId)">
                            <a>删除</a>
                        </a-popconfirm>
                        <a-divider type="vertical" />
                        <a @click="handleShowNextLevel(record)" v-if="record.categoryLevel < 4">查看下级</a>
                        <a v-else disabled="true">查看下级</a>

                    </span>
                </template>
            </template>
        </a-table>
        <ProductCategoryModal v-model:visible="modalVisible" :id="modalId" v-if="modalVisible" @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import ProductCategoryModal from './modals/ProductCategoryModal.vue'
import type { ProductCategory, ProductCategoryPageParam } from '@/api/pms/productCategoryApi'
import { _getProductCategorysPage, _deleteProductCategoryBatch, _updateProductCategory, _addProductCategory } from '@/api/pms/productCategoryApi'
const modalId = ref<any>()
const modalVisible = ref<boolean>(false)
const categoryLevelIds = ref<Array<any>>([])
const data = ref<Array<ProductCategory | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<ProductCategoryPageParam>>({})
const loading = ref<boolean>(false)
const columns = [
    {
        title: '分类名称',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: 100
    }, {
        title: '排序值',
        dataIndex: 'categoryRank',
        key: 'categoryRank',
        width: 60
    }, {
        title: '添加时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100
    }, {
        title: '操作',
        fixed: 'right',
        width: 100,
        key: 'action'
    }
];
const router = useRouter()
const getPageLists = () => {
    let parentId = 0
    if (categoryLevelIds.value.length > 0) {
        parentId = categoryLevelIds.value[categoryLevelIds.value.length - 1]
    }
    loading.value = true
    formRef.pageSize = pagination.pageSize
    formRef.parentId = parentId
    _getProductCategorysPage(formRef as any).then(res => {
        pagination.current = res.data.pageNum
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
    pagination.current = page.current;
    formRef.pageNo = page.current
    getPageLists();
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    modalId.value = undefined
    modalVisible.value = true
}
const handleBack = (e?: Event) => {
    e?.preventDefault()
    categoryLevelIds.value.splice(categoryLevelIds.value.length - 1, 1)
    formRef.pageNo = 1
    getPageLists()
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    modalId.value = id
    modalVisible.value = true
}
const handleShowNextLevel = (record: ProductCategory) => {
    if (record.categoryLevel >= 4) return;
    categoryLevelIds.value.push(record.categoryId)
    formRef.pageNo = 1
    getPageLists()
}
const handleDeleteRecord = (id: string) => {
    _deleteProductCategoryBatch([id]).then(res => {
        getPageLists()
    })
}
const handleOk = () => {
    formRef.pageNo = 1
    getPageLists()
};
formRef.pageNo = 1
getPageLists()
</script>
<style lang="less" scoped></style>