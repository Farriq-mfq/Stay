<script setup>

import { useConfirm } from "primevue/useconfirm";
import { inject } from "vue";

const confirm = useConfirm();

const $auth = inject('auth')

const handleLogout = () => {
    return $auth.logout({
        redirect: { name: 'login' },
    })
}
const handleConfirmLogout = () => {
    confirm.require({
        message: 'Yakin ingin keluar dari aplikasi ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Keluar',
            severity: "danger"
        },
        accept: () => {
            handleLogout()
        },
    });
}
</script>
<template>
    <Button text @click="handleConfirmLogout"
        class="flex border-none justify-content-between text-red-500 align-items-center px-3 no-underline w-full border-300 border-bottom-1 py-4">
        <!-- icon -->
        <div class="flex align-items-center">
            <i class="pi pi-sign-out" />
            <span class="ml-3 font-semibold">
                Keluar
            </span>
        </div>
        <i class="pi pi-chevron-right" />
    </Button>
</template>