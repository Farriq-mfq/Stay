<script setup>
import AppConfig from '@/layout/AppConfig.vue';
</script>
<template>
    <div
        class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <div
                style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(33, 150, 243, 0.4) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-center"
                    style="border-radius: 53px">
                    <span class="text-blue-500 font-bold text-3xl">403</span>
                    <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">Forbidden</h1>
                    <div class="text-600 mb-5">Anda tidak diijinkan untuk mengakses halaman ini.</div>
                    <router-link to="/"
                        class="w-full flex justify-content-center align-items-center mb-5 py-5 text-center">
                        <span class="text-900 lg:text-xl font-medium mb-0">Kembali</span>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>