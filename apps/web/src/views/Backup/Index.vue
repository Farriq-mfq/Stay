<script setup>
import { useToast } from 'primevue/usetoast';
import { format } from 'date-fns';
import { getCurrentInstance, ref, watch } from 'vue';

const { proxy } = getCurrentInstance()
const axios = proxy.axios
const toast = useToast()
const loadingBackup = ref(false)
const handleBackupService = async () => {
    loadingBackup.value = true;
    try {
        const response = await axios.get(`/backup/database`, {
            responseType: 'blob',
        })
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${format(new Date(), 'yyyy-MM-dd')}-backup.sql`);
        document.body.appendChild(link);
        link.click();
        toast.add({ severity: 'success', summary: 'Success', detail: 'Backup berhasil dilakukan', life: 3000 });
    } catch {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal melakukan backup', life: 3000 });
    } finally {
        loadingBackup.value = false
    }
}

</script>
<template>
    <Card>
        <template #title>
            Backup database
            <hr>
        </template>
        <template #content>
            <Button icon="pi pi-database" :loading="loadingBackup" @click="handleBackupService" iconPos="right"
                label="Backup Database" />
        </template>
    </Card>
</template>