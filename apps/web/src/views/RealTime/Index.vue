<script setup>
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getCurrentInstance, onMounted, ref, watch } from 'vue';
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const socket = proxy.socket

const sessionId = ref(null)
const allPresences = ref([])


const getAllPresences = async () => {
    if (sessionId.value) {
        return await axios.get(`/presence/${sessionId.value}/today`)
    } else {
        throw new Error()
    }
}


const { data: presences, isLoading, refetch } = useQuery({
    queryKey: [`presences-all`, sessionId.value],
    queryFn: getAllPresences,
})

watch(presences, () => {
    if (presences.value) {
        allPresences.value = presences.value.data.data
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


const handleChangeSelectSession = (val) => {
    sessionId.value = val.id
}

</script>
<template>
    <div class="card">
        <div class="field">
            <select-session @input="handleChangeSelectSession" />
        </div>
        <DataTable v-if="sessionId" :value="allPresences" tableStyle="min-width: 50rem" :loading="isLoading">
            <template #empty>
                <div class="flex justify-content-center p-4 gap-3 align-items-center">
                    <i class="pi pi-folder-open"></i>
                    <span>
                        Data presences masih kosong
                    </span>
                </div>
            </template>
            <Column header="Nama">
                <template #body="{ data }">
                    {{ data.siswa.name }}
                </template>
            </Column>
            <Column header="Rombel">
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
                    {{ data.enter_time ? format(data.enter_time, 'dd/MM/yyyy HH:mm:ss', { locale: id }) : '-' }}
                </template>
            </Column>
            <Column header="Keluar">
                <template #body="{ data }">
                    {{ data.exit_time ? format(data.exit_time, 'dd/MM/yyyy HH:mm:ss', { locale: id }) : '-' }}
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
            </Column>
        </DataTable>
    </div>
</template>