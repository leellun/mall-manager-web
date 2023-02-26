<template>
  <div class="main-container">
    <a-row :gutter="24">
      <!--部门数据-->
      <a-col :xs="9" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="head-container">
          <a-form-item>
            <a-input v-model:value="deptName" size="small" placeholder="输入部门名称搜索" style="width: 200px"
              @change="onDeptChange">
              <template #prefix><search-outlined /></template>
            </a-input>
          </a-form-item>
        </div>
        <a-spin tip="加载中..." :spinning="showTreeTip">
          <a-tree v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys"
            v-model:selectedKeys="selectedKeys" checkable :tree-data="treeData" :loadData="onLoadData">
            <template #title="{ title }">
              <span>{{ title }}</span>
            </template>
          </a-tree>
        </a-spin>
      </a-col>
      <!--用户数据-->
      <a-col :xs="15" :sm="18" :md="19" :lg="20" :xl="20">
        <!--工具栏-->
        <a-form layout="inline" :model="formRef" @submit="handleSubmit">
          <a-form-item>
            <a-input size="small" v-model:value="formRef.blurry" placeholder="输入名称或者邮箱搜索">
              <template #prefix>
                <search-outlined style="color: rgba(0, 0, 0, 0.25)" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-range-picker size="small" v-model:value="timeRangeRef" name="createTime" style="width: 100%"
              :placeholder="['开始时间', '结束时间']" />
          </a-form-item>
          <a-form-item>
            <a-select v-model:value="formRef.enabled" size="small" style="width: 200px" placeholder="状态">
              <a-select-option value="1">启用</a-select-option>
              <a-select-option value="0">禁用</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button size="small" type="primary" html-type="submit" v-permission="['user:select']">
              <template #icon>
                <SearchOutlined />
              </template>
              搜索
            </a-button>
          </a-form-item>
          <a-form-item>
            <a-button size="small" type="primary" @click="handleResetSearch">
              <template #icon><undo-outlined /></template>
              重置
            </a-button>
          </a-form-item>
        </a-form>
        <!-- 操作按钮区域 -->
        <div class="table-operator" style="border-top: 5px">
          <a-button type="primary" size="small" @click="handleAdd" v-permission="['user:add']"><template #icon>
              <plus-outlined />
            </template>新增</a-button>
          <a-button type="primary" danger size="small" style="margin-left:10px" :disabled="selectedRowKeys.length == 0"
            @click="deleteUsers" v-permission="['user:delete']"><delete-outlined />删除</a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :pagination="pagination" :loading="loading" :scroll="{ x: 1210 }"
          @change="handleTableChange"
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps }">

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'gender'">
              <span>
                {{ record.gender === 1 ? '男' : '女' }}
              </span>
            </template>
            <template v-else-if="column.key === 'enabled'">
              <a-tag color="green" v-if="record.enabled === 1">启用</a-tag>
              <a-tag color="red" v-else>禁用</a-tag>
            </template>
            <template v-else-if="column.key === 'roleNames'">
              <span>
                {{ getRoleNames(record.roleNames) }}
              </span>
            </template>
            <template v-else-if="column.key === 'action'">
              <span>
                <a @click="(e?: Event) => editUser(e, record.id)" v-permission="['user:update']">编辑</a>
                <a-divider type="vertical" v-permission="['user:update']" />
                <a-switch :checked="record.enabled === 1" checked-children="启用" un-checked-children="禁用"
                  @change="handleEnableChange(record.id, record.enabled === 0 ? 1 : 0)" v-permission="['user:update']" />
                <a-divider type="vertical" v-permission="['user:update']" />
                <a-popconfirm title="是否删除用户？" ok-text="是" cancel-text="否" @confirm="() => deleteUser([record.id])"
                  v-if="record.canDeleted === 1">
                  <a v-permission="['user:delete']">删除</a>
                </a-popconfirm>
                <a v-else="record.username==='admin'" style="visibility:hidden">删除</a>
                <a-divider type="vertical" v-permission="['user:delete']" />
                <a-popconfirm title="是否重置密码？" ok-text="是" cancel-text="否" @confirm="() => resetPassword(record.id)">
                  <a v-permission="['user:update']">重置密码</a>
                </a-popconfirm>

              </span>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <UserModal v-model:visible="userVisible" :id="userId" v-if="userVisible" @ok="handleOk" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message, Modal, TreeProps, Form } from 'ant-design-vue'
import type { DataNode } from 'ant-design-vue/lib/tree';
import { _getSubDepts, _searchDepts } from '@/api/system//deptApi'
import type { Dept } from '@/api/system//deptApi'
import { _getUsersPage, _deleteUser, _resetPass, _enableUser } from '@/api/system/userApi'
import type { UserSearch, UserItem } from '@/api/system/userApi'
import type { Dayjs } from 'dayjs';
import UserModal from './modals/UserModal.vue'

type RangeValue = [Dayjs, Dayjs];
const timeRangeRef = ref<RangeValue>()
const deptName = ref<string>('')
const formRef = reactive<Partial<UserSearch>>({
  blurry: '',
})
const useForm = Form.useForm
const { resetFields } = useForm(formRef)
const showTreeTip = ref(false)
const loading = ref(false)
const userId = ref<string>()
const treeData2: TreeProps['treeData'] = [];
const treeData = ref(treeData2)
const expandedKeys = ref<string[]>();
const selectedKeys = ref<string[]>();
const checkedKeys = ref<string[]>();
const selectedRowKeys = ref<string[]>([]);
const userVisible = ref<boolean>(false);
const handleOk = () => {
  handleSubmit()
};
const pagination = reactive<any>({ pageSize: 10, current: 1 })
formRef.pageSize = pagination.pageSize
formRef.pageNo = pagination.current;
const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    width: 80
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 80
  },
  {
    title: '性别',
    key: 'gender',
    width: 60
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 80
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
    width: 80
  },
  {
    title: '角色',
    key: 'roleNames',
    width: 80
  },
  {
    title: '部门',
    dataIndex: 'deptName',
    key: 'deptName',
    width: 100
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 100
  },
  {
    title: '最后一次登录时间',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime',
    width: 100
  }, {
    title: '操作',
    fixed: 'right',
    width: 200,
    key: 'action'
  }
];
const onSelectChange = (keys: string[]) => {
  selectedRowKeys.value = keys;
};
const getCheckboxProps = (record: UserItem) => ({
  disabled: record.username === 'admin', // Column configuration not to be checked
})
const getRoleNames = (roleNames: Array<string>) => {
  if (roleNames == null || roleNames == undefined) {
    return null;
  }
  return roleNames.join(',')
}
const data = ref<Array<UserItem | any>>([]);
let interval: any;
const onDeptChange = () => {
  if (interval != undefined && interval != null) {
    clearTimeout(interval)
  }
  interval = setTimeout(() => {
    if (deptName.value.trim() === '') {
      getSubDepts('0')
    } else {
      _searchDepts(deptName.value).then(res => {
        selectedKeys.value = []
        checkedKeys.value = []
        expandedKeys.value = []
        let tmpTreeData: DataNode[] = [];
        covertDepts(res.data, tmpTreeData)
        treeData.value = tmpTreeData
      })
    }

  }, 200)
}

const onLoadData = (node: DataNode) => {
  return new Promise(resolve => {
    if (node.dataRef.children && node.dataRef.children.length) {
      resolve(node);
      return;
    }
    showTreeTip.value = true
    _getSubDepts(node.key as string).then(res => {
      let treeNode = findSubDept(node.key as string, treeData.value)
      treeNode!.children = []
      res.data.forEach(item => {
        item.isLeaf = item.subCount == 0
        treeNode!.children?.push({
          isLeaf: item.subCount === 0,
          key: item.id,
          title: item.name
        })
      });
    }).finally(() => {
      showTreeTip.value = false
      resolve(node)
    })
  })
}
const getSubDepts = (pid: string) => {
  showTreeTip.value = true
  _getSubDepts(pid).then(res => {
    selectedKeys.value = []
    checkedKeys.value = []
    expandedKeys.value = []
    let tmpTreeData: DataNode[];
    treeData.value.splice(0, treeData.value.length)
    tmpTreeData = treeData.value;
    res.data.forEach(item => {
      item.isLeaf = item.subCount == 0
      tmpTreeData?.push({
        isLeaf: item.subCount === 0,
        key: item.id,
        title: item.name,
      })
    });
  }).finally(() => {
    showTreeTip.value = false
  })
}
const covertDepts = (depts: Array<Dept>, nodes: DataNode[]) => {
  for (let i = 0; i < depts.length; i++) {
    let dept = depts[i];
    nodes[i] = covertDept(dept)
    if (dept.children && dept.children.length > 0) {
      nodes[i].children = []
      covertDepts(dept.children, nodes[i].children as DataNode[]);
    }
  }
}
const covertDept = (item: Dept) => {
  expandedKeys.value?.push(item.id)
  return {
    isLeaf: item.subCount === 0,
    key: item.id,
    title: item.name
  }
}
const findSubDept = (key: string, menus: Array<any>) => {
  if (menus) {
    for (let node of menus) {
      if (node.key === key) {
        return node
      } else if (node.children && node.children.length > 0) {
        let n: any = findSubDept(key, node.children)
        if (n != null) {
          return n
        }
      }
    }
  }
  return null
}
getSubDepts('0')
const handleSubmit = (e?: Event) => {
  e?.preventDefault();
  formRef.pageNo = 1
  getUsersPage()
}
const getUsersPage = () => {
  if (timeRangeRef.value != null) {
    formRef.createTime = []
    formRef.createTime.push(timeRangeRef.value[0].format("YYYY-MM-DD 00:00:00"))
    formRef.createTime.push(timeRangeRef.value[1].format("YYYY-MM-DD 00:00:00"))
  } else {
    formRef.createTime = []
  }
  formRef.deptIds = checkedKeys.value
  loading.value = true
  _getUsersPage(formRef as UserSearch).then(res => {
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
  getUsersPage();
}
const handleResetSearch = () => {
  resetFields()
  timeRangeRef.value = undefined
  formRef.enabled = undefined
}
const handleAdd = (e?: Event) => {
  e?.preventDefault()
  userId.value = undefined
  userVisible.value = true;
}
handleSubmit()
const resetPassword = (id: string) => {
  _resetPass(id)
}
const editUser = (e?: Event, id?: string) => {
  e?.preventDefault()
  userId.value = id
  userVisible.value = true;
}
const deleteUsers = () => {
  if (selectedRowKeys.value.length > 0) {
    Modal.confirm({
      title: "系统提示",
      content: "是否删除选中用户？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        deleteUser(selectedRowKeys.value)
      },
    });

  }
}
const deleteUser = (ids: string[]) => {
  _deleteUser(ids).then(res => {
    message.success(res.message)
    getUsersPage()
  })
}
const handleEnableChange = (id: string, enabled: number) => {
  _enableUser(id, enabled).then(res => {
    getUsersPage()
  })
}
</script>

<style lang="less" scoped>
.table-operator {
  margin: 10px 0;
}
</style>
