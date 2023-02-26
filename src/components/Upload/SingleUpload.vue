<template>
  <a-upload v-model:file-list="fileList" name="pic" list-type="picture-card" class="avatar-uploader"
    :headers="headers" :show-upload-list="false" :action="getUploadUrl" :before-upload="beforeUpload"
    @change="handleChange">
    <img v-if="imageUrl" :src="imageUrl" alt="avatar" class="img" />
    <div v-else>
      <loading-outlined v-if="loading"></loading-outlined>
      <plus-outlined v-else></plus-outlined>
      <div class="ant-upload-text">点击上传</div>
    </div>
  </a-upload>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';
import { useUserStore } from '@/store/user'
const emit = defineEmits(["update:value","update:objectName"])
const props = withDefaults(defineProps<{
    value: string
    objectName?:string
}>(), {
    value: '',
    objectName:''
})
const imageUrl = computed<string>({
    get() {
        return props.value
    },
    set(newValue) {
      console.log(newValue)
        emit("update:value", newValue)
    }
})
const userStore = useUserStore()
const getUploadUrl = () => {
  return import.meta.env.VITE_APP_BASE_API + "/storage/oss/uploadpic"
}
const getBase64 = (img: Blob, callback: (base64Url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
}
const fileList = ref([]);
const loading = ref<boolean>(false);
const headers = computed(() => {
  return { Authorization: `Bearer ${userStore.token}` }
})

const handleChange = (info: UploadChangeParam | any) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    imageUrl.value = info.file.response.data.url
    emit("update:objectName",info.file.response.data.objectName)
    // Get this url from response in real world.
//  getBase64(info.file.originFileObj, (base64Url: string) => {
//    imageUrl.value = info.file.response.data.url;
//  });
    loading.value = false;
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('上传失败');
  }
};

const beforeUpload = (file: any) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('只能上传JPG或者PNG图片!');
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error('图片大小不能大于10MB!');
  }
  return isJpgOrPng && isLt2M;
};
</script>
<style type="less" scoped>
.avatar-uploader>.ant-upload {
  width: 128px;
  height: 128px;
}

.img {
  width: 128px;
  height: 128px;
  margin-left: 25px;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
