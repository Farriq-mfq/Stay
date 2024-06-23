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

const getAllSession = async () => {
    const queries = {
        page: 1,
        limit: 50,
        ...filters.value && { search: filters.value },
        ...role && { role }
    }

    const params = new URLSearchParams(queries)
    return await axios.get(`/sessions?${params}`)
}

const selectSession = ref();
const { data: sessions, isLoading, refetch } = useQuery({
    queryKey: ["selectSession", filters.value],
    queryFn: getAllSession,
})

watch(() => selectSession.value, (val) => {
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
        selectSession.value = defaultValue
    } else {
        selectSession.value = null
    }
})

</script>
<template>
    <div>
        <Dropdown v-if="!multiple" v-model="selectSession" :loading="isLoading" filter @filter="handleFilter"
            showClear :options="isLoading ? [] : sessions.data.data.items" optionLabel="name"
            placeholder="Pilih Session" class="w-full">
            
        </Dropdown>
        <MultiSelect v-if="multiple" display="chip" v-model="selectSession" :loading="isLoading" filter
            @filter="handleFilter" showClear :options="isLoading ? [] : Session.data.data.items" optionLabel="name"
            placeholder="Pilih Session" class="w-full">

        </MultiSelect>
    </div>

</template>