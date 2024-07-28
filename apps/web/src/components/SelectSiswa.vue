<script setup>
import { ref, getCurrentInstance, watch, onMounted, nextTick, onBeforeUnmount } from "vue";
import { useInfiniteQuery, useQuery } from '@tanstack/vue-query'
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

const getAllSiswa = async ({ pageParam = 1 }) => {
    const queries = {
        page: pageParam,
        limit: 50,
        ...filters.value && { search: filters.value },
        ...role && { role }
    }

    const params = new URLSearchParams(queries)
    return await axios.get(`/siswa?${params}`)
}

const selectSiswa = ref();
const items = ref([]);
const { data: siswa, isLoading, refetch, fetchNextPage,
    hasNextPage,
    isFetchingNextPage, } = useInfiniteQuery({
        queryKey: ["selectSiswa", filters.value],
        queryFn: getAllSiswa,
        getNextPageParam: (lastPage) => {
            return lastPage.data.data.meta.nextPage
        },
    })


watch(() => siswa.value, (val) => {
    if (val) {
        const itemMap = new Map();
        val.pages.forEach(page => {
            page.data.data.items.forEach(item => {
                if (!itemMap.has(item.id)) {
                    itemMap.set(item.id, item);
                }
            });
        });
        items.value = Array.from(itemMap.values());
    }
})

watch(() => selectSiswa.value, (val) => {
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
        selectSiswa.value = defaultValue
    } else {
        selectSiswa.value = null
    }
})

</script>
<template>
    <div>
        <Dropdown v-if="!multiple" v-model="selectSiswa" :loading="isLoading" filter @filter="handleFilter" showClear
            :options="isLoading ? [] : items" optionLabel="name" placeholder="Pilih Siswa" id="dropdown-siswa"
            class="w-full">
            <template #footer>
                <Button v-if="hasNextPage" link label="Load More" size="small" class="mt-2"
                    :disabled="!hasNextPage || isFetchingNextPage" :loading="isFetchingNextPage"
                    @click="fetchNextPage" />
                <p v-else>Nothing to load</p>
                <p class="text-sm ml-2 text-500">
                    Showing {{ items.length }}
                </p>
            </template>

        </Dropdown>

        <MultiSelect v-if="multiple" display="chip" v-model="selectSiswa" :loading="isLoading" filter
            @filter="handleFilter" showClear :options="isLoading ? [] : items" optionLabel="name"
            placeholder="Pilih Siswa" class="w-full">
            <template #footer>
                <Button v-if="hasNextPage" link label="Load More" size="small" class="mt-2"
                    :disabled="!hasNextPage || isFetchingNextPage" :loading="isFetchingNextPage"
                    @click="fetchNextPage" />
                <p v-else>Nothing to load</p>
                <p class="text-sm ml-2 text-500">
                    Showing {{ items.length }}
                </p>
            </template>
        </MultiSelect>
    </div>

</template>