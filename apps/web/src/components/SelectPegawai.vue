<script setup>
import { ref, getCurrentInstance, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useInfiniteQuery } from '@tanstack/vue-query';
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const filters = ref(null);
const { role, multiple, defaultValue, inputValue } = defineProps({
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
            return value !== null;
        }
    },
    inputValue: {
        default: null
    }
});
const emit = defineEmits(['input']);

const getAllPegawai = async ({ pageParam = 1 }) => {
    const queries = {
        page: pageParam,
        limit: 50,
        ...(filters.value && { search: filters.value }),
        ...(role && { role })
    };

    const params = new URLSearchParams(queries);
    return await axios.get(`/pegawai/public?${params}`);
};

const SelectPegawai = ref();
const items = ref([]);
const {
    data: pegawai,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
} = useInfiniteQuery({
    queryKey: ['selectPegawai', filters.value],
    queryFn: getAllPegawai,
    getNextPageParam: (lastPage) => {
        return lastPage.data.data.meta.nextPage;
    }
});

watch(
    () => pegawai.value,
    (val) => {
        if (val) {
            const itemMap = new Map();
            val.pages.forEach((page) => {
                page.data.data.items.forEach((item) => {
                    if (!itemMap.has(item.id)) {
                        itemMap.set(item.id, item);
                    }
                });
            });
            items.value = Array.from(itemMap.values());
        }
    }
);

watch(
    () => SelectPegawai.value,
    (val) => {
        if (val) {
            emit('input', val);
        }
    }
);

watch(
    () => inputValue,
    (val) => {
        if (!val) {
            SelectPegawai.value = null;
        }
    }
);

const handleFilter = (events) => {
    const { value } = events;
    filters.value = value;
    refetch();
};

onMounted(() => {
    if (defaultValue) {
        SelectPegawai.value = defaultValue;
    } else {
        SelectPegawai.value = null;
    }
});
</script>
<template>
    <div>
        <Dropdown v-if="!multiple" v-model="SelectPegawai" :loading="isLoading" filter @filter="handleFilter" showClear :options="isLoading ? [] : items" optionLabel="name" placeholder="Pilih Pegawai" id="dropdown-pegawai" class="w-full">
            <template #option="slotProps">
                {{ `${slotProps.option.name} - ${slotProps.option.group}` }}
            </template>
            <template #footer>
                <Button v-if="hasNextPage" link label="Load More" size="small" class="mt-2" :disabled="!hasNextPage || isFetchingNextPage" :loading="isFetchingNextPage" @click="fetchNextPage" />
            </template>
        </Dropdown>

        <MultiSelect v-if="multiple" display="chip" v-model="SelectPegawai" :loading="isLoading" filter @filter="handleFilter" showClear :options="isLoading ? [] : items" optionLabel="name" placeholder="Pilih Pegawai" class="w-full">
            <template #option="slotProps">
                {{ `${slotProps.option.name} - ${slotProps.option.group}` }}
            </template>
            <template #footer>
                <Button v-if="hasNextPage" link label="Load More" size="small" class="mt-2" :disabled="!hasNextPage || isFetchingNextPage" :loading="isFetchingNextPage" @click="fetchNextPage" />
            </template>
        </MultiSelect>
    </div>
</template>
