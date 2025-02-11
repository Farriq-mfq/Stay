<script setup>
import { useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance, ref } from 'vue';
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const toast = useToast();

const dataManual = ref({
    sessionId: null,
    siswaId: null
});
const handleChangeSelectSession = (data) => {
    dataManual.value.sessionId = data.id;
};

const handleChangeSelectSiswa = (data) => {
    dataManual.value.siswaId = data.id;
};

const presenceManualService = async (data) => {
    return await axios.post('/events/manual', {
        sessionId: data.sessionId,
        siswaId: data.siswaId
    });
};
const { mutate: presenceManual, isPending: presenceManualLoading } = useMutation({
    mutationKey: ['manual-presence'],
    mutationFn: presenceManualService
});
const errorMessage = ref({});

const handlePresnceManualSubmit = async () => {
    await presenceManual(dataManual.value, {
        onSuccess: () => {
            toast.add({ severity: 'success', summary: 'Berhasil presensi', life: 2000 });
            dataManual.value = {
                sessionId: null,
                siswaId: null
            };
            errorMessage.value = {};
        },
        onError: (e) => {
            if (e.response.status === 400) {
                if (e.response.data.message) {
                    toast.add({ severity: 'error', summary: 'Gagal presensi', detail: e.response.data.message, life: 2000 });
                } else {
                    errorMessage.value = e.response.data;
                }
            } else {
                toast.add({ severity: 'error', summary: 'Gagal presensi', life: 2000 });
            }
        }
    });
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>Input Presensi</h3>
                <p>Inputkan ketika siswa tidak membawa kartu</p>
                <hr />
                <div class="field">
                    <SelectSession @input="handleChangeSelectSession" :inputValue="dataManual.sessionId" />
                    <p class="text-red-500" v-if="errorMessage && errorMessage.sessionId">
                        {{ errorMessage.sessionId[0] }}
                    </p>
                </div>
                <div class="field">
                    <SelectSiswa @input="handleChangeSelectSiswa" :inputValue="dataManual.siswaId" />
                    <p class="text-red-500" v-if="errorMessage && errorMessage.siswaId">
                        {{ errorMessage.siswaId[0] }}
                    </p>
                </div>
                <div class="field">
                    <Button :loading="presenceManualLoading" @click.prevent="handlePresnceManualSubmit" type="submit" label="Presensi" icon="pi pi-check-circle" />
                </div>
            </div>
        </div>
    </div>
</template>
