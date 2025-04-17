<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { config } from '@/config';
import { useToast } from 'primevue/usetoast';
import { useMutation } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';

const toast = useToast();
const selectedLat = ref(null);
const selectedLng = ref(null);
const distance = ref(null);
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const { session, parentRefresh } = defineProps({
    session: {
        required: true
    },
    parentRefresh: {
        type: Function
    }
});

const emit = defineEmits(['clear']);

onMounted(() => {
    const map = L.map('map').setView([0, 0], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: config.app_name
    }).addTo(map);

    let marker;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                selectedLat.value = latitude.toFixed(6);
                selectedLng.value = longitude.toFixed(6);

                map.setView([latitude, longitude], 15);
                marker = L.marker([latitude, longitude]).addTo(map);
            },
            () => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Gagal mendapatkan lokasi. Izinkan akses lokasi di browser.',
                    life: 3000
                });
            }
        );
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Geolocation tidak didukung di browser ini.',
            life: 3000
        });
    }

    map.on('click', function (e) {
        const { lat, lng } = e.latlng;
        selectedLat.value = lat.toFixed(6);
        selectedLng.value = lng.toFixed(6);

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
    });

    if(session.presence_sessions_by_location){
        selectedLat.value = session.presence_sessions_by_location.latitude;
        selectedLng.value = session.presence_sessions_by_location.longitude;
        distance.value = session.presence_sessions_by_location.distance;
    }

});
const selectLocationService = async (data) => {
    return await axios.post(`sessions/${session.id}/select-location`, data);
};

const { mutate: selectLocation, isPending: selectLocationPending } = useMutation({
    mutationFn: selectLocationService,
    mutationKey: ['selectLocationService']
});

const handleSelectLocation = async () => {
    await selectLocation(
        {
            latitude: +selectedLat.value,
            longitude: +selectedLng.value,
            distance: distance.value
        },
        {
            onSuccess: () => {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Titik kordinat berhasil ditambahkan',
                    life: 3000
                });
                parentRefresh();
                emit('clear');
            },
            onError: (err) => {
                if (err.response.status === 400) {
                    if (err.response.data.message) {
                        toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: err.response.data.message,
                            life: 3000
                        });
                    }
                    errorsAddSession.value = err.response.data;
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Titik kordinat gagal ditambahkan',
                        life: 3000
                    });
                }
            }
        }
    );
};

const confirmLocation = async () => {
    if (!selectedLat.value || !selectedLng.value) {
        toast.add({
            severity: 'warn',
            summary: 'Peringatan',
            detail: 'Silakan pilih lokasi terlebih dahulu',
            life: 3000
        });
        return;
    }

    if (!distance.value) {
        toast.add({
            severity: 'warn',
            summary: 'Peringatan',
            detail: 'Silakan masukkan jarak',
            life: 3000
        });
        return;
    }

    await handleSelectLocation();
};

const clearLocationService = async () => {
    return await axios.delete(`/sessions/${session.id}/remove-location`);
};

const { mutate: clearLocation, isPending: clearLocationPending } = useMutation({
    mutationKey: ['clearLocationService'],
    mutationFn: clearLocationService
});

const confirm = useConfirm();

const handleClearLocation = () => {
    confirm.require({
        message: 'Apakah Anda yakin ingin menghapus lokasi ini?',
        header: 'Konfirmasi Hapus',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            await clearLocation(null, {
                onSuccess: () => {
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Lokasi berhasil dihapus',
                        life: 3000
                    });
                    parentRefresh();
                    emit('clear');
                },
                onError: () => {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Gagal menghapus lokasi',
                        life: 3000
                    });
                }
            });
        }
    });
};
</script>

<template>
    <div class="card">
        <div class="p-2 md:p-4">
            <h2 class="text-lg md:text-xl font-bold mb-3 md:mb-4">Pilih Lokasi</h2>

            <div class="grid">
                <div class="col-12 md:col-8 mb-3 md:mb-0">
                    <div id="map" class="border-round shadow-2"></div>
                </div>

                <div class="col-12 md:col-4">
                    <div class="p-2 md:p-4">
                        <div v-if="selectedLat && selectedLng" class="mb-3 md:mb-4">
                            <h3 class="text-base md:text-lg font-semibold mb-2">Lokasi Terpilih</h3>
                            <div class="p-2 md:p-3 border-round surface-card shadow-1">
                                <p class="mb-2 text-sm md:text-base"><i class="pi pi-map-marker mr-2"></i>Latitude: {{ selectedLat }}</p>
                                <p class="text-sm md:text-base"><i class="pi pi-map-marker mr-2"></i>Longitude: {{ selectedLng }}</p>
                            </div>
                        </div>

                        <div class="field">
                            <label for="distance" class="block text-900 font-medium mb-2 text-sm md:text-base">Jarak (meter)</label>
                            <InputNumber id="distance" v-model="distance" :min="0" :max="10000" :step="100" class="w-full" placeholder="Masukkan jarak" :inputClass="'text-sm md:text-base'" />
                        </div>

                        <div class="mt-3 md:mt-4 flex gap-2 flex-column">
                            <Button label="Konfirmasi Lokasi" :loading="selectLocationPending" icon="pi pi-check" class="w-full" :disabled="!selectedLat || !selectedLng" @click="confirmLocation" size="small" />
                            <Button v-if="session.presence_sessions_by_location" label="Hapus Lokasi" :loading="clearLocationPending" icon="pi pi-times" class="w-full" severity="danger" :disabled="!selectedLat || !selectedLng" @click="handleClearLocation" size="small" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
#map {
    width: 100%;
    height: 300px;
    border-radius: 6px;
}

@media (min-width: 768px) {
    #map {
        height: 500px;
    }
}

/* Improve touch targets on mobile */
.p-inputnumber-input {
    min-height: 2.5rem;
}

.p-button {
    min-height: 2.5rem;
}

/* Adjust spacing for mobile */
@media (max-width: 767px) {
    .p-4 {
        padding: 0.75rem !important;
    }

    .mb-4 {
        margin-bottom: 0.75rem !important;
    }

    .mt-4 {
        margin-top: 0.75rem !important;
    }
}
</style>
