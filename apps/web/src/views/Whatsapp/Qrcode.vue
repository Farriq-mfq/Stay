<script setup>
import { useQuery } from '@tanstack/vue-query';
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();
const axios = proxy.axios

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
const { data: imageUrl, status, qrImageError: error } = useQuery({
    queryKey: ['qrImage'],
    queryFn: fetchQRImage,
    staleTime: 60000,
    refetchInterval: 60000,
    onError: (error) => {
        console.error('Error fetching QR image:', error.message);
    }
});



</script>
<template>
    <div class="card">
        <img v-if="imageUrl" :src="imageUrl" class="w-full h-auto" />
        <div v-if="qrImageError">Error: {{ qrImageError.message }}</div>
    </div>
</template>