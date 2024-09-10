<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { watch, ref, getCurrentInstance, computed, onMounted } from 'vue';

const props = defineProps(['session', 'refetch'])
const getSession = ref(null)
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const toast = useToast()
const loggingStatus = ref([])



watch(() => props.session, (val) => {
    if (val != null) getSession.value = val
    else getSession.value = val
})

const statusLogging = ref(null)


const startSessionService = async (id) => {
    try {
        return await axios.post(`/whatsapp/start-session/${id}`)
    } catch (e) {
        throw e
    }
}


const {
    data: startSession,
    status,
} = useQuery({
    queryKey: [`startSession_${getSession.value != null ? getSession.value.id : ''}`],
    enabled: computed(() => getSession.value != null),
    queryFn: () => {
        if (getSession.value != null) {
            return startSessionService(getSession.value.id)
        } else {
            throw new Error('Session not found')
        }
    },
    refetchInterval: 1500,
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 10,
})

const closeSessionService = async (id) => {
    try {
        return await axios.post(`/whatsapp/close-session/${id}`)
    } catch (e) {
        throw e
    }
}


const {
    mutateAsync: closeSession,
    isPending: isClosingSession
} = useMutation({
    mutationKey: [`closeSession_${getSession.value != null ? getSession.value.id : ''}`],
    mutationFn: () => {
        if (getSession.value != null) {
            return closeSessionService(getSession.value.id)
        } else {
            throw new Error('Session not found')
        }
    },
    enabled: getSession.value != null
})



const handleCloseStartSession = () => {
    if (status === 'error') {
        getSession.value = null
    } else {
        closeSession({}, {
            onSuccess: () => {
                toast.add({
                    severity: 'success',
                    summary: 'Berhasil',
                    detail: 'Session telah ditutup',
                    life: 3000
                })

                getSession.value = null
                loggingStatus.value = []

            },
            onError: () => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Silahkan coba lagi",
                    life: 3000
                })
            },
        })

    }

}



watch(() => startSession.value, (val) => {
    if (val && val.data) {
        if (val.data.data.status === 'CONNECTED') {
            delay(1000)
            getSession.value = null
            toast.add({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Session Berhasil Connect',
                life: 3000
            })
            props.refetch()
        }
        scrollLogToBottom()
        addLogMessage(val.data.data.status)
    }
})
const emits = defineEmits(['closeStart'])

const onClose = () => {
    emits('closeStart')
}


const addLogMessage = (message) => {
    loggingStatus.value.push(message)
}


const scrollLogToBottom = () => {
    if (statusLogging.value != null) {
        statusLogging.value.scrollIntoView({ behavior: 'smooth', })
    }
};

onMounted(() => {
    scrollLogToBottom()
    loggingStatus.value = []
})



const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
</script>
<template>
    <Dialog v-model:visible="getSession" :modal="true" :header="getSession ? getSession.name : false" @hide="onClose"
        :style="{ width: '450px' }" :closable="false">
        <p v-if="status === 'pending'">Mohon tunggu...</p>
        <div class="flex align-items-center mb-5 justify-content-between">
            <div
                class="text-xs h-18rem w-full overflow-y-auto border-solid border-1 pt-3 px-3 surface-border shadow-1 border-round">
                <p class="m-0" v-for="(log, idx) in loggingStatus" :key="idx">{{ log + '...' }}</p>
                <div ref="statusLogging" class="mt-4"></div>
            </div>
            <img v-if="status === 'success' && startSession.data.data.qrcode" class="flex-1"
                :src="startSession.data.data.qrcode" />
        </div>
        <p v-if="status === 'error'" class="text-red-500">Terjadi kesalahan sistem</p>
        <div class="flex justify-content-end gap-2">
            <Button type="button" label="Close" severity="danger" :loading="isClosingSession"
                @click.prevent="handleCloseStartSession"></Button>
        </div>
    </Dialog>
</template>
