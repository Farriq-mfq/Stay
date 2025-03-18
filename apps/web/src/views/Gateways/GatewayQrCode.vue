<script setup>
import { useMutation } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, onMounted } from 'vue';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import { watch, ref } from 'vue';

const toast = useToast();
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const confirm = useConfirm();
const qrValue = ref(null);
const qrcode = useQRCode(qrValue);

const { data } = defineProps({
    data: {
        type: Object,
        required: true
    }
});

const generateQrService = async () => {
    return await axios.post(`/gateways/${data.id}/qrcode`);
};

const {
    mutateAsync: generateQr,
    data: qr,
    isPending
} = useMutation({
    mutationKey: ['generateQr'],
    mutationFn: generateQrService,
    onSuccess: (data) => {
        toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Generate QR Code berhasil',
            life: 3000
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Generate QR Code gagal',
            life: 3000
        });
    }
});

onMounted(async () => {
    await generateQr();
});

watch(qr, () => {
    if (qr.value) {
        qrValue.value = qr.value.data.data;
    }
});
</script>

<template>
    <div>
        <img :src="qrcode" class="h-full w-full" v-if="!isPending" />
    </div>
</template>
