<script setup>
import Clock from '@/components/Clock.vue';
import { getDetailLocation, isWithinRange } from '@/utils/location.js';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Button from 'primevue/button';
import { computed, onMounted, ref, watch } from 'vue';

const currentDate = new Date();
const accurate = ref(false)
const locationLoading = ref(false)
const locationMessage = ref('Mendeteksi lokasi...')
const refreshLocation = ref(false)
const currentLocation = ref(null)

const formattedCurrentDate = computed(() => format(currentDate, 'EEEE, dd MMMM yyyy', { locale: id }))
const dummyLocation = ref({
    latitude: -6.871341427,
    longitude: 109.6614411
})

const getCurrentLocation = () => {
    locationLoading.value = true
    accurate.value = false
    if (!navigator.geolocation) {
        locationMessage.value = 'Fitur Lokasi tidak didukung'
        return
    }

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords
            refreshLocation.value = false

            try {
                const detailLocation = await getDetailLocation(latitude, longitude)
                currentLocation.value = {
                    latitude: detailLocation.lat,
                    longitude: detailLocation.lon,
                    ...detailLocation
                }
            } catch (e) {
                currentLocation.value = {
                    latitude,
                    longitude
                }
            }
            locationLoading.value = false
            locationMessage.value = null
        },
        async (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    locationMessage.value = 'Akses lokasi ditolak'
                    refreshLocation.value = true;
                    break
                case error.POSITION_UNAVAILABLE:
                    locationMessage.value = 'Informasi lokasi tidak tersedia'
                    refreshLocation.value = true;
                    break
                case error.TIMEOUT:
                    locationMessage.value = 'Permintaan lokasi timeout'
                    refreshLocation.value = true;
                    break
                default:
                    locationMessage.value = 'Terjadi kesalahan saat mengambil lokasi'
                    refreshLocation.value = true;
                    break
            }

            locationLoading.value = false
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0
        }
    )
}

onMounted(() => {
    getCurrentLocation()
})

watch(() => currentLocation.value, (location) => {
    if (location) {
        if (isWithinRange(dummyLocation.value, currentLocation.value, 500)) {
            accurate.value = true
        }
    }
}, { immediate: true })

const handlerRefreshLocation = () => {
    navigator.permissions.query({ name: 'geolocation' })
        .then((result) => {
            console.log("Status permission:", result.state);
            if (result.state === 'granted') {
                getCurrentLocation()
            } else if (result.state === 'denied') {
                locationMessage.value = "Mohon Aktifkan Lokasi"
            }
        });
}

</script>

<template>
    <div class="min-h-screen surface-ground">
        <AppHeaderBack title="Kehadiran" />
        <div class="container mx-auto px-4 py-6 mt-6">
            <div class="surface-ground border-1 surface-border border-round p-4 mb-4">
                <div class="text-center">
                    <h2 class="text-2xl font-semibold text-900">
                        {{ formattedCurrentDate }}
                    </h2>
                    <Clock />
                </div>
            </div>

            <div class="surface-ground border-round pb-4 pt-2 px-4 mb-4" :class="{
                'surface-border border-1': !accurate,
                'border-green-500 border-2': accurate
            }">
                <div class="flex flex-column">

                    <h3 class="text-lg font-medium text-900 text-center">
                        {{ locationLoading ? "Sedang Mencari Lokasi Anda..." : locationMessage ? locationMessage :
                            "Lokasi Anda" }}
                    </h3>
                    <div v-if="currentLocation && !locationLoading" class="text-sm text-600 mt-1">
                        <div class="flex flex-column gap-2">
                            <div class="flex align-items-center gap-2 mb-2">
                                <i class="pi pi-map-marker text-primary"></i>
                                <span class="font-medium">Koordinat: </span>
                                <span :class="{
                                    'text-green-500': accurate,
                                    'text-red-500': !accurate
                                }">{{ accurate ? "Sesuai" : "Belum Sesuai" }}</span>
                            </div>
                            <div class="border-1 surface-border border-round p-3">
                                <div class="flex flex-column gap-2">
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-globe text-primary"></i>
                                        <span>Latitude: {{ currentLocation.latitude }}</span>
                                    </div>
                                    <div class="flex align-items-center gap-2">
                                        <i class="pi pi-globe text-primary"></i>
                                        <span>Longitude: {{ currentLocation.longitude }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="currentLocation && currentLocation"
                                class="border-1 surface-border border-round p-3">
                                <div class="flex align-items-center gap-2">
                                    <i class="pi pi-info-circle text-primary"></i>
                                    <span>{{ currentLocation.display_name }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <i class="pi pi-map-marker text-primary text-center text-5xl bounce-animation mt-3"
                        v-if="locationLoading"></i>
                    <Button outlined class="mt-4" v-if="refreshLocation && !locationLoading"
                        @click="handlerRefreshLocation" label="Muat Ulang" />
                    <Button outlined v-if="currentLocation && !locationLoading && !accurate" class="mt-4"
                        @click="getCurrentLocation" label="Ulangi" />
                </div>
            </div>

            <div class="fixed bottom-0 left-0 right-0 p-4 surface-ground border-1 surface-border shadow-lg mx-auto w-full"
                style="max-width: 414px;" v-if="accurate">
                <Button class="w-full py-4 flex justify-content-center align-items-center gap-2">
                    <i class="pi pi-map-marker"></i> Check In
                </Button>
            </div>

            <div class="surface-ground border-1 surface-border border-round pb-4 px-4 pt-2 mb-8">
                <h3 class="text-lg font-medium text-900 mb-4">Riwayat Kehadiran Hari ini</h3>
                <div class="flex flex-column gap-3">
                    <div class="flex align-items-center justify-content-between p-3 surface-card border-round">
                        <div>
                            <p class="font-medium text-900">Check In</p>
                            <p class="text-sm text-600">08:00 - 12 Jan 2024</p>
                        </div>
                        <span class="text-green-500">Tepat Waktu</span>
                    </div>
                    <div class="flex align-items-center justify-content-between p-3 surface-card border-round">
                        <div>
                            <p class="font-medium text-900">Check Out</p>
                            <p class="text-sm text-600">17:00 - 12 Jan 2024</p>
                        </div>
                        <!-- <span class="text-green-500">Tepat Waktu</span> -->
                        <span class="text-red-500">Terlambat</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.bounce-animation {
    animation: bounce 1s infinite;
}
</style>
