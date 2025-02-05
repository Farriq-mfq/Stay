<script setup>
import { useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { computed, getCurrentInstance, onMounted, ref, watch, nextTick, TransitionGroup } from 'vue';
// import { Vue3Lottie } from 'vue3-lottie'
// import RfidJson from './rfid.json'
import CurrentDay from '../../../components/CurrentDay.vue';
import VLazyImage from 'v-lazy-image';
import { onUnmounted } from 'vue';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const socket = proxy.socket;

const allPresences = ref(new Map());
const errorMessage = ref(null);
const successPresence = ref(null);
const currentDate = ref(format(Date.now(), 'EEEE, dd MMM yyyy', { locale: id }));

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
    queryKey: [`presences-all`, sessionId],
    queryFn: getAllPresences
});

watch(presences, () => {
    if (presences.value) {
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map((presence) => {
                allPresences.value.set(presence.siswa.id, presence);
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
    allPresences.value.set(data.siswa.id, data);
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        // scrollToBottom();
        setTimeout(() => {
            successPresence.value = null;
        }, 500);
    });
};

const handlePresenceError = (error) => {
    errorMessage.value = error;
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        setTimeout(() => {
            errorMessage.value = null;
        }, 500);
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

onMounted(() => {
    if (sessionId) {
        turnOnListener();
        refetch();
    }
});

const dataPresences = computed(() => Array.from(allPresences.value.values()));

// const scrollToBottom = () => {
//     if (scrooltoBottomRealtimePage.value) {
//         scrooltoBottomRealtimePage.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
// };

const handleRefresh = () => {
    console.info('refresh', Date.now());
    refetch();
    resetAllPresences();
    currentDate.value = format(Date.now(), 'EEEE, dd MMM yyyy', { locale: id });
    if (presences.value) {
        if (presences.value.data.data.length > 0) {
            presences.value.data.data.map((presence) => {
                allPresences.value.set(presence.siswa.id, presence);
            });
        }
    }
};

const clearSession = () => {
    turnOffListener();
    socket.removeAllListeners(`PRESENCE_UPDATED_${sessionId}`);
    resetAllPresences();
    refetch();
    emit('close');
};

const scrooltoBottomRealtimePage = ref(null);

const emit = defineEmits(['close']);
let intervalId = null;

onMounted(() => {
    // scrollToBottom();
    intervalId = setInterval(() => handleRefresh(), 10000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});
</script>
<template>
    <div>
        <div class="mx-3 flex gap-2 align-items-center justify-content-center lg:justify-content-start">
            <Button label="Reload" icon="pi pi-refresh" @click.prevent="handleRefresh" size="small" />
            <Button label="Close" icon="pi pi-times" outlined size="small" severity="danger" @click.prevent="clearSession" />
        </div>
        <div class="flex flex-wrap">
            <div class="xl:col-5 col-12">
                <div class="border-solid border-round-xl py-4 surface-border border-1 shadow-1 flex align-items-center flex-column" style="height: fit-content">
                    <v-lazy-image src="/main-logo.png" style="width: 250px; height: 250px; object-fit: cover" />
                    <div class="w-full h-full text-center flex flex-column align-items-center pt-4 mb-4 justify-content-center">
                        <CurrentDay />
                        <clock />
                    </div>
                    <span class="text-3xl font-bold text-center" v-if="errorMessage"> {{ errorMessage }} </span>
                    <i class="pi pi-times text-red-500" v-if="errorMessage" style="font-size: 200px; font-weight: 100"></i>
                    <span class="text-3xl font-bold text-center" v-if="successPresence"> Terimakasih </span>
                    <i class="pi pi-check text-primary" v-if="successPresence" style="font-size: 200px; font-weight: 100"></i>
                    <!-- <span class="text-3xl font-bold text-center" v-if="!errorMessage && !successPresence"> SILAHKAN TAP
                        KARTU
                    </span> -->
                    <!-- <Vue3Lottie :animationData="RfidJson" class="lg:w-30rem lg:h-30rem" v-if="!errorMessage && !successPresence" /> -->
                </div>
            </div>
            <div class="xl:col-7 col-12">
                <div class="flex flex-wrap justify-content-between py-4 px-3 shadow-2 align-items-center bg-primary border-round">
                    <div>
                        <div class="font-semibold lg:text-xl text-lg">{{ detailSession.name }}</div>
                        <div class="mt-2 text-md">Aktifitas Presensi secara realtime</div>
                    </div>
                    <div class="flex flex-column gap-2">
                        <div class="font-semibold lg:text-lg text-lg md:mt-0 mt-3">Jumlah Presensi : {{ allPresences.size }}</div>
                        <div class="font-semibold lg:text-lg text-lg md:mt-0 mt-3">{{ currentDate }}</div>
                    </div>
                </div>
                <DataView :value="dataPresences.reverse()">
                    <template #list="slotProps">
                        <div class="border-solid border-1 surface-border p-3 overflow-y-auto border-round mt-2 flex flex-column gap-2" style="max-height: 75vh; height: fit-content">
                            <TransitionGroup name="list" tag="div" class="flex flex-column gap-3">
                                <div v-for="(item, index) in slotProps.items" :key="item.siswa.id" :class="`${index + 1 === 1 ? 'border-primary border-2' : 'surface-border border-1 '} border-solid p-3 border-round shadow-1`">
                                    <div class="flex justify-content-between align-items-center relative">
                                        <div>
                                            <div class="font-semibold text-xl mb-2">
                                                {{ item.siswa.name }}
                                            </div>
                                            <div class="mb-2">
                                                <b>Rombel</b> : <Tag class="bg-primary">{{ item.siswa.rombel }}</Tag>
                                            </div>
                                        </div>
                                        <div style="z-index: 50 !important" class="absolute right-0 top-0 bottom-0">
                                            <v-lazy-image class="shadow-xl border-solid rounded border-1 w-7rem h-11rem object-cover" v-if="item.siswa.profile_picture" :src="item.siswa.profile_picture" />
                                            <div v-else style="height: 100px; width: 100px"></div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div class="text-md mb-2"><b>Lokasi</b> : {{ item.gateway ? item.gateway.location : '-' }}</div>
                                    <div
                                        class="text-md mb-2"
                                        v-html="
                                            `${detailSession.allow_twice ? '<b>Masuk</b> : ' : '<b>Waktu</b> : '}${
                                                item.enter_time
                                                    ? format(item.enter_time, 'HH:mm:ss', {
                                                          locale: id
                                                      })
                                                    : '-'
                                            }`
                                        "
                                    ></div>
                                    <div class="text-md mb-2" v-if="detailSession.allow_twice">
                                        <b>Keluar</b> :
                                        {{
                                            item.exit_time
                                                ? format(item.exit_time, 'HH:mm:ss', {
                                                      locale: id
                                                  })
                                                : '-'
                                        }}
                                    </div>
                                    <div>
                                        <b>Metode </b> :
                                        <Tag severity="info" v-if="item.method === 'card'">
                                            <i class="pi pi-id-card mr-1" />
                                            {{ item.method }}
                                        </Tag>
                                        <Tag severity="warning" v-if="item.method === 'qrcode'">
                                            <i class="pi pi-id-card mr-1" />
                                            {{ item.method }}
                                        </Tag>
                                        <Tag severity="secondary" v-if="item.method === 'other'">
                                            {{ item.method }}
                                        </Tag>
                                    </div>
                                </div>
                            </TransitionGroup>

                            <div ref="scrooltoBottomRealtimePage"></div>
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
