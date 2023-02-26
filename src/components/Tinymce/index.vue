<template>
    <div class="tinymce-container editor-container">
        <editor :init="init" tinymce-script-src="/tinymce/tinymce.min.js" v-model="content" />
    </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import Editor from '@tinymce/tinymce-vue'
const plugins = [
    'advlist', 'anchor', 'autolink', 'autosave', 'code', 'codesample', 'directionality', 'emoticons', 'fullscreen',
    'image', 'importcss', 'insertdatetime', 'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'preview',
    'save', 'searchreplace', 'table', 'template', 'visualblocks', 'visualchars', 'wordcount'
];
const toolbar = [
    `bold italic underline strikethrough alignleft aligncenter
  alignright outdent indent  blockquote undo redo removeformat code`,
    `hr bullist numlist link image charmap	 preview anchor pagebreak
    fullscreen insertdatetime media table forecolor backcolor`
];
const init = {
    language: "zh-Hans",
    menubar: false,
    plugins: plugins,
    toolbar: toolbar
}
const emit = defineEmits(["update:value"])
const props = withDefaults(defineProps<{
    value: string
}>(), {
    value: ''
})
const content = computed<string>({
    get() {
        return props.value
    },
    set(newValue) {
        emit("update:value", newValue)
    }
})
</script>
<style lang="less" scoped>

</style>