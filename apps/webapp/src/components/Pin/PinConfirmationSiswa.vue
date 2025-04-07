<script setup>
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { usePinStore } from '@/store/pin';
import { useMutation } from '@tanstack/vue-query';
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const pinStore = usePinStore()
const visible = computed(() => pinStore.isVisible)
const pin = ref('')
const handleClose = () => {
    pinStore.reset()
    pin.value = ''
}

const confirmPinService = async () => {
    const response = await axios.post('siswa/modules/account/confirm-pin', {
        pin: pin.value
    })
    return response.data
}

const { mutate: confirmPin, isPending: isConfirming } = useMutation({
    mutationKey: ['confirmPinService'],
    mutationFn: confirmPinService,
})

watch(pin, async (value) => {
    if (value.length === 6) {
        await confirmPin({
            pin: value
        }, {
            onSuccess: () => {
                pinStore.confirm()
            },
            onError: () => {
                pinStore.reject()
            }
        })
    }
})

</script>
<template>
    <Dialog v-model:visible="visible" modal header="Konfirmasi Pin" class="mx-3" @after-hide="handleClose"
        @hide="handleClose" :style="{ width: '25rem' }">
        <template #closeicon>
            <i class="pi pi-times" @click="handleClose"></i>
        </template>
        <div class="flex flex-column align-items-center justify-content-center gap-5 mt-3">
            <InputOtp autofocus v-model="pin" :integerOnly="true" :length="6" :disabled="isConfirming" :mask="true" />
        </div>
    </Dialog>
</template>