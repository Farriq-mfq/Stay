<script setup>
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { computed, getCurrentInstance, onMounted, ref, watch, nextTick } from 'vue';
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const socket = proxy.socket

const sessionId = ref(null)
const allPresences = ref(new Map());
const errorMessage = ref(null)


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
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map(presence => {
                allPresences.value.set(presence.id, presence)
            })
        }

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
        resetAllPresences()
        refetch();
    }
})

const resetAllPresences = () => {
    allPresences.value.clear()
}

const handlePresenceUpdate = (data) => {
    allPresences.value.set(data.id, data)
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(scrollToBottom)
};

const handlePresenceError = (error) => {
    errorMessage.value = error
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        setTimeout(() => {
            errorMessage.value = null
        }, 2000)
    })
};


const turnOnListener = () => {
    if (!isListening.value && sessionId.value) {
        socket.once(`PRESENCE_UPDATED_${sessionId.value}`, handlePresenceUpdate);
        socket.once(`PRESENCE_ERROR_${sessionId.value}`, handlePresenceError);
        isListening.value = true;
        console.log(`Listen on`)
    }
};

const turnOffListener = () => {
    if (isListening.value && sessionId.value) {
        socket.off(`PRESENCE_UPDATED_${sessionId.value}`, handlePresenceUpdate);
        socket.off(`PRESENCE_ERROR_${sessionId.value}`, handlePresenceError);
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

const dataPresences = computed(() => Array.from(allPresences.value.values()))

const dataTable = ref(null)
const scrollToBottom = () => {
    if (dataTable.value) {
        window.scrollTo({
            behavior: 'smooth',
            top: dataTable.value.$el.scrollHeight
        })
    }
}


const wrapperTop = ref(null)

onMounted(() => {
    scrollToBottom()

    if (window != undefined) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 150 && wrapperTop.value != null) {
                wrapperTop.value.classList.add('shadow-4')
            } else {
                wrapperTop.value.classList.remove('shadow-4')
            }
        })
    }
})

</script>

<template>
    <div>
        <div ref="wrapperTop" style="position: sticky;top: 0;z-index: 999;" class="bg-white px-6 py-4">
            <clock />
            <div class="field">
                <select-session @input="handleChangeSelectSession" />
            </div>
            <Message severity="warn" v-if="errorMessage" :closable="false">
                {{ errorMessage }}
            </Message>
        </div>
        <div class="card" v-if="sessionId">
            <DataTable :value="dataPresences" tableStyle="min-width: 50rem" :loading="isLoading" ref="dataTable">
                <template #empty>
                    <div class=" flex justify-content-center p-4 gap-3 align-items-center">
                        <i class="pi pi-folder-open"></i>
                        <span>
                            Data Presensi Hari Ini Belum ada
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
    </div>
</template>