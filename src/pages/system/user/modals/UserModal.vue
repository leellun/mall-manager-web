<template>
  <a-modal v-model:visible="props.visible" :title="id ? '编辑用户' : '新增用户'" @ok="handleOk" @cancel="handleCancel">
    <a-form :model="form">
      <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.username">
        <a-input placeholder="请输入登录名称" :readOnly="!!id" v-model:value="form.username" suffix="初始密码：123456" />
      </a-form-item>
      <a-form-item label="真实姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.realName">
        <a-input placeholder="请输入真实姓名" v-model:value="form.realName" />
      </a-form-item>
      <a-form-item label="用户昵称" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.nickName">
        <a-input placeholder="请输入用户昵称" v-model:value="form.nickName" />
      </a-form-item>
      <a-form-item label="手机号码" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.phone">
        <a-input placeholder="请输入手机号码" v-model:value="form.phone" />
      </a-form-item>
      <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.email">
        <a-input placeholder="请输入邮箱" v-model:value="form.email" />
      </a-form-item>
      <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.gender">
        <a-select placeholder="请选择" v-model:value="form.gender">
          <a-select-option :value="1">男</a-select-option>
          <a-select-option :value="0">女</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="部门" :labelCol="labelCol" :wrapperCol="wrapperCol" v-bind="validateInfos.deptId">
        <a-tree-select v-model:value="form.deptId" tree-data-simple-mode style="width: 100%" placeholder="请选择..."
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" :tree-data="orgaTree" :load-data="onLoadData">
          <template #title="{ value: val, title }">
            <template v-if="val === undefined && form.deptId !== undefined">{{ form.deptName }}</template>
            <template v-else>{{ title }}</template>
          </template>
        </a-tree-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色" v-bind="validateInfos.roleIds">
        <a-select placeholder="请选择" :dropdownMatchSelectWidth="false" v-model:value="form.roleIds" mode="multiple">
          <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="岗位" v-bind="validateInfos.jobId">
        <a-select placeholder="请选择" :dropdownMatchSelectWidth="false" v-model:value="form.jobId">
          <a-select-option v-for="(item, index) in jobList" :key="index" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { message, TreeSelectProps,Form } from 'ant-design-vue';
import type { UserRequest } from '@/api/system/userApi'
import { _addUser, _getUser, _updateUser } from '@/api/system/userApi'
import { _getSubDepts } from '@/api/system//deptApi'
import type { Role } from '@/api/system/roleApi'
import { _getAllRoles } from '@/api/system/roleApi'
import type { Job } from '@/api/system/jobApi'
import { _getAllJobs } from '@/api/system/jobApi'
import { ref, reactive, watch } from 'vue'
const useForm = Form.useForm
const props = withDefaults(defineProps<{
  visible: boolean,
  id?: string
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
const form = reactive<Partial<UserRequest>>({
  username: undefined,
  realName: undefined,
  nickName: undefined,
  deptId: undefined,
  phone: undefined,
  email: undefined,
  gender: undefined,
  jobId: undefined,
  roleIds: []
})
const roleList = ref<Array<Role>>([])
const jobList = ref<Array<Job>>([])
const emit = defineEmits(["update:visible", "ok", "cancel"])
const rulesRef = reactive({
  username: [
    {
      required: true,
      message: "必须输入账号",
      trigger: "blur"
    }, {
      validator: (rule: any, value: string) => {
        const regex = /^(1[34578]\d{9})|([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,3}){1,2})|([a-zA-Z0-9_-]{4,16})$/
        if (regex.test(value)) {
          return Promise.resolve()
        } else {
          return Promise.reject()
        }
      },
      trigger: 'change'
    }
  ],
  realName: [{
    required: true,
    message: '必须输入真实姓名',
    trigger: "blur"
  }, {
    validator: (rule: any, value: string) => {
      const regex = /^[\u4e00-\u9fa5\u4e00-\u9fa5]{2,10}$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  nickName: [{
    required: true,
    message: '必须输入昵称',
    validateTrigger: "blur"
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
  phone: [{
    validator: (rule: any, value: string) => {
      if (value === undefined || value === '' || value === null) {
        return Promise.resolve()
      }
      const regex = /^\d{11}$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  email: [{
    validator: (rule: any, value: string) => {
      if (value === undefined || value === '' || value === null) {
        return Promise.resolve()
      }
      const regex = /^([a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject()
      }
    },
    trigger: 'change'
  }],
  gender: [{
    required: true,
    message: '必须选择性别',
    trigger: "blur"
  }],
  deptId: [{
    required: true,
    message: '必须选择部门',
    trigger: "blur"
  }],
  roleIds: [{
    required: true,
    message: '必须选择角色',
    trigger: "blur"
  }],
  jobId: [{
    required: true,
    message: '必须选择岗位',
    trigger: "blur"
  }],
})
const orgaTree = ref<TreeSelectProps['treeData']>([]);
const onLoadData = (treeNode: any) => {
  return new Promise(resolve => {
    getSubDepts(treeNode, resolve)
  });
};
const getSubDepts = (treeNode?: any, resolve?: any) => {
  let pid = treeNode ? treeNode.id : '0'
  _getSubDepts(pid).then(res => {
    let tmpTreeData
    if (treeNode) {
      let node = findSubDept(treeNode.key, orgaTree.value as Array<any>)
      tmpTreeData = new Array<any>()
      node!.children = tmpTreeData
    } else {
      tmpTreeData = orgaTree.value
    }
    res.data.forEach(item => {
      item.isLeaf = item.subCount == 0
      tmpTreeData?.push({
        isLeaf: item.subCount === 0,
        id: item.id,
        key: item.id,
        value: item.id,
        pid: pid,
        title: item.name,
      })
    });
    if (treeNode) {
      treeNode!.children = tmpTreeData
      resolve()
    }
  })
}
const getUser = () => {
  _getUser(props.id as string).then(r => {
    let res = r.data
    form.deptId = res.deptId
    form.deptName = res.deptName
    form.avatar = res.avatar
    form.email = res.email
    form.phone = res.phone
    form.gender = res.gender
    form.id = props.id
    form.enabled = res.enabled
    form.jobId = res.jobId
    form.nickName = res.nickName
    form.roleIds = res.roleIds
    form.username = res.username
    form.realName = res.realName
  })
}
if (props.id) {
  getUser()
}
const getAllRoles = () => {
  _getAllRoles().then(res => {
    roleList.value.push(...res.data)
  })
}
const getAllJobs = () => {
  _getAllJobs().then(res => {
    jobList.value.push(...res.data)
  })
}
const findSubDept = (key: string, menus: Array<any>) => {
    if (menus) {
        for (let node of menus) {
            if (node.key === key) {
                return node
            } else if (node.children && node.children.length > 0) {
                let n:any = findSubDept(key, node.children)
                if (n != null) {
                    return n
                }
            }
        }
    }
    return null
}
getSubDepts()
getAllRoles()
getAllJobs()
const { validate, validateInfos } = useForm(form, rulesRef)
const handleOk = () => {
  validate().then(async () => {
    if (props.id) {
      _updateUser(form as UserRequest).then(res => {
        message.success(res.message)
        emit("update:visible", false)
        emit("ok")
      })
    } else {
      _addUser(form as UserRequest).then(res => {
        message.success(res.message)
        emit("update:visible", false)
        emit("ok")
      })
    }
  }).catch(e => {

  })
}
const handleCancel = () => {
  emit("update:visible", false)
  emit("cancel")
}
</script>

<style scoped lang="less">

</style>