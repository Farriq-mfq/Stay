<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

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
            { label: 'Presences', icon: 'pi pi-fw pi-database', to: '/presences' },
            { label: 'Reports', icon: 'pi pi-fw pi-book', to: '/reports' },
        ]
    },
    {
        label: 'Master',
        items: [
            { label: 'Users', icon: 'pi pi-fw pi-users', to: '/users' },
            { label: 'Siswa', icon: 'pi pi-fw pi-id-card', to: '/siswa' },
        ]
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
