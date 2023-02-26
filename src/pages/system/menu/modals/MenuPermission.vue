<template>
    <a-drawer :width="500" title="权限设置" placement="right" :visible="props.visible" @close="onClose">
        <template #footer>
            <div style="text-align:center;margin-bottom: 10px;">
                <a-button style="margin-right: 18px" @click="onClose">取消</a-button>
                <a-button type="primary" @click="onSubmit">提交</a-button>
            </div>
        </template>
        <div
            style="border-bottom: 1px solid #f0f0f0;background: #fafafa;transition: background 0.3s ease;margin-bottom: 10px;">
            <a-checkbox v-model:checked="checkAll" :indeterminate="indeterminate" @change="onCheckAllChange"
                style="margin-bottom:10px;margin-left:25px">
                全选
            </a-checkbox>
        </div>
        <a-tree v-model:expandedKeys="expandedKeys" v-model:checkedKeys="checkedKeys"
            v-model:selectedKeys="selectedKeys" checkable :selectable="false" :tree-data="treeData"
            :loadData="onLoadData">
            <template #title="{ title }">
                <span>{{ title }}</span>
            </template>
        </a-tree>
    </a-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { DataNode } from 'ant-design-vue/lib/tree';
import type { Menu } from '@/api/system/menuApi'
import { _getSubMenus } from '@/api/system/menuApi'
import { _addMenuPermission, _getMenuPermission } from '@/api/system/roleApi'
const emit = defineEmits(["update:visible", "ok", "cancel"])
const props = withDefaults(defineProps<{
    visible: boolean,
    id: any,
    type?: number
}>(), {
    visible: false
})
const showTreeTip = ref(false)
const checkAll = ref(false)
const indeterminate = ref(false)
const expandedKeys = ref<string[]>();
const selectedKeys = ref<string[]>();
const checkedKeys = ref<string[]>();
const treeData = ref<Array<any>>([])
const onCheckAllChange = (e: any) => {
    if (checkAll.value) {
        checkedKeys.value = []
        treeData.value.forEach(item => {
            checkedKeys.value?.push(item.key)
        })
    } else {
        checkedKeys.value = []
    }
};
const onLoadData = (node: DataNode) => {
    return new Promise(resolve => {
        if (node.dataRef.children && node.dataRef.children.length) {
            resolve(node);
            return;
        }
        let treeNode = findSubMenu(node.key as string, treeData.value)
        treeNode!.children = []
        getSubMenus(node.key as string, treeNode!.children, resolve)
    })
}
const getSubMenus = (key: string, arr: Array<any>, resolve?: any) => {
    showTreeTip.value = true
    _getSubMenus(key).then(res => {
        let result: Array<Menu> | Array<any> = res.data
        result.forEach(item => {
            item.isLeaf = item.subCount == 0
            arr.push({
                isLeaf: item.subCount === 0,
                key: item.id,
                title: item.title
            })
        });
    }).finally(() => {
        showTreeTip.value = false
        if (resolve) {
            resolve()
        }
    })
}
getSubMenus('0', treeData.value)
const findSubMenu = (key: string, menus: Array<any>) => {
    if (menus) {
        for (let node of menus) {
            if (node.key === key) {
                return node
            } else if (node.children && node.children.length > 0) {
                let n: any = findSubMenu(key, node.children)
                if (n != null) {
                    return n
                }
            }
        }
    }
    return null
}
const getMenuPermission = () => {
    _getMenuPermission(props.id).then(res => {
        checkedKeys.value = []
        checkedKeys.value.push(...res.data)
    })
}
getMenuPermission()
const onClose = () => {
    emit("update:visible", false)
};
const onSubmit = () => {
    _addMenuPermission(props.id,checkedKeys.value as Array<string>).then(res=>{
        emit("update:visible", false)
    })
};
</script>
<style lang="less" scoped>

</style>