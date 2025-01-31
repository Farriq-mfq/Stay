<script setup>
import { ref, inject } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
const auth = inject('auth')
const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Fitur',
        items: [
            { label: 'Gateway', icon: 'pi pi-fw pi-link', to: '/gateways' },
            { label: 'Sesi Presensi', icon: 'pi pi-fw pi-file-edit', to: '/sessions' },
            // { label: 'Scan QRcode', icon: 'pi pi-fw pi-qrcode', to: '/camera' },
            {
                label: 'Data Presensi',
                icon: 'pi pi-fw pi-server',
                items: [
                    { label: 'Siswa', icon: 'pi pi-fw pi-bars', to: '/presences' },
                    { label: 'Statistik', icon: 'pi pi-fw pi-chart-line', to: '/stats' },
                ]
            },
            { label: 'Payment', icon: 'pi pi-fw pi-wallet', to: '/payment' },
            { label: 'Profil', icon: 'pi pi-fw pi-user', to: '/profile' },
            { label: 'Backup', icon: 'pi pi-fw pi-database', to: '/backup' },
            // {
            //     label: 'Notifications', icon: 'pi pi-fw pi-bell',
            //     items: [
            //         {
            //             label: "Whatsapp",
            //             icon: 'pi pi-fw pi-whatsapp',
            //             to: '/whatsapp'
            //         }
            //     ]
            // },
        ]
    },
    {
        label: 'Master',
        items: [
            auth.check('admin') ? { label: 'Users', icon: 'pi pi-fw pi-users', to: '/users' } : null,
            { label: 'Siswa', icon: 'pi pi-fw pi-id-card', to: '/siswa' },
            { label: 'Pegawai', icon: 'pi pi-fw pi-users', to: '/pegawai' },
        ].filter(item => item != null)
    },

]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
