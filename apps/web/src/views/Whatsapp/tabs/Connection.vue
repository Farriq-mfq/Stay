<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance } from 'vue'
import QRCode from '../Qrcode.vue'
const { proxy } = getCurrentInstance()
const axios = proxy.axios
const confirm = useConfirm()
const toast = useToast()

const checkConnectionWhatsappService = async () => {
    return await axios.get('/whatsapp/client')
}


const {
    data,
    refetch,
    status,
    isLoading,
    isFetching
} = useQuery({
    queryKey: ['checkConnectionWhatsapp'],
    queryFn: checkConnectionWhatsappService,
})

const logoutConnectionService = async () => {
    return await axios.post('/whatsapp/logout')
}

const {
    mutateAsync: logoutMutateConnection,
    isPending: logoutPendingConnection,
} = useMutation({
    mutationKey: ['logoutConnection'],
    mutationFn: logoutConnectionService,
})

const handleConnectionLogout = () => {
    confirm.require({
        message: 'Apakah anda yakin ingin logout akun whatsapp anda ?',
        acceptLabel: 'Logout',
        acceptClass: 'p-button-danger',
        rejectLabel: 'Batal',
        accept: () => {
            logoutMutateConnection({}, {
                onSuccess: async () => {
                    await refetch()
                    toast.add({ severity: 'success', summary: 'Berhasil logout', life: 2000 });
                },
                onError: async (error) => {
                    toast.add({ severity: 'error', summary: 'Terjadi kesalahan saat melakukan logout', life: 2000 });
                }
            })
        }
    });
}

</script>
<template>
    <div>
        <div class="flex lg:flex-row flex-column gap-4">
            <div>
                <QRCode v-if="status != 'pending' && status != 'success'" />
                <div v-if="status === 'error'"
                    class="bg-yellow-400 text-white p-2 border-round shadow mt-2 text-center">
                    Silahkan scan qrcode menggunakan akun whatsapp anda
                </div>
                <div v-if="status === 'error'" class="bg-red-400 text-white p-2 border-round shadow mt-2 text-center">
                    Terjadi kesalahan
                </div>
                <ProgressSpinner v-if="status === 'pending'" style="width: 50px; height: 50px" strokeWidth="8"
                    fill="var(--surface-ground)" animationDuration=".5s" aria-label="Loading" />
            </div>
            <div class="border-solid flex-1 surface-border border-1 p-4 border-round" v-if="status === 'success'">
                <h2 class="text-lg font-bold border-bottom-1 surface-border pb-2">Connection Info</h2>
                <ul class="list-none p-0 gap-2 flex flex-column">
                    <li>
                        <b>Host Account Number</b> : {{ data.data.data._hostAccountNumber }}
                    </li>
                    <li>
                        <b>WA VERSION</b> : {{ data.data.data._sessionInfo.WA_VERSION }}
                    </li>
                    <li>
                        <b>OS</b> : {{ data.data.data._sessionInfo.OS }}
                    </li>
                    <li>
                        <b>RAM INFO</b> : {{ data.data.data._sessionInfo.RAM_INFO }}
                    </li>
                    <li>
                        <b>BROWSER VERSION</b> : {{ data.data.data._sessionInfo.BROWSER_VERSION }}
                    </li>
                    <li>
                        <b>PAGE UA</b> : {{ data.data.data._sessionInfo.PAGE_UA }}
                    </li>
                    <li>
                        <b>ACC TYPE</b> : {{ data.data.data._sessionInfo.ACC_TYPE }}
                    </li>
                </ul>
            </div>
        </div>
        <Divider />
        <div class="flex gap-2">
            <Button @click.prevent="refetch" :label="status === 'pending' ? 'Koneksi Sedang di check' : 'Check Koneksi'"
                :loading="status === 'pending' || isFetching" icon="pi pi-refresh" />
            <Button @click.prevent="handleConnectionLogout" :label="'Logout'"
                :loading="isFetching || logoutPendingConnection" v-if="status === 'success'" icon="pi pi-sign-out"
                severity="danger" />
        </div>
    </div>
</template>