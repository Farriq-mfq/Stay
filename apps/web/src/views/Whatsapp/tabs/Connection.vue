<script setup>
import { useQuery } from '@tanstack/vue-query';
import { getCurrentInstance } from 'vue'
import QRCode from '../Qrcode.vue'
const { proxy } = getCurrentInstance()
const axios = proxy.axios

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
                <h2 class="text-lg font-bold border-bottom-1 surface-border pb-2">Whatsapp info</h2>
                <ul class="list-none p-0 gap-2 flex flex-column">
                    <li>
                        <b>Nomor</b> : {{ data.data.data._hostAccountNumber }}
                    </li>
                    <li>
                        <b>Info</b> :
                        <code>
                            {{ data.data.data._sessionInfo }}
                       </code>
                    </li>
                </ul>
            </div>
        </div>
        <hr />
        <div class="flex gap-2">
            <Button @click.prevent="refetch" :label="status === 'pending' ? 'Koneksi Sedang di check' : 'Check Koneksi'"
                :loading="status === 'pending' || isFetching" icon="pi pi-refresh" />
            <Button @click.prevent="refetch" :label="'Logout'"
                :loading="status === 'pending' || isFetching" icon="pi pi-sign-out" severity="danger" />
        </div>
    </div>
</template>