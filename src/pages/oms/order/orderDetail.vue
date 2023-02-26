<template>
  <div class="main-container">
    <a-card class="order-container">
      <div class="data">
        <a-card class="data-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单状态</span>
            </div>
          </template>
          <div>
            {{ data.orderStatusString }}
          </div>
        </a-card>
        <a-card class="data-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>创建时间</span>
            </div>
          </template>
          <div>
            {{ data.createTime }}
          </div>
        </a-card>
        <a-card class="data-item" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单号</span>
            </div>
          </template>
          <div>
            {{ data.orderNo }}
          </div>
        </a-card>
      </div>
      <a-table :columns="infoColumns" :data-source="data?.orderItemVOS" style="width: 100%;margin-top: 20px" borderd>

      </a-table>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { OrderDetailVO, Order } from '@/api/oms/orderApi'
import { _getOrderDetail } from '@/api/oms/orderApi'
const router = useRouter()
const orderid = router.currentRoute.value.query.id
const data = ref<OrderDetailVO|any>()
const infoColumns = [
  {
    title: '商品图片',
    key: 'goodsCoverImg',
    width: 100
  }, {
    title: '商品编号',
    key: 'goodsId',
    width: 100
  }, {
    title: '商品名',
    key: 'goodsName',
    width: 100
  }, {
    title: '商品数量',
    key: 'goodsCount',
    width: 100
  }, {
    title: '价格',
    key: 'sellingPrice',
    dataIndex: 'sellingPrice',
    width: 100
  }
]
_getOrderDetail(orderid).then(res => {
  data.value = res.data
})
</script>
<style lang="less" scoped></style>


