<script setup>
import { ref, getCurrentInstance, watch, onMounted } from "vue";
import { useQuery } from '@tanstack/vue-query'
const { proxy } = getCurrentInstance()
const axios = proxy.axios;
const filters = ref(null);
const { role, multiple, defaultValue } = defineProps({
    multiple: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: null
    },
    defaultValue: {
        default: null,
        required: false,
        validator: (value) => {
            return value !== null
        },
    }
})
const emit = defineEmits(['input'])

const getAllGateways = async () => {
    const queries = {
        page: 1,
        limit: 50,
        ...filters.value && { search: filters.value },
        ...role && { role }
    }

    const params = new URLSearchParams(queries)
    return await axios.get(`/gateways?${params}`)
}

const selectedGateway = ref();
const { data: gateways, isLoading, refetch } = useQuery({
    queryKey: ["selectGateways", filters.value],
    queryFn: getAllGateways,
})

watch(() => selectedGateway.value, (val) => {
    if (val) {
        emit('input', val)
    }
})

const handleFilter = (events) => {
    const { value } = events
    filters.value = value
    refetch()
}

onMounted(() => {
    if (defaultValue) {
        selectedGateway.value = defaultValue
    } else {
        selectedGateway.value = null
    }
})

</script>
<template>
    <div>
        <Dropdown v-if="!multiple" v-model="selectedGateway" :loading="isLoading" filter @filter="handleFilter"
            showClear :options="isLoading ? [] : gateways.data.data.items" optionLabel="name"
            placeholder="Pilih gateway" class="w-full">
            <template #option="slotProps">
                <div class="flex align-items-center gap-3">
                    <div
                        :class="`${slotProps.option.status ? 'bg-primary' : 'bg-red-500'} h-1rem w-1rem border-circle`">
                    </div>
                    <div class="flex flex-column gap-2">
                        <span>{{ slotProps.option.name }} - {{ slotProps.option.location }}</span>
                        <Tag class="w-fit">{{ slotProps.option.ip }}</Tag>
                    </div>
                </div>
            </template>
        </Dropdown>
        <MultiSelect v-if="multiple" display="chip" v-model="selectedGateway" :loading="isLoading" filter
            @filter="handleFilter" showClear :options="isLoading ? [] : gateways.data.data.items" optionLabel="name"
            placeholder="Pilih gateway" class="w-full">
            <template #option="slotProps">
                <div class="flex align-items-center gap-3">
                    <div
                        :class="`${slotProps.option.status ? 'bg-primary' : 'bg-red-500'} h-1rem w-1rem border-circle`">
                    </div>
                    <div class="flex flex-column gap-2">
                        <span>{{ slotProps.option.name }} - {{ slotProps.option.location }}</span>
                        <Tag class="w-fit">{{ slotProps.option.ip }}</Tag>
                    </div>
                </div>
            </template>
        </MultiSelect>
    </div>

</template>