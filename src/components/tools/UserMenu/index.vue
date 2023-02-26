<template>
    <div class="user-wrapper">
        <div class="content-box">
            <a href="https://github.com/bailihuiyue/ant-design-pro-vue3/blob/main/README.md" target="_blank">
                <span class="action">
                    <QuestionCircleOutlined />
                </span>
            </a>
            <notice-icon class="action" />
            <a-dropdown>
                <span class="action ant-dropdown-link user-dropdown-menu">
                    <a-avatar class="avatar" size="small" src="https://img-blog.csdnimg.cn/img_convert/efd5140d2f150cc7678495768c3fb55e.png"/>
                    <span class="nickname">hello</span>
                </span>
                <template #overlay>
                    <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
                        <a-menu-item key="center" @click="handleToCenter">
                            <user-outlined />
                            个人中心
                        </a-menu-item>
                        <a-menu-item key="settings" @click="handleToSettings">
                            <setting-outlined />
                            个人设置
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item key="logout" @click="handleLogout">
                            <logout-outlined />
                            退出登录
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script setup lang="ts">
import {UserOutlined,SettingOutlined,LogoutOutlined} from '@ant-design/icons-vue'
import NoticeIcon from '@/components/NoticeIcon/index.vue'
import {
    QuestionCircleOutlined,
} from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { Modal } from 'ant-design-vue'

const userStore = useUserStore()
const router = useRouter();
const handleToCenter = () => {
    router.push({ path: '/account/center' })
}
const handleToSettings = () => {
    router.push({ path: '/account/settings' })
}
const handleLogout = (e: any) => {
    Modal.confirm({
        title: '信息',
        content: '您确定要注销吗？',
        onOk: () => {
            return userStore.loginOut().then(() => {
                router.push({ name: 'login' })
            })
        },
        onCancel() { }
    })
}
</script>
<style lang="less">
.user-dropdown-menu-wrapper {
    .ant-dropdown-menu-item {
        width: 100% !important;
    }
}
</style>
