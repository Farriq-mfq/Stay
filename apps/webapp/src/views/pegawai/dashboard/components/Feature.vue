<script setup></script>
<template>
    <div class="grid relative">
        <!-- <Unavailable /> -->
        <router-link :to="{ name: 'feature-presence' }"
            class="col-3 p-0 cursor-pointer transition-all transition-duration-300 no-underline">
            <div class="p-2 flex flex-column align-items-center">
                <div
                    class="border-1 border-primary-100 bg-primary-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                    <i class="pi pi-map-marker text-base text-primary-600"></i>
                </div>
                <span class="text-900 font-medium text-xs text-center mt-2">
                    Kehadiran
                </span>
            </div>
        </router-link>
        <!-- <div class="col-3 p-0">
            <div class="cursor-pointer transition-all transition-duration-300">
                <div class="p-2 flex flex-column align-items-center">
                    <div
                        class="border-1 border-primary-100 bg-primary-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                        <i class="pi pi-calendar text-base text-primary-600"></i>
                    </div>
                    <span class="text-900 font-medium text-xs text-center mt-2">Izin</span>
                </div>
            </div>
        </div>
        <div class="col-3 p-0">
            <div class="cursor-pointer transition-all transition-duration-300">
                <div class="p-2 flex flex-column align-items-center">
                    <div
                        class="border-1 border-primary-100 bg-primary-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                        <i class="pi pi-book text-base text-primary-600"></i>
                    </div>
                    <span class="text-900 font-medium text-xs text-center mt-2">Jurnal Kegiatan</span>
                </div>
            </div>
        </div> -->
    </div>
</template>