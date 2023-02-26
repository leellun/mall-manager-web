<template>
  <div class="clearfix">
    <a-upload v-model:file-list="fileList" name="pic" :action="getUploadUrl" :headers="headers" list-type="picture-card"
      @preview="handlePreview" @change="handleChange" @remove="handleRemove">
      <div v-if="fileList.length < 8">
        <plus-outlined />
        <div style="margin-top: 8px">添加图片</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img :alt="previewTitle" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';
import { ref, computed } from 'vue';
import { UploadProps, UploadChangeParam, message } from 'ant-design-vue';
import { useUserStore } from '@/store/user'
const userStore = useUserStore()
const emit = defineEmits(["update:value"])
const props = withDefaults(defineProps<{
  value: Array<string>
}>(), {
})
const getUploadUrl = () => {
  return import.meta.env.VITE_APP_BASE_API + "/storage/oss/uploadpic"
}
const getBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const previewVisible = ref(false);
const previewImage = ref('');
const previewTitle = ref('');

const fileList = ref<UploadProps['fileList'] | any>([
]);
if (props.value != null) {
  props.value.forEach(item => {
    let name = item.substring(item.lastIndexOf("/") + 1)
    fileList.value.push({
      uid: name,
      name: name,
      status: 'done',
      url: item,
      httpUrl: item,
    })
  })
}
const headers = computed(() => {
  return { Authorization: `Bearer ${userStore.token}` }
})
const handleCancel = () => {
  previewVisible.value = false;
  previewTitle.value = '';
};
const handlePreview = async (file: any) => {
  if (!file.url && !file.preview) {
    file.preview = (await getBase64(file.originFileObj)) as string;
  }
  previewImage.value = file.url || file.preview;
  previewVisible.value = true;
  previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
}
const handleRemove = async (file: any) => {
  let urls = fileList.value.filter((ii:any)=>ii.uid!=file.uid).map((ii: any) => ii.httpUrl)
  emit("update:value", urls)
}
const handleChange = (info: UploadChangeParam | any) => {
  if (info.file.status === 'uploading') {
    return;
  }
  if (info.file.status === 'done') {
    console.log(info.file)
    let item = fileList.value.find((ii: any) => ii.uid === info.file.uid)
    if (item != undefined) {
      if (info.file.response.code === 200) {
        item.httpUrl = info.file.response.data.url
        let urls = fileList.value.map((ii: any) => ii.httpUrl)
        emit("update:value", urls)
      } else {
        fileList.value.splice(fileList.value.indexOf(item), 1)
        message.warning("上传失败")
      }
    }
  }
};
</script>
<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>