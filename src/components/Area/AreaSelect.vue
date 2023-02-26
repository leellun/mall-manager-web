<template>
    <a-space>
        <a-select v-model:value="province" placeholder="请选择省份" style="margin: 0 0.1rem">
            <a-select-option v-for="item in allAreasList" :key="item.name" :value="item.name">{{
                item.name
            }}</a-select-option>
        </a-select>
        <a-select v-model:value="city" :disabled="!province" placeholder="请选择城市" style="margin: 0 0.1rem">
            <a-select-option v-for="item in selectCityList" :key="item.name" :value="item.name">{{
                item.name
            }}</a-select-option>
        </a-select>
        <a-select v-model:value="area" :disabled="!province || !city" placeholder="请选择区域" style="margin: 0 0.1rem">
            <a-select-option v-for="item in selectAreaList" :key="item.name" :value="item.name">{{
                item.name
            }}</a-select-option>
        </a-select>
    </a-space>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import allAreas from './lib/pca-code.json'
const props = defineProps<{
    province?: string,
    city?: string,
    area?: string
}>()
const emit = defineEmits(['selectRegion'])
//所有数据
const allAreasList = ref(allAreas)
//下拉框选择省份的值
const province = ref<string>()
//下拉框选择城市的值
const city = ref<string>()
//下拉框选择区域的值
const area = ref<string>()
province.value = props.province
city.value = props.city
area.value = props.area
//城市下拉框内容所有值
const selectCityList = computed(() => {
    if (province.value === '' || province.value === undefined) {
        return []
    }
    let cities = allAreasList.value.find(
        item => item.name === province.value
    )!.children
    return cities
})

//区域下拉框内容所有值
const selectAreaList = computed(() => {
    if (!city.value) { return [] }
    let areas = selectCityList.value.find(
        item => item.name === city.value
    )!.children
    return areas
})
watch(() => province.value, (val) => {
    emit("selectRegion", { province: province.value, city: city.value, area: area.value })
})
watch(() => city.value, (val) => {
    emit("selectRegion", { province: province.value, city: city.value, area: area.value })
})
watch(() => area.value, (val) => {
    emit("selectRegion", { province: province.value, city: city.value, area: area.value })
})
</script>
<style lang="ts" scoped>
</style>