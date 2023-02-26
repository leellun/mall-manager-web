<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd" v-permission="['job:add']"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" danger size="small" style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
                @click="handleDeleteSelected" v-permission="['job:delete']"><delete-outlined />批量删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }" rowKey="carouselId"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key == 'carouselUrl'">
                    <a-image :width="100" :src="record.carouselUrl" />
                </template>
                <template v-if="column.key === 'action'">
                    <span>
                        <a @click="(e?: Event) => handleEditRecord(e, record.carouselId)">编辑</a>
                        <a-divider type="vertical" />
                        <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否"
                            @confirm="() => handleDeleteRecord([record.carouselId])">
                            <a>删除</a>
                        </a-popconfirm>
                    </span>
                </template>
            </template>
        </a-table>
        <CarouseModal v-model:visible="modalVisible" :id="modalId"  v-if="modalVisible"
        @ok="handleOk" />
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
  import CarouseModal from './modals/CarouseModal.vue'
import type { PageSearch } from "@/api/types";
import type { Carousel } from '@/api/sms/carouselApi'
import { _deleteCarouselBatch, _getCarouselPage } from '@/api/sms/carouselApi'
import { Form, Modal } from 'ant-design-vue';
const modalId = ref<any>()
const modalVisible = ref<boolean>(false)
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Carousel | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<PageSearch>>({
})
formRef.pageNo = pagination.current
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
    {
        title: '轮播图',
        key: 'carouselUrl',
        width: 100
    }, {
        title: '跳转链接',
        dataIndex: 'redirectUrl',
        key: 'redirectUrl',
        width: 100
    }, {
        title: '排序值',
        dataIndex: 'carouselRank',
        key: 'carouselRank',
        width: 100
    }, {
        title: '添加时间', dataIndex: 'createTime',
        key: 'createTime',
        width: 100
    }, {
        title: '添加时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 100
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
    getPageProducts()
}
const getPageProducts = () => {
    loading.value = true
    formRef.pageSize = pagination.pageSize
    _getCarouselPage(formRef as any).then(res => {
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
const handleOk = () => {
    formRef.pageNo = 1
    getPageProducts()
};
const handleTableChange = (page: any, filters: any, sorter: any) => {
    formRef.pageNo = page.current
    getPageProducts();
}
const handleResetSearch = () => {
    resetFields()
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    modalVisible.value = true
    modalId.value = undefined
}
const handleDeleteSelected = (e?: Event) => {
    e?.preventDefault()
    if (selectedRowKeys.value.length > 0) {
        Modal.confirm({
            title: "系统提示",
            content: "是否删除选中商品？",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                handleDeleteRecord(selectedRowKeys.value)
            },
        });

    }
}
const handleEditRecord = (e?: Event, id?: string) => {
    e?.preventDefault()
    modalId.value = id
    modalVisible.value = true
}
const handleDeleteRecord = (ids: string[]) => {
    _deleteCarouselBatch(ids).then(res => {
        handleSearch()
    })
}
handleSearch()
</script>
<style lang="less" scoped></style>