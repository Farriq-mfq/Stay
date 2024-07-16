<script setup>
import { useMutation, useQuery } from '@tanstack/vue-query';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
const axios = proxy.axios
const confirm = useConfirm()
const toast = useToast()


const fetchConnectionState = async () => {
    try {
        return await axios.get('/whatsapp/get-connection-state')

    } catch {
        throw new Error('Failed to get connection state')
    }
}
const { data: connectionState, isLoading: connectionStateLoading, refetch: refetchConnectionState, error: connectionStateError } = useQuery({
    queryKey: ['connectionState'],
    queryFn: fetchConnectionState,
})

const fetchLogoutConnection = async () => {
    try {
        return await axios.post('/whatsapp/logout')
    } catch {
        throw new Error('Failed to logout')
    }
}

const {
    mutateAsync: waLogout,
    isPending: logoutLoading,
} = useMutation({
    mutationKey: ['wa-logout'],
    mutationFn: fetchLogoutConnection,
})

const handleLogout = () => {

    confirm.require({
        message: 'Apakah anda yakin ingin logout whatsapp?',
        header: 'Logout',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: "Logout",
        rejectLabel: "Batal",
        acceptIcon: 'pi pi-sign-out',
        rejectIcon: 'pi pi-times',
        rejectClass: "pi-button-sm p-button-secondary p-button-text",
        dismissable: false,
        sticky: false,
        key: 'logout-confirm',
        acceptClass: 'p-button-sm p-button-danger',
        accept: () => {
            waLogout({}, {
                onSuccess: () => {
                    toast.add({
                        severity: 'success',
                        summary: 'Logout',
                        detail: 'Logout Berhasil',
                        life: 3000,
                    })
                },
                onError: (error) => {
                    toast.add({
                        severity: 'error',
                        summary: 'Logout',
                        detail: 'Logout Gagal',
                        life: 3000,
                    })
                },
                onSettled: () => {
                    refetchConnectionState();
                },
            });
        },
    })
}
</script>
<template>
    <p>sdlfmsdlkfn</p>
</template>