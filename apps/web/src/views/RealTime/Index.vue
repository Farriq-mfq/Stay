<script setup>
import { useQuery } from '@tanstack/vue-query';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const socket = proxy.socket

const expandedRows = ref({});
const filters = ref(null);
const first = ref(0);
const queryParams = ref({
    first: 0,
    rows: 10,
})
const totalRecords = ref(0);
const dt = ref()
const sessionId = ref(null)
const allPresences = ref([])


const getAllPresences = async () => {
    if (sessionId.value) {
        const queries = {
            page: (queryParams.value.first / queryParams.value.rows) + 1,
            limit: queryParams.value.rows,
            ...filters.value && { search: filters.value }
        }

        const params = new URLSearchParams(queries)

        return await axios.get(`/presence/${sessionId.value}?${params}`)
    } else {
        throw new Error()
    }
}


const { data: presences, isLoading, refetch } = useQuery({
    queryKey: [`presences-all`, sessionId.value, queryParams.value],
    queryFn: getAllPresences,
})


const onPage = (event) => {
    queryParams.value = event;
    refetch()
};

watch(presences, () => {
    if (presences.value) {
        totalRecords.value = presences.value.data.data.meta.totalCount
    }
})

const isListening = ref(false);

watch(sessionId, (newSessionId, oldSessionId) => {
    if (oldSessionId) {
        turnOffListener();
        socket.removeAllListeners(`PRESENCE_UPDATED_${oldSessionId}`)
    }
    if (newSessionId) {
        turnOnListener();
        refetch();
    }
})

const itemMap = ref(new Map());
const handlePresenceUpdate = (data) => {
    itemMap.value.set(data.id, data)
    allPresences.value = Array.from(itemMap.value.values())
    turnOffListener();
    setTimeout(turnOnListener, 100);
};


const turnOnListener = () => {
    if (!isListening.value && sessionId.value) {
        socket.once(`PRESENCE_UPDATED_${sessionId.value}`, handlePresenceUpdate);
        isListening.value = true;
        console.log(`Listen on`)
    }
};

const turnOffListener = () => {
    if (isListening.value && sessionId.value) {
        socket.off(`PRESENCE_UPDATED_${sessionId.value}`, handlePresenceUpdate);
        isListening.value = false;
        console.log(`Listen off`)
    }
};

onMounted(() => {
    if (sessionId.value) {
        turnOnListener();
        refetch();
    }
});

const handleDebounceFilter = (val) => {
    filters.value = val;
    refetch()
}


const handleChangeSelectSession = (val) => {
    sessionId.value = val.id
}

</script>
<template>
    <div class="card">
        <div class="field">
            <select-session @input="handleChangeSelectSession" />
        </div>

        <DataTable :value="allPresences" tableStyle="min-width: 50rem">
            <template #empty>
                <div class="flex justify-content-center p-4 gap-3 align-items-center">
                    <i class="pi pi-folder-open"></i>
                    <span>
                        Data presences masih kosong
                    </span>
                </div>
            </template>
            <!-- <Column expander /> -->
            <Column header="Nama">
                <template #body="{ data }">
                    {{ data }}
                    <!-- {{ data.siswaId }} -->
                </template>
            </Column>
            <!-- <Column header="Rombel">
                <template #body="{ data }">
                    {{ data.siswa.rombel }}
                </template>
            </Column>
            <Column header="Lokasi">
                <template #body="{ data }">
                    {{ data.gateway ? data.gateway.location : '-' }}
                </template>
            </Column>
            <Column header="Masuk">
                <template #body="{ data }">
                    {{ data.enter_time ?? '-' }}
                </template>
            </Column>
            <Column header="Keluar">
                <template #body="{ data }">
                    {{ data.exit_time ?? '-' }}
                </template>
            </Column>
            <Column header="Metode">
                <template #body="{ data }">
                    <Tag severity="info" v-if="data.method === 'card'">
                        <i class="pi pi-id-card mr-1" />
                        {{ data.method }}
                    </Tag>
                    <Tag severity="warning" v-if="data.method === 'qrcode'">
                        <i class="pi pi-id-card mr-1" />
                        {{ data.method }}
                    </Tag>
                    <Tag severity="secondary" v-if="data.method === 'other'">
                        {{ data.method }}
                    </Tag>
                </template>
            </Column> -->
        </DataTable>
    </div>
</template>