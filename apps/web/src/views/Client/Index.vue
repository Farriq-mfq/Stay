<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { getCurrentInstance, onMounted, ref, watch, nextTick, onUnmounted, computed } from 'vue';
import { detectBrowser } from '@/helpers/functions';
import { config } from '@/config';
import { useToast } from 'primevue/usetoast';
import { se } from 'date-fns/locale';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const socket = proxy.socket;

const toast = useToast();

const getConnectedClientService = async () => {
    return await axios.get('/connected-client');
};

const { data: connectedClients, refetch } = useQuery({
    queryKey: ['connected-client'],
    queryFn: getConnectedClientService
});

const myClientId = computed(() => {
    return localStorage.getItem(`${config.token_key}/clientId`);
});

const selectedClient = ref({});
const showDialogChangeSession = ref(false);
const selectedSessionId = ref(null);
const handleChangeSelectedSession = (data) => {
    selectedSessionId.value = data.id;
};

const handleShowDialogChangeSession = (getClient) => {
    selectedClient.value = getClient;
    showDialogChangeSession.value = true;
};

const handleHideDialogChangeSession = () => {
    selectedClient.value = {};
    showDialogChangeSession.value = false;
};

const changeSessionService = async (data) => {
    console.log(data);
    return await axios.post(`/connected-client/set-session/${data.socketId}/${data.sessionId}`);
};

const { mutateAsync: changeSession, isPending: changeSessionPending } = useMutation({
    mutationKey: ['changeSession'],
    mutationFn: changeSessionService
});

const handleChangeSession = () => {
    changeSession(
        {
            socketId: selectedClient.value.socketId,
            sessionId: selectedSessionId.value
        },
        {
            onSuccess: () => {
                handleHideDialogChangeSession();
                selectedSessionId.value = null;
                refetch();
            },
            onError: (err) => {
                if (err.response && err.response.status === 400) {
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

const showDialogMessage = ref(false);
const handleShowMessage = (client) => {
    showDialogMessage.value = true;
    selectedClient.value = client;
}

const sendMessage = () => {};
</script>

<template>
    <div>
        <div class="card p-4" v-if="connectedClients">
            <Button label="Reload" icon="pi pi-refresh" class="p-button-sm mb-4" @click="refetch" />
            <div class="overflow-x-auto mx-5">
                <table ref="componentPrintRef" class="p-datatable p-datatable-gridlines p-component w-full">
                    <thead class="p-datatable-thead">
                        <tr class="p-row">
                            <th class="p-column-header">No</th>
                            <th class="p-column-header">IP</th>
                            <th class="p-column-header">Browser</th>
                            <th class="p-column-header">Client ID</th>
                            <th class="p-column-header">Socket ID</th>
                            <th class="p-column-header">Action</th>
                        </tr>
                    </thead>
                    <tbody class="p-datatable-tbody">
                        <tr class="p-row" :class="{ 'bg-primary': client.clientId === myClientId }" v-for="(client, index) in connectedClients.data.data" :key="client.id">
                            <td class="p-column-body">{{ index + 1 }}</td>
                            <td class="p-column-body">{{ client.ip }}</td>
                            <td class="p-column-body">{{ detectBrowser(client.userAgent) }}</td>
                            <td class="p-column-body">{{ client.clientId }}</td>
                            <td class="p-column-body">{{ client.socketId }}</td>
                            <td class="p-column-body flex flex-column gap-3">
                                <Button icon="pi pi-refresh" class="p-button-sm" severity="warning" label="Ubah sesi Presensi" @click="handleShowDialogChangeSession(client)" />
                                <Button icon="pi pi-send" class="p-button-sm" severity="info" label="Kirim Pengumuman" @click="handleShowMessage(client)" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <Dialog v-model:visible="showDialogChangeSession" @hide="handleHideDialogChangeSession" modal class="w-30rem" header="Ubah Sesi Presensi">
            <div class="field">
                <SelectSession @input="handleChangeSelectedSession" />
            </div>
            <div class="field">
                <Button label="Ubah" @click="handleChangeSession" :loading="changeSessionPending" />
            </div>
        </Dialog>
        <Dialog v-model:visible="showDialogMessage" modal class="w-30rem" header="Pesan">
            <div class="field">
                <InputText v-model="message" class="w-full" placeholder="Masukan pesan" />
            </div>
            <div class="field">
                <Button label="Kirim" @click="sendMessage" :loading="sendMessagePending" />
            </div>
        </Dialog>
    </div>
</template>
