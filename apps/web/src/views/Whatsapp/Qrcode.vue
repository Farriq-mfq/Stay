<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';

const { proxy } = getCurrentInstance();
const axios = proxy.axios
const confirm = useConfirm()
const toast = useToast()

async function fetchQRImage() {
    try {
        const response = await axios.get('/whatsapp/qr-code', {
            responseType: 'blob'
        });
        if (response.status === 200) {
            return URL.createObjectURL(response.data);
        } else {
            throw new Error('Failed to fetch image');
        }
    } catch (error) {
        throw new Error('Failed to fetch image');
    }
}
const { data: imageUrl, qrImageError: error } = useQuery({
    queryKey: ['qrImage'],
    queryFn: fetchQRImage,
    staleTime: 60000,
    refetchInterval: 60000,
});
</script>
<template>
    <div class="card">
        <img v-if="imageUrl" :src="imageUrl" class="w-full h-auto" />
        <div v-if="error">Error: {{ error.message }}</div>
    </div>
</template>