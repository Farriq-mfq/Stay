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
const { data: imageUrl, status, qrImageError: error, refetch, isLoading, isFetching } = useQuery({
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
    <div class="card relative hover-reload" v-if="!isLoading">
        <img v-if="imageUrl" :src="imageUrl" class="w-full h-auto" />
        <div class="absolute top-0 left-0 right-0 bottom-0 flex justify-content-center align-items-center">
            <Button @click.prevent="refetch" icon="pi pi-refresh" size="large" class="btn-reload h-4rem w-4rem hidden" severity="contrast"  />
        </div>
        <div v-if="qrImageError">Error: {{ qrImageError.message }}</div>
    </div>
</template>
<style scoped>
.hover-reload:hover {
    background: #000;
}

.hover-reload:hover .btn-reload {
    display: flex !important;
}
</style>