<script setup>
import { getCurrentInstance, onMounted, ref, watch, nextTick, onUnmounted } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import VLazyImage from 'v-lazy-image';
import CurrentDay from '../../../components/CurrentDay.vue';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import { computed } from 'vue';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const socket = proxy.socket;
const allPresences = ref(new Map());
const errorMessage = ref(null);
const successPresence = ref(null);
const reloadText = ref(null);
const lastFocusedRow = ref(null);


const { sessionId, detailSession } = defineProps({
    sessionId: {
        type: Number,
        requered: true
    },
    detailSession: {
        type: Object,
        required: true
    }
});

const getPegawai = async () => {
    return await axios.get(`/pegawai/${sessionId}/all`);
};

const { data: pegawai } = useQuery({
    queryKey: ['pegawai-all'],
    queryFn: getPegawai
});

const getAllPresences = async () => {
    if (sessionId) {
        return await axios.get(`/presence/${sessionId}/today`);
    } else {
        throw new Error();
    }
};

const {
    data: presences,
    isLoading,
    refetch
} = useQuery({
    queryKey: [`presences-realtime-pegawai`, sessionId],
    queryFn: getAllPresences
});

watch(presences, () => {
    if (presences.value) {
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map((presence) => {
                allPresences.value.set(presence.pegawaiId, presence);
            });
        }
    }
});

const isListening = ref(false);

watch(
    () => sessionId,
    (newSessionId, oldSessionId) => {
        if (oldSessionId) {
            turnOffListener();
            socket.removeAllListeners(`PRESENCE_UPDATED_${oldSessionId}`);
        }
        if (newSessionId) {
            turnOnListener();
            resetAllPresences();
            refetch();
        }
    }
);

const resetAllPresences = () => {
    allPresences.value.clear();
};

const handlePresenceUpdate = (data) => {
    successPresence.value = data;
    allPresences.value.set(data.pegawaiId, data);
    turnOffListener();
    setTimeout(turnOnListener, 100);

    nextTick(() => {
        // focusRow(data.pegawaiId);
        setTimeout(() => {
            successPresence.value = null;
        }, 2000);
    });
};

const handlePresenceError = (error) => {
    errorMessage.value = error;
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        setTimeout(() => {
            errorMessage.value = null;
        }, 2000);
    });
};

const turnOnListener = () => {
    if (!isListening.value && sessionId) {
        socket.once(`PRESENCE_UPDATED_${sessionId}`, handlePresenceUpdate);
        socket.once(`PRESENCE_ERROR_${sessionId}`, handlePresenceError);
        isListening.value = true;
        console.log(`Listen on`);
    }
};

const turnOffListener = () => {
    if (isListening.value && sessionId) {
        socket.off(`PRESENCE_UPDATED_${sessionId}`, handlePresenceUpdate);
        socket.off(`PRESENCE_ERROR_${sessionId}`, handlePresenceError);
        isListening.value = false;
        console.log(`Listen off`);
    }
};

const handleRefresh = () => {
    refetch();
    resetAllPresences();
    if (presences.value) {
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map((presence) => {
                allPresences.value.set(presence.pegawaiId, presence);
            });
        }
    }
    reloadText.value = `Reloaded ${format(Date.now(), 'HH:mm:ss', { locale: id })}`;
    setTimeout(() => {
        reloadText.value = null;
    }, 1000);
};
const emit = defineEmits(['close']);
const clearSession = () => {
    turnOffListener();
    socket.removeAllListeners(`PRESENCE_UPDATED_${sessionId}`);
    resetAllPresences();
    refetch();
    emit('close');
};

const rowRefs = ref({});
const focusedRow = ref(null);

const focusRow = (id) => {
    if (rowRefs.value[id]) {
        rowRefs.value[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        focusedRow.value = id;
        lastFocusedRow.value = id;
    }
};

const setRowRef = (el, id) => {
    if (el) {
        rowRefs.value[id] = el;
    }
};

let intervalId = null;
onMounted(() => {
    if (sessionId) {
        turnOnListener();
        refetch();
    }
    intervalId = setInterval(() => handleRefresh(), 10000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

const dataPresences = computed(() => Array.from(allPresences.value.values()));
</script>
<template>
    <div>
        <div class="mx-4 flex gap-2 align-items-center justify-content-center lg:justify-content-start mb-5">
            <Button label="Reload" icon="pi pi-refresh" @click.prevent="handleRefresh" size="small" />
            <Button label="Close" icon="pi pi-times" outlined size="small" severity="danger" @click.prevent="clearSession" />
        </div>
        <div class="flex flex-wrap">
            <div class="xl:col-4 col-12 px-4">
                <div class="border-2 border-round-xl p-4" :class="{ 'border-red-500': errorMessage, 'surface-border': !successPresence && !errorMessage, 'border-green-500': successPresence }">
                    <!-- header -->
                    <div class="flex flex-column align-items-center justify-content-center text-center">
                        <CurrentDay />
                        <Clock />
                    </div>
                    <Divider class="mb-3 mt-0" />
                    <div class="flex flex-column align-items-center gap-3">
                        <div
                            class="h-20rem w-15rem border-round-xl border-1 surface-border overflow-hidden"
                            :class="{
                                'bg-red-500': errorMessage,
                                'surface-card': !errorMessage
                            }"
                        >
                            <v-lazy-image :src="successPresence.pegawai.profile_picture" class="w-full h-full" style="object-fit: cover" v-if="successPresence" />
                        </div>
                        <h2 class="text-3xl m-0 font-semibold" v-if="successPresence">
                            {{ successPresence.pegawai.name }}
                        </h2>
                        <h4 class="text-xl m-0 text-green-500" v-if="successPresence && successPresence.enter_time">
                            {{ format(successPresence.enter_time, 'HH:mm:ss', { locale: id }) }}
                        </h4>
                        <h4 class="text-xl m-0 text-red-500" v-if="successPresence && successPresence.exit_time">
                            {{ format(successPresence.exit_time, 'HH:mm:ss', { locale: id }) }}
                        </h4>
                        <p v-if="errorMessage" class="text-red-500">
                            {{ errorMessage }}
                        </p>
                        <div class="text-center" v-if="successPresence">
                            <i class="pi pi-check-circle text-4xl text-green-500"></i>
                            <p class="mt-2">Terimakasih</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="xl:col-8 col-12 px-4">
                <div class="flex flex-column border-1 surface-border border-round-xl gap-3 overflow-hidden pb-4">
                    <div class="bg-primary border-b flex justify-content-between p-4 flex-column md:flex-row">
                        <h2 class="text-3xl m-0 text-white">{{ detailSession.name }}</h2>
                        <h4 class="text-xl mb-2 mt-2 text-white">Jumlah presensi : {{ allPresences.size }}</h4>
                    </div>
                    <div class="h-20rem overflow-y-auto">
                        <DataView :value="dataPresences" unstyled>
                            <template #list="slotProps">
                                <div class="flex flex-wrap">
                                    <TransitionGroup name="list" mode="out-in">
                                        <div class="lg:col-2 col-6" v-for="item in slotProps.items.reverse()" :key="item.pegawai.id" :ref="(el) => setRowRef(el, item.pegawai.id)">
                                            <div class="flex flex-column align-items-center" :class="{ 'border-bottom-1 border-primary py-4': lastFocusedRow === item.pegawai.id }">
                                                <div class="h-8rem w-8rem border-round-xl overflow-hidden surface-card border-1 surface-border">
                                                    <v-lazy-image :src="item.pegawai.profile_picture" class="w-full h-full" style="object-fit: cover" />
                                                </div>
                                                <div class="flex flex-column gap-2 align-items-center justify-content-center">
                                                    <h3 class="text-xl font-semibold text-center mb-0 mt-2">{{ item.pegawai.name }}</h3>
                                                    <div class="flex flex-column gap-2">
                                                        <Tag icon="pi pi-clock" severity="success" :value="format(item.enter_time, 'HH:mm:ss', { locale: id })" />
                                                        <Tag icon="pi pi-clock" severity="danger" :value="format(item.exit_time, 'HH:mm:ss', { locale: id })" v-if="item.exit_time" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TransitionGroup>
                                </div>
                            </template>
                            <template #empty>
                                <div class="flex justify-content-center p-4 gap-3 align-items-center">
                                    <i class="pi pi-folder-open"></i>
                                    <span> Data Presensi Hari Ini Belum ada </span>
                                </div>
                            </template>
                        </DataView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.v-lazy-image {
    filter: blur(5px);
    transition: filter 1.6s;
    will-change: filter;
}

.v-lazy-image-loaded {
    filter: blur(0);
}
</style>
