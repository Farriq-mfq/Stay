<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from 'vue';
import SelectSiswa from '@/components/SelectSiswa.vue';
import SelectPegawai from '@/components/SelectPegawai.vue';
import { useMutation } from '@tanstack/vue-query';
import { useToast } from 'primevue/usetoast';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const toast = useToast();
const socket = proxy.socket;
const results = ref([]);
const rowRefs = ref({});

const errorSendNotification = ref(null);
const selectedUserType = ref('');

const sendNotificaitonData = ref({
    title: null,
    body: null,
    type: {
        name: 'Umum',
        value: 'COMMON'
    }
});

const refs = ref(null);

const handleSelectSiswa = (value) => {
    refs.value = value ? (value.length > 0 ? value.map((item) => item.id) : null) : null;
};

const handleSelectPegawai = (value) => {
    refs.value = value ? (value.length > 0 ? value.map((item) => item.id) : null) : null;
};

const sendNotificaitonService = async (data) => {
    return await axios.post('/notification/send', data);
};

const { mutate: sendNotificaiton, isPending: sendNotificaitonLoading } = useMutation({
    mutationFn: sendNotificaitonService,
    mutationKey: ['sendNotificaiton']
});

const handleSubmit = async () => {
    results.value = [];
    await sendNotificaiton(
        {
            title: sendNotificaitonData.value.title,
            body: sendNotificaitonData.value.body,
            type: sendNotificaitonData.value.type.value,
            user_type: selectedUserType.value,
            refs_id: refs.value
        },
        {
            onSuccess: () => {
                toast.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Data updated successfully',
                    life: 3000
                });

                sendNotificaitonData.value = {
                    title: null,
                    body: null,
                    type: {
                        name: 'Umum',
                        value: 'COMMON'
                    }
                };
                refs.value = null;
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
                    } else {
                        errorSendNotification.value = err.response.data;
                    }
                } else {
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: err.response.data.message,
                        life: 3000
                    });
                }
            }
        }
    );
};
const setRowRef = (el, id) => {
    if (el) {
        rowRefs.value[id] = el;
    }
};
onMounted(() => {
    socket.on('sending_notification_status', (data) => {
        results.value.push(data);
        nextTick(() => {
            if (rowRefs.value[data.payload.ref_id]) {
                rowRefs.value[data.payload.ref_id].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>Kirim Notifikasi</h3>
                <hr />
                <div class="flex justify-content-center">
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton inputId="pegawai" v-model="selectedUserType" name="selectedUserType" value="COMMON" />
                            <label for="pegawai" class="ml-2">Umum</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton inputId="siswa" v-model="selectedUserType" name="selectedUserType" value="SISWA" />
                            <label for="siswa" class="ml-2">Siswa</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton inputId="pegawai" v-model="selectedUserType" name="selectedUserType" value="PEGAWAI" />
                            <label for="pegawai" class="ml-2">Pegawai</label>
                        </div>
                    </div>
                </div>
                <div class="mt-3" v-if="selectedUserType">
                    <form @submit.prevent="handleSubmit" method="post">
                        <div class="field" v-if="selectedUserType === 'SISWA'">
                            <select-siswa @input="handleSelectSiswa" multiple v-if="!sendNotificaitonLoading" />
                            <p class="text-red-500" v-if="errorSendNotification && errorSendNotification.refs_id">
                                {{ errorSendNotification.refs_id[0] }}
                            </p>
                        </div>
                        <div class="field" v-if="selectedUserType === 'PEGAWAI'">
                            <select-pegawai @input="handleSelectPegawai" multiple v-if="!sendNotificaitonLoading" />
                            <p class="text-red-500" v-if="errorSendNotification && errorSendNotification.refs_id">
                                {{ errorSendNotification.refs_id[0] }}
                            </p>
                        </div>
                        <div class="field">
                            <InputText placeholder="Judul" v-model="sendNotificaitonData.title" class="w-full" :disabled="sendNotificaitonLoading" :invalid="errorSendNotification && errorSendNotification.title" />
                            <p class="text-red-500" v-if="errorSendNotification && errorSendNotification.title">
                                {{ errorSendNotification.title[0] }}
                            </p>
                        </div>
                        <div class="field">
                            <Textarea v-model="sendNotificaitonData.body" placeholder="Masukan pesan" class="w-full" :disabled="sendNotificaitonLoading" rows="8" :invalid="errorSendNotification && errorSendNotification.body" />
                            <p class="text-red-500" v-if="errorSendNotification && errorSendNotification.body">
                                {{ errorSendNotification.body[0] }}
                            </p>
                        </div>
                        <div class="field">
                            <Dropdown
                                v-model="sendNotificaitonData.type"
                                :options="[
                                    {
                                        name: 'Umum',
                                        value: 'COMMON'
                                    },
                                    {
                                        name: 'Transaksi',
                                        value: 'TRANSACTION'
                                    },
                                    {
                                        name: 'Presensi',
                                        value: 'PRESENCE'
                                    },
                                    {
                                        name: 'Jadwal Pelajaran',
                                        value: 'SCHEDULE'
                                    },
                                    {
                                        name: 'Perijinan',
                                        value: 'LEAVE'
                                    }
                                ]"
                                optionLabel="name"
                                placeholder="Pilih Tipe"
                                class="w-full"
                                default-value="COMMON"
                                :disabled="sendNotificaitonLoading"
                            />
                        </div>
                        <Button type="submit" label="Kirim Notifikasi" :loading="sendNotificaitonLoading" :disabled="sendNotificaitonLoading" />
                    </form>
                </div>
                <div class="mt-6" v-if="selectedUserType && results.length">
                    <h3>Realtime Notification</h3>
                    <div class="mb-4">
                        <p class="text-green-500">Terkirim {{ results.filter((result) => result.status === 'success').length }} notifikasi</p>
                        <p class="text-red-500">Gagal {{ results.filter((result) => result.status === 'failed').length }} notifikasi</p>
                    </div>
                    <TransitionGroup tag="div" class="flex flex-column gap-3 overflow-auto" style="max-height: 30rem">
                        <div class="border-1 surface-border p-4 border-round" v-for="result in results" :key="result.payload.ref_id" :ref="(el) => setRowRef(el, result.payload.ref_id)">
                            <div class="flex justify-content-between">
                                <div class="flex align-items-center gap-2">
                                    <div class="flex gap-2 align-items-center">
                                        <span class="font-medium"> {{ result.payload.name }} </span> <Tag>{{ result.payload.user_type }}</Tag>
                                    </div>
                                </div>
                                <div class="flex align-items-center">
                                    <i class="pi pi-check text-primary text-xl" v-if="result.status === 'success'"></i>
                                    <i class="pi pi-times text-red-500 text-xl" v-if="result.status === 'failed'"></i>
                                </div>
                            </div>
                        </div>
                    </TransitionGroup>
                </div>
            </div>
        </div>
    </div>
</template>
