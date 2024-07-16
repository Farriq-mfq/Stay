<script setup>
import Scan from '@/components/Scan.vue'
</script>
<template>
    <nav class="fixed flex w-full md:max-w-30rem mx-auto h-5rem left-0 right-0 bottom-0" style="z-index: 999;">
        <ul class="flex flex-row w-full px-2 bg-white border-round h-full">
            <li class="block h-full flex-1 list-none">
                <router-link :to="{ name: 'home' }" class="no-underline text-center text-color-secondary">
                    <div class="h-full flex flex-column align-items-center justify-content-center">
                        <div class="relative">
                            <i class="pi pi-home text-xl" />
                        </div>
                        <p class="text-xs mt-1 font-semibold">Beranda</p>
                    </div>
                </router-link>
            </li>
            <li class="block h-full flex-1 list-none">
                <router-link :to="{ name: 'scan' }" class="no-underline text-center text-color-secondary">
                    <div class="h-full flex flex-column align-items-center justify-content-center">
                        <div class="relative">
                            <i class="pi pi-hourglass text-xl" />
                        </div>
                        <p class="text-xs mt-1 font-semibold">Sesi</p>
                    </div>
                </router-link>
            </li>
            <li class="block h-full flex-1 list-none">
            </li>

            <li class="block h-full flex-1 list-none">
                <router-link :to="{ name: 'presences' }" class="no-underline text-center text-color-secondary">
                    <div class="h-full flex flex-column align-items-center justify-content-center">
                        <div class="relative">
                            <i class="pi pi-database text-xl" />
                        </div>
                        <p class="text-xs mt-1 font-semibold">
                            Presensi
                        </p>
                    </div>
                </router-link>
            </li>
            <li class="block h-full flex-1 list-none">
                <router-link :to="{ name: 'settings' }" class="no-underline text-center text-color-secondary">
                    <div class="h-full flex flex-column align-items-center justify-content-center">
                        <div class="relative">
                            <i class="pi pi-cog text-xl" />
                        </div>
                        <p class="text-xs mt-1 font-semibold">
                            Setting
                        </p>
                    </div>
                </router-link>
            </li>
        </ul>
        <Scan />
    </nav>
</template>
