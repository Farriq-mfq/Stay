<script setup>
import { getCurrentInstance, onMounted, ref, watch, nextTick } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import VLazyImage from "v-lazy-image";
import CurrentDay from '../../../components/CurrentDay.vue';
import { id } from 'date-fns/locale'
import { format } from 'date-fns'


const { proxy } = getCurrentInstance()
const axios = proxy.axios
const socket = proxy.socket
const allPresences = ref(new Map());
const errorMessage = ref(null)
const successPresence = ref(null)

const { sessionId, detailSession } = defineProps({
    sessionId: {
        type: Number,
        requered: true
    },
    detailSession: {
        type: Object,
        required: true
    }
})


const getPegawai = async () => {
    return await axios.get(`/pegawai/${sessionId}/all`)
}

const { data: pegawai } = useQuery({
    queryKey: ["pegawai-all"],
    queryFn: getPegawai
})


const getAllPresences = async () => {
    if (sessionId) {
        return await axios.get(`/presence/${sessionId}/today`)
    } else {
        throw new Error()
    }
}


const { data: presences, isLoading, refetch } = useQuery({
    queryKey: [`presences-realtime-pegawai`, sessionId],
    queryFn: getAllPresences,
})


watch(presences, () => {
    if (presences.value) {
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map(presence => {
                allPresences.value.set(presence.pegawaiId, presence)
            })
        }

    }
})


const isListening = ref(false);

watch(() => sessionId, (newSessionId, oldSessionId) => {
    if (oldSessionId) {
        turnOffListener();
        socket.removeAllListeners(`PRESENCE_UPDATED_${oldSessionId}`)
    }
    if (newSessionId) {
        turnOnListener();
        resetAllPresences()
        refetch();
    }
})

const resetAllPresences = () => {
    allPresences.value.clear()
}

const handlePresenceUpdate = (data) => {
    successPresence.value = data
    allPresences.value.set(data.pegawaiId, data)
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        focusRow(data.pegawaiId)
        setTimeout(() => {
            successPresence.value = null
        }, 1500)
    })
};

const handlePresenceError = (error) => {
    errorMessage.value = error
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        setTimeout(() => {
            errorMessage.value = null
        }, 1500)
    })
};


const turnOnListener = () => {
    if (!isListening.value && sessionId) {
        socket.once(`PRESENCE_UPDATED_${sessionId}`, handlePresenceUpdate);
        socket.once(`PRESENCE_ERROR_${sessionId}`, handlePresenceError);
        isListening.value = true;
        console.log(`Listen on`)
    }
};

const turnOffListener = () => {
    if (isListening.value && sessionId) {
        socket.off(`PRESENCE_UPDATED_${sessionId}`, handlePresenceUpdate);
        socket.off(`PRESENCE_ERROR_${sessionId}`, handlePresenceError);
        isListening.value = false;
        console.log(`Listen off`)
    }
};

onMounted(() => {
    if (sessionId) {
        turnOnListener();
        refetch();
    }
});


const handleRefresh = () => {
    refetch()
    resetAllPresences()
    if (presences.value) {
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map(presence => {
                allPresences.value.set(presence.id, presence)
            })
        }

    }
}
const emit = defineEmits(['close'])
const clearSession = () => {
    turnOffListener();
    socket.removeAllListeners(`PRESENCE_UPDATED_${sessionId}`)
    resetAllPresences()
    refetch();
    emit('close')
}

const rowRefs = ref({});
const focusedRow = ref(null);

const focusRow = (id) => {
    if (rowRefs.value[id]) {
        rowRefs.value[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        focusedRow.value = id;
    }
};

const setRowRef = (el, id) => {
    if (el) {
        rowRefs.value[id] = el;
    }
};

</script>
<template>
    <div>
        <div class="mx-4 flex gap-2 align-items-center justify-content-center lg:justify-content-start mb-5">
            <Button label="Reload" icon="pi pi-refresh" @click.prevent="handleRefresh" size="small" />
            <Button label="Close" icon="pi pi-times" outlined size="small" severity="danger"
                @click.prevent="clearSession" />
        </div>
        <div class="flex flex-column justify-content-center align-items-center">
            <h3 class="font-bold text-3xl uppercase">
                {{ detailSession.name }}
            </h3>
            <CurrentDay />
            <clock />
        </div>

        <div class="overflow-x-auto mx-5" style="height:600px">
            <Message size="large" v-if="errorMessage" severity="error">{{ errorMessage }}</Message>
            <Message size="large" v-if="successPresence" severity="success">
                Terimakasih : {{ successPresence.pegawai.name }}
            </Message>
            <table ref="componentPrintRef" class="p-datatable p-datatable-gridlines p-component w-full" v-if="pegawai">
                <thead class="p-datatable-thead">
                    <tr>
                        <th class="p-column-header">No</th>
                        <th class="p-column-header">Nama</th>
                        <th class="p-column-header">Jabatan</th>
                        <th class="p-column-header">Kelompok</th>
                        <th class="p-column-header">Waktu</th>
                        <th class="p-column-header">TTD</th>
                    </tr>
                </thead>
                <tbody class="p-datatable-tbody" v-for="(pg, idx) in pegawai.data.data" :key="pg.id">
                    <tr class="p-row" :ref="(el) => setRowRef(el, pg.id)">
                        <td class="p-column-body">
                            {{ idx + 1 }}
                        </td>
                        <td class="p-column-body">
                            {{ pg.name }}
                        </td>
                        <td class="p-column-body">
                            {{ pg.position }}
                        </td>
                        <td class="p-column-body">
                            {{ pg.group }}
                        </td>
                        <td class="p-column-body">
                            <div class="flex flex-column gap-2 justify-content-center items-center w-fit"
                                v-if="allPresences.get(pg.id)">
                                <Tag icon="pi pi-clock" severity="success"
                                    :value="format(allPresences.get(pg.id).enter_time, 'HH:mm:ss', { locale: id })" />
                                <Tag icon="pi pi-clock" severity="danger"
                                    :value="format(allPresences.get(pg.id).exit_time, 'HH:mm:ss', { locale: id })"
                                    v-if="allPresences.get(pg.id).exit_time" />
                            </div>
                        </td>
                        <td class="p-column-body">
                            <v-lazy-image v-if="allPresences.has(pg.id)" :src="pg.sign_picture"
                                style="width: 100px; height: 100px;object-fit: cover;" />
                            <div v-else style="height: 100px;width: 100px;"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>