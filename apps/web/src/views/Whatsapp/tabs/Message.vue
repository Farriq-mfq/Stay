<script setup lang="ts">
import Textarea from 'primevue/textarea';
import SelectSiswa from '@/components/SelectSiswa.vue';
import { getCurrentInstance, ref } from 'vue';
import { useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const toast = useToast()

const selectedSiswa = ref([])
const message = ref('')

const onSelected = (val) => {
    selectedSiswa.value = val
}


const sendMessageService = async (data) => {
    try {
        return await axios.post('/whatsapp/send-message', {
            phone: data.selects.map(siswa => siswa.notelp),
            message: data.message,
        })
    } catch (e) {
        throw e
    }
}

const { mutateAsync: sendMessageMutate, isPending: sendMessagePending } = useMutation({
    mutationKey: ['sendMessage'],
    mutationFn: sendMessageService,
})


const handleSendMessage = () => {
    sendMessageMutate({
        selects: selectedSiswa.value,
        message: message.value,
    }, {
        onSuccess() {
            toast.add({
                severity: 'success',
                summary: 'Berhasil',
                detail: 'Pesan berhasil dikirim',
                life: 1000
            })
            message.value = ''
        },
        onError() {
            toast.add({
                severity: 'error',
                summary: 'Gagal',
                detail: 'Pesan gagal dikirim',
                life: 1000
            })
        }
    })
}

</script>

<template>
    <form @submit.prevent="handleSendMessage">
        <div class="field">
            <select-siswa @input="onSelected" multiple :disabled="sendMessagePending" />
        </div>
        <div class="field">
            <Textarea placeholder="Masukan pesan" v-model="message" class="w-full" :disabled="sendMessagePending" rows="8" />
        </div>
        <div class="field">
            <Button label="Kirim" type="submit" :loading="sendMessagePending" :disabled="sendMessagePending"
                icon="pi pi-send" />
        </div>
    </form>
</template>