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
      @change="handleTableChange" :scroll="{ x: 280 }" rowKey="goodsId"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <span>
            <a @click="(e?: Event) => handleEditRecord(e, record.configId)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否删除？" ok-text="是" cancel-text="否" @confirm="() => handleDeleteRecord([record.configId])">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>
    <IndexConfigModal v-model:visible="modalVisible" :id="modalId" :config-type="formRef.configType!" v-if="modalVisible"
      @ok="handleOk" />
  </div>
</template>
<script setup lang="ts"  >
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import IndexConfigModal from './modals/IndexConfigModal.vue'
import type { IndexConfigSearchParam, IndexConfig } from '@/api/sms/indexConfigApi'
import { _getIndexConfigPage,_deleteIndexConfigBatch } from '@/api/sms/indexConfigApi'
import { Form, Modal } from 'ant-design-vue';
const modalId = ref<any>()
const modalVisible = ref<boolean>(false)
const router = useRouter()
const selectedRowKeys = ref<string[]>([]);
const data = ref<Array<IndexConfig | any>>([]);
const pagination = reactive<any>({ pageSize: 10, current: 1 })
const formRef = reactive<Partial<IndexConfigSearchParam>>({
  configType: 3
})
formRef.pageNo = pagination.current
const routerName = router.currentRoute.value.name
if (routerName === 'hot') {
  formRef.configType = 3
} else if (routerName === 'new') {
  formRef.configType = 4
} else if (routerName === 'recommend') {
  formRef.configType = 5
}
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const loading = ref<boolean>(false)
const columns = [
  {
    title: '商品名称',
    key: 'configName',
    dataIndex: 'configName',
    width: 100
  }, {
    title: '跳转链接',
    dataIndex: 'redirectUrl',
    key: 'redirectUrl',
    width: 100
  }, {
    title: '排序值',
    dataIndex: 'configRank',
    key: 'configRank',
    width: 100
  }, {
    title: '商品编号', dataIndex: 'goodsId',
    key: 'goodsId',
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
  _getIndexConfigPage(formRef as any).then(res => {
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
  _deleteIndexConfigBatch(ids).then(res=>{
    handleSearch()
  })
}
handleSearch()
</script>
<style lang="less" scoped></style>