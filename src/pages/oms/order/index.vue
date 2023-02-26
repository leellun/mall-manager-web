<template>
    <div class="main-container">
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
            <a-button type="primary" size="small" @click="handleAdd" v-permission="['job:add']"><template #icon>
                    <plus-outlined />
                </template>新增</a-button>
            <a-button type="primary" danger size="small" style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
                @click="handleDeleteSelected"><delete-outlined />删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
            @change="handleTableChange" :scroll="{ x: 280 }" rowKey="goodsId"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
            <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'orderStatus'">
                    {{ getOrderStatusStr(record.orderStatus) }}
                </template>
                <template v-if="column.key === 'payType'">
                    <span v-if="record.payType == 1">微信支付</span>
                    <span v-else-if="record.payType == 2">支付宝支付</span>
                    <span v-else>未知</span>
                </template>
                <template v-else-if="column.key === 'action'">
                    <span>
                        <a-popconfirm v-if="record.orderStatus == 1" title="确定配货完成吗？"
                            @confirm="handleConfig(record.orderId)" ok-text="确定" cancel-text="取消">
                            <a>配货完成</a>
                        </a-popconfirm>
                        <a-divider type="vertical" />
                        <a-popconfirm v-if="record.orderStatus == 2" title="确定出库吗？" @confirm="handleSend(record.orderId)"
                            ok-text="确定" cancel-text="取消">
                            <a>出库</a>
                        </a-popconfirm>
                        <a-divider type="vertical" />
                        <a-popconfirm v-if="!(record.orderStatus == 4 || record.orderStatus < 0)" title="确定关闭订单吗？"
                            @confirm="handleClose(record.orderId)" ok-text="确定" cancel-text="取消">
                            <a>关闭订单</a>
                        </a-popconfirm>
                        <a-divider type="vertical" />
                        <router-link :to="{ path: '/order_detail', query: { id: record.orderId } }">订单详情</router-link>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { OrderSearchParam, Order } from '@/api/oms/orderApi'
import { _getOrderPage } from '@/api/oms/orderApi'
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Order | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<OrderSearchParam>>({
})
formRef.pageNo = pagination.current

const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
    {
        title: '订单号',
        key: 'orderNo',
        dataIndex: 'orderNo',
        width: 100
    }, {
        title: '订单总价',
        dataIndex: 'totalPrice',
        key: 'totalPrice',
        width: 100
    }, {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        width: 100
    }, {
        title: '支付方式',
        key: 'payType',
        width: 100
    }, {
        title: '创建时间',
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
const orderStatusOptions: Array<any> = [{
    value: '',
    label: '全部'
}, {
    value: 0,
    label: '待支付'
}, {
    value: 1,
    label: '已支付'
}, {
    value: 2,
    label: '配货完成'
}, {
    value: 3,
    label: '出库成功'
}, {
    value: 4,
    label: '交易成功'
}, {
    value: -1,
    label: '手动关闭'
}, {
    value: -2,
    label: '超时关闭'
}, {
    value: -3,
    label: '商家关闭'
}]
const getOrderStatusStr = (orderStatus: number) => {
    for (let option of orderStatusOptions) {
        if (option.value === orderStatus) {
            return option.label
        }
    }
    return '未知'
}
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
    _getOrderPage(formRef as any).then(res => {
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
    formRef.pageNo = page.current
    getPageProducts();
}
const handleResetSearch = () => {
    resetFields()
}
const handleAdd = (e?: Event) => {
    e?.preventDefault()
    router.push({
        name: 'addProduct',
    })
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
const handleConfig = (id?: any) => {
    router.push({
        name: 'updateProduct',
        query: {
            id
        }
    })
}
const handleSend = (id?: any) => {
    router.push({
        name: 'updateProduct',
        query: {
            id
        }
    })
}
const handleClose = (id?: any) => {
    router.push({
        name: 'updateProduct',
        query: {
            id
        }
    })
}
const handleDeleteRecord = (ids: string[]) => {
}
handleSearch()
</script>
<style lang="less" scoped></style>