<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { computed, getCurrentInstance, onMounted, ref, watch, nextTick } from 'vue';
import { Vue3Lottie } from 'vue3-lottie'
import RfidJson from './rfid.json'
import CurrentDay from '../../components/CurrentDay.vue';
import AppConfig from '../../layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';

const { proxy } = getCurrentInstance()
const axios = proxy.axios
const socket = proxy.socket

const sessionId = ref(null)
const allPresences = ref(new Map());
const errorMessage = ref(null)
const successPresence = ref(null)


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
    successPresence.value = data
    allPresences.value.set(data.id, data)
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        scrollToBottom()
        setTimeout(() => {
            successPresence.value = null
        }, 500)
    })
};

const handlePresenceError = (error) => {
    errorMessage.value = error
    turnOffListener();
    setTimeout(turnOnListener, 100);
    nextTick(() => {
        setTimeout(() => {
            errorMessage.value = null
        }, 500)
    })
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

const detailSession = ref(null)

const handleChangeSelectSession = (val) => {
    sessionId.value = val.id
    detailSession.value = val
}

const dataPresences = computed(() => Array.from(allPresences.value.values()))

const scrollToBottom = () => {
    if (scrooltoBottomRealtimePage.value) {
        scrooltoBottomRealtimePage.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}



onMounted(() => {
    scrollToBottom()
})


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

const clearSession = () => {
    turnOffListener();
    socket.removeAllListeners(`PRESENCE_UPDATED_${sessionId.value}`)
    resetAllPresences()
    sessionId.value = null
    detailSession.value = null
    refetch();
}

const scrooltoBottomRealtimePage = ref(null);
const toast = useToast()

const presenceService = async (data) => {
    return await axios.post("/events/nis", data)
}

const {
    mutateAsync: presenceServiceMutation,
    isPending: presenceServiceLoading,

} = useMutation({
    mutationKey: ['presence-service'],
    mutationFn: presenceService,
})

const errorPresence = ref(null)
const inputPresence = ref(null)

const nisn = ref(null);
const onSubmit = () => {
    presenceServiceMutation({
        nisn: nisn.value,
        session: sessionId.value,
    }, {
        onSuccess: (data) => {
            toast.add({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Presensi Berhasil',
                life: 3000
            })
            nis.value = null
            errorPresence.value = null
        },
        onError: (err) => {
            if (err.response.status === 400) {
                if (err.response.data.error) {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.response.data.message,
                        life: 3000
                    })
                } else {
                    errorPresence.value = err.response.data
                }
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Terjadi kesalahan',
                    life: 3000
                })
            }
        },
        
    })
}

</script>

<template>
    <div class="pt-3">
        <div class="mx-4 mt-3">
            <div class="field" v-if="sessionId === null">
                <select-session @input="handleChangeSelectSession" />
            </div>
            <div class="flex gap-2 align-items-center justify-content-center lg:justify-content-start">
                <Button label="Reload" icon="pi pi-refresh" @click.prevent="handleRefresh" size="small"
                    v-if="sessionId" />
                <Button label="Close" icon="pi pi-times" outlined size="small" severity="danger"
                    @click.prevent="clearSession" v-if="sessionId" />
            </div>
        </div>
        <div class="flex flex-wrap" v-if="sessionId">
            <div class="xl:col-6 col-12">
                <div
                    class="flex flex-wrap justify-content-between py-4 px-3 shadow-2 align-items-center bg-primary border-round">
                    <div>
                        <div class="font-semibold lg:text-xl text-lg"> {{ detailSession.name }} </div>
                        <div class="mt-2 text-md">
                            Aktifitas Presensi secara realtime
                        </div>
                    </div>
                    <div>
                        <div class="font-semibold lg:text-lg text-lg md:mt-0 mt-3">Jumlah Presensi : {{
                            allPresences.size
                            }}</div>
                    </div>
                </div>
                <DataView :value="dataPresences">
                    <template #list="slotProps">
                        <div class="border-solid border-1 surface-border p-3 overflow-y-auto border-round mt-2 flex flex-column gap-2"
                            style="max-height: 75vh;height: fit-content">
                            <TransitionGroup name="list" tag="div" class="flex flex-column gap-3">
                                <div v-for="(item, index) in slotProps.items" :key="index"
                                    :class="`${(index + 1) === slotProps.items.length ? 'border-primary border-2' : 'surface-border border-1 '} border-solid p-3 border-round shadow-1`">
                                    <div class="flex justify-content-between align-items-center">
                                        <div>
                                            <div class="font-semibold text-xl mb-2">
                                                {{ item.siswa.name }}
                                            </div>
                                            <div class="mb-2">
                                                <b>Rombel</b> : <Tag class="bg-primary">{{ item.siswa.rombel }}</Tag>
                                            </div>
                                        </div>
                                        <div>
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
                                    <Divider />
                                    <div class="text-md mb-2">
                                        <b>Lokasi</b> : {{ item.gateway ? item.gateway.location : '-' }}
                                    </div>
                                    <div class="text-md mb-2" v-html="`${detailSession.allow_twice ? '<b>Masuk</b> : ' : '<b>Waktu</b> : '}${item.enter_time ?
                                        format(item.enter_time, 'dd/MM/yyyy HH:mm:ss', {
                                            locale: id
                                        }) :
                                        '-'}`">
                                    </div>
                                    <div class="text-md mb-2" v-if="detailSession.allow_twice">
                                        <b>Keluar</b> : {{ item.exit_time ?
                                            format(item.exit_time, 'dd/MM/yyyy HH:mm:ss', {
                                                locale: id
                                            }) :
                                            '-' }}
                                    </div>
                                </div>
                            </TransitionGroup>

                            <div ref="scrooltoBottomRealtimePage"></div>
                        </div>
                    </template>
                    <template #empty>
                        <div class=" flex justify-content-center p-4 gap-3 align-items-center">
                            <i class="pi pi-folder-open"></i>
                            <span>
                                Data Presensi Hari Ini Belum ada
                            </span>
                        </div>
                    </template>
                </DataView>
            </div>
            <div class="xl:col-6 col-12">
                <div class="border-solid border-round-xl pb-4 surface-border border-1 shadow-1 flex align-items-center flex-column"
                    style="height: fit-content;">
                    <div
                        class="w-full h-full text-center flex flex-column align-items-center pt-4 mb-4 justify-content-center">
                        <CurrentDay />
                        <clock />
                    </div>
                    <form @submit.prevent="onSubmit" class="w-full p-fluid">
                        <div class="field px-5">
                            <label for="nis" class="text-lg font-semibold">Masukan NISN</label>
                            <InputText class="w-full" ref="inputPresence" v-model="nisn" placeholder="12345"
                                :invalid="errorPresence && errorPresence.nisn.length > 0" size="large" autofocus="on" />
                            <p class="text-red-500" v-if="errorPresence && errorPresence.nisn">
                                {{ errorPresence.nisn[0] }}
                            </p>
                        </div>
                        <div class="field w-fit px-5">
                            <Button label="Presensi" type="submit" icon="pi pi-save" :disabled="presenceServiceLoading" :loading="presenceServiceLoading" size="large" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <app-config></app-config>
        <div class="layout-mask"></div>
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
</style>