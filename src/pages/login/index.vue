<template>
  <div class="login-container">
    <a-form id="formLogin" class="user-layout-login" @submit="handleSubmit" :model="formRef">
      <h1>欢迎访问蓝河ERP系统</h1>
      <a-form-item v-bind="validateInfos.username">
        <a-input size="large" type="text" placeholder="用户名/邮箱/手机号码" v-model:value="formRef.username">
          <template #prefix>
            <UserOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item v-bind="validateInfos.password">
        <a-input-password size="large" placeholder="密码" v-model:value="formRef.password">
          <template #prefix>
            <LockOutlined :style="{ color: 'rgba(0,0,0,.25)' }" />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item style="margin-top: 30px">
        <a-button size="large" type="primary" htmlType="submit" class="login-button" :loading="state" :disabled="state"
          block>登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { FormState } from "./form"
import { useUserStore } from '@/store/user'
import { ref, reactive, UnwrapRef } from 'vue'
import { Form } from 'ant-design-vue'
import { Router, useRouter } from 'vue-router'
import { generateAsyncRoutes } from "@/router/basicRouter";
import setting from "@/config/defaultSettings";
import { _auth_login } from '@/api/system/userApi'
import secret from "@/utils/secret"
const userStore = useUserStore();
const router: Router = useRouter();
const useForm = Form.useForm
// #region 表单相关
const formRef: UnwrapRef<FormState> = reactive({
  username: '',
  password: '',
})
const state = ref(false);
const rulesRef = reactive({
  rememberMe: [{ trigger: 'checked' }],
  username: [
    {
      required: true,
      message: "必须输入账号",
      validateTrigger: "blur"
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
  password: [{
    required: true,
    message: '必须输入密码',
    validateTrigger: "blur"
  }],
})
const { validate, validateInfos } = useForm(formRef, rulesRef)
function handleSubmit(e: Event) {
  e.preventDefault();
  state.value = true;
  validate(['username', 'password']).then(async () => {
    _auth_login(formRef.username, secret.encrypt(formRef.password)).then(res => {
      userStore.setToken(res.data.access_token, res.data.refresh_token);
      if (router.currentRoute.value.query['redirect'] != undefined) {
        let redirect = router.currentRoute.value.query['redirect'] as string
        router.push({ path: redirect })
      } else {
        router.push({ path: '/' });
      }
    }).catch(err => {

    }).finally(() => {
      state.value = false;
    })
  }).catch(e => {
    state.value = false;
  })
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/background.jpg') center center fixed no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .user-layout-login {
    width: 368px;
    margin-right: 10%;
  }

}
</style>