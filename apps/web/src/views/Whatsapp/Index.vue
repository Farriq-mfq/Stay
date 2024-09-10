<script setup>
import { useQuery } from '@tanstack/vue-query';
import { getCurrentInstance, ref } from 'vue';
import Start from './Start.vue';


const items = ref([
    { label: 'Koneksi', icon: 'pi pi-link', route: '/whatsapp/connection' },
    { label: 'Kirim Pesan', icon: 'pi pi-send', route: '/whatsapp/send-message' },
]);


const { proxy } = getCurrentInstance();

const axios = proxy.axios


const getAllSessions = async () => {
    return await axios.get('/whatsapp/list-sessions')
}

const {
    data: sessions,
    isLoading,
    refetch
} = useQuery({
    queryKey: ['allSessions'],
    queryFn: getAllSessions,
})

const dataSession = ref(null)
const handleShowDialoStartSession = (session) => {
    dataSession.value = session
}


const handlingRefresh = (id) => {

    alert('opk')
}

const handleCloseStart = () => {
    dataSession.value = null
}

</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Buat session baru" icon="pi pi-plus" class="mr-2"
                                @click.prevent="addSessionDialog = true" />
                        </div>
                    </template>
                </Toolbar>
                <DataTable :value="sessions ? sessions.data.data : []" tableStyle="min-width: 50rem">
                    <template #empty>
                        <div class="flex justify-content-center p-4 gap-3 align-items-center">
                            <i class="pi pi-folder-open"></i>
                            <span>
                                Data whatsapp session masih kosong
                            </span>
                        </div>
                    </template>
                    <Column field="name" header="Name"></Column>
                    <Column field="status" header="Status">\
                        <template #body="{ data }">
                            <Chip>{{ data.status }}</Chip>
                        </template>
                    </Column>
                    <Column header="Actions">
                        <template #body="{ data }">
                            <div class="flex gap-2 mt-1">
                                <Button icon="pi pi-link" size="small" label="Start"
                                    @click.prevent="handleShowDialoStartSession(data)"
                                    v-if="data.status != 'CONNECTED'" />
                                <Button icon="pi pi-sign-out" size="small" label="Logout" severity="danger"
                                    v-if="data.status === 'CONNECTED'" />
                                <Button @click.prevent="handlingRefresh(data)" icon="pi pi-refresh" size="small"
                                    label="Refresh" severity="info" v-if="data.status === 'CONNECTED'" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
        <Start :session="dataSession" :refetch="refetch" @closeStart="handleCloseStart" />
    </div>
</template>
