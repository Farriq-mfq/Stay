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
            { label: 'Gateways', icon: 'pi pi-fw pi-link', to: '/gateways' },
            { label: 'Sessions', icon: 'pi pi-fw pi-file-edit', to: '/sessions' },
            { label: 'Scan QRcode', icon: 'pi pi-fw pi-qrcode', to: '/camera' },
            { label: 'Presences', icon: 'pi pi-fw pi-database', to: '/presences' },
            { label: 'Change Password', icon: 'pi pi-fw pi-key', to: '/change-password' },
            { label: 'Profile', icon: 'pi pi-fw pi-user', to: '/profile' },
            { label: 'Whatsapp', icon: 'pi pi-fw pi-whatsapp', to: '/whatsapp' },
        ]
    },
    {
        label: 'Master',
        items: [
            auth.check('admin') ? { label: 'Users', icon: 'pi pi-fw pi-users', to: '/users' } : null,
            { label: 'Siswa', icon: 'pi pi-fw pi-id-card', to: '/siswa' },
        ].filter(item => item)
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
