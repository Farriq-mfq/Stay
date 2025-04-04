<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
    router.back()
}

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen flex align-items-center justify-content-center bg-gray-50">
        <div class="text-center px-2">
            <i class="pi pi-exclamation-circle text-8xl text-primary mb-4"></i>
            <h1 class="text-6xl font-bold text-primary mb-2">503</h1>
            <h2 class="text-2xl font-semibold mb-4">Fitur Tidak Tersedia</h2>
            <p class="text-color-secondary mb-4">Maaf, fitur ini sedang tidak tersedia. Silakan coba lagi nanti.</p>
            <Button label="Kembali ke Beranda" icon="pi pi-home" @click="goBack" class="p-button-rounded" />
        </div>
    </div>
</template>

<style scoped>
/* Add any additional custom styles here if needed */
</style>