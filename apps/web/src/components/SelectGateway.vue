<script setup>
import { ref, getCurrentInstance, watch } from "vue";
import { useQuery } from '@tanstack/vue-query'
const { proxy } = getCurrentInstance()
const axios = proxy.axios;
// const filters = ref(null);
const { role } = defineProps(['role'])
const emit = defineEmits(['input'])
const queryParams = ref({
    first: 0,
    rows: 10,
    role
})
const getAllGateways = async () => {
    const queries = {
        page: 1,
        perpage: 50,
        // ...filters.value && { search: filters.value },
        ...role && { role }
    }

    const params = new URLSearchParams(queries)
    return await axios.get(`/gateways?${params}`)
}

const selectedGateway = ref();
const { data: gateways, isLoading } = useQuery({
    queryKey: ["selectGateways", queryParams.value],
    queryFn: getAllGateways,
})

watch(() => selectedGateway.value, (val) => {
    emit('input', val)
})

</script>
<template>
    <Dropdown v-model="selectedGateway" :loading="isLoading" filter showClear
        :options="isLoading ? [] : gateways.data.data.items" optionLabel="name" placeholder="Pilih gateway"
        class="w-full">
        <template #option="slotProps">
            <div class="flex align-items-center gap-3">
                <div :class="`${slotProps.option.status ? 'bg-primary' : 'bg-red-500'} h-1rem w-1rem border-circle`">
                </div>
                <div class="flex flex-column gap-2">
                    <span>{{ slotProps.option.name }} - {{ slotProps.option.location }}</span>
                    <Tag class="w-fit">{{ slotProps.option.ip }}</Tag>
                </div>
            </div>
        </template>
    </Dropdown>
</template>