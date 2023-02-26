<template>
  <div class="main-container">
    <!-- 操作按钮区域 -->
    <div class="table-operator" style="border-top: 5px">
      <a-button type="primary" size="small" @click="handleAdd" v-permission="['job:add']"><template #icon>
          <plus-outlined />
        </template>新增</a-button>
      <a-button type="primary" danger size="small" style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
        @click="handleDeleteSelected" v-permission="['job:delete']"><delete-outlined />删除</a-button>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading"
      @change="handleTableChange" :scroll="{ x: 280 }" rowKey="goodsId"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'goodsCoverImg'">
          <a-image :width="100" :src="record.goodsCoverImg" />
        </template>
        <template v-else-if="column.key === 'goodsSellStatus'">
          <span style="color: green;" v-if="record.goodsSellStatus == 0">销售中</span>
          <span style="color: red;" v-else>已下架</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <span>
            <a @click="(e?: Event) => handleEditRecord(e, record.goodsId)">编辑</a>
            <a-divider type="vertical" />
            <a v-if="record.goodsSellStatus == 0" @click="handlePublishStatusChange(record.goodsId, 1)">下架</a>
            <a v-else @click="handlePublishStatusChange(record.goodsId, 0)">上架</a>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ProductPageParam, Product } from '@/api/pms/productApi'
import { _getProductsPage,_updateProductStatus } from '@/api/pms/productApi'
import { Form, Modal } from 'ant-design-vue';
const router = useRouter()
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<Product | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<ProductPageParam>>({
})
formRef.pageNo = pagination.current

const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
  {
    title: '商品编号',
    key: 'goodsId',
    dataIndex: 'goodsId',
    width: 100
  }, {
    title: '商品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
    width: 100
  }, {
    title: '商品简介',
    dataIndex: 'goodsIntro',
    key: 'goodsIntro',
    width: 100
  }, {
    title: '商品图片',
    key: 'goodsCoverImg',
    width: 100
  }, {
    title: '商品库存',
    dataIndex: 'stockNum',
    key: 'stockNum',
    width: 100
  }, {
    title: '商品售价',
    dataIndex: 'sellingPrice',
    key: 'sellingPrice',
    width: 100
  }, {
    title: '上架状态',
    key: 'goodsSellStatus',
    width: 100
  }, {
    title: '操作',
    fixed: 'right',
    width: 180,
    key: 'action'
  }
];
const handlePublishStatusChange = (id: any,status:number) => {
  updatePublishStatus([id], status)
}
const updatePublishStatus = (ids: Array<string>, publishStatus: number) => {
  _updateProductStatus(ids, publishStatus ).then(res => {
    getPageProducts()
  });
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
  _getProductsPage(formRef as ProductPageParam).then(res => {
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
const handleEditRecord = (e?: Event, id?: string) => {
  e?.preventDefault()
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