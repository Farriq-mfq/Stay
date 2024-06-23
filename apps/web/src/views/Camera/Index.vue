<script setup>
import { getCurrentInstance, ref } from 'vue'
import { useToast } from 'primevue/usetoast';
const { proxy } = getCurrentInstance()
const router = proxy.$router
const toast = useToast()
const sessionId = ref(null)
const handleChangeSelectSession = (val) => {
    sessionId.value = val.id
}
const openCam = () => {
    if (sessionId.value) {
        router.push({
            name: 'camera-scan',
            params: {
                id: sessionId.value
            }
        })
    } else {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Silahkan pilih session terlebih dahulu',
            life: 3000,
        })
    }
}
</script>
<template>
    <Card>
        <template #title>
            Pilih Session dan Buka Camera
        </template>
        <template #content>
            <select-session @input="handleChangeSelectSession" />
            <Button label="Buka Camera" @click="openCam" icon="pi pi-camera" class="mt-2" />
        </template>
    </Card>
</template>