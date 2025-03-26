<script setup>
import { ref, inject, computed } from 'vue';

import AppMenuItem from './AppMenuItem.vue';
const auth = inject('auth');

const permissions = computed(() => auth.user().permissions);
const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label:
            permissions.value.includes('gateways:read') ||
            permissions.value.includes('seesions:read') ||
            permissions.value.includes('presences:read') ||
            permissions.value.includes('profile:read') ||
            permissions.value.includes('backup:database') ||
            permissions.value.includes('client:read')
                ? 'Fitur'
                : '',
        items: [
            permissions.value.includes('gateways:read') ? { label: 'Gateway', icon: 'pi pi-fw pi-link', to: '/gateways' } : null,
            permissions.value.includes('sessions:read') ? { label: 'Sesi Presensi', icon: 'pi pi-fw pi-file-edit', to: '/sessions' } : null,
            // { label: 'Scan QRcode', icon: 'pi pi-fw pi-qrcode', to: '/camera' },
            permissions.value.includes('presences:read')
                ? {
                      label: 'Data Presensi',
                      icon: 'pi pi-fw pi-server',
                      items: [
                          permissions.value.includes('presences:manual') ? { label: 'Input Presensi', icon: 'pi pi-fw pi-pencil', to: '/input/presences' } : null,
                          permissions.value.includes('presences:read') ? { label: 'Siswa', icon: 'pi pi-fw pi-database', to: '/presences' } : null,
                          permissions.value.includes('presences-pegawai:read') ? { label: 'Pegawai', icon: 'pi pi-fw pi-database', to: '/pegawai-presences' } : null,
                          { label: 'Statistik', icon: 'pi pi-fw pi-chart-line', to: '/stats' }
                      ].filter((menu) => menu != null)
                  }
                : null,
            // { label: 'Payment', icon: 'pi pi-fw pi-wallet', to: '/payment' },
            permissions.value.includes('profile:read') ? { label: 'Profil', icon: 'pi pi-fw pi-user', to: '/profile' } : null,
            permissions.value.includes('backup:database') ? { label: 'Backup', icon: 'pi pi-fw pi-database', to: '/backup' } : null,
            permissions.value.includes('client:read') ? { label: 'Client', icon: 'pi pi-fw pi-bolt', to: '/connected-client' } : null
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
        ].filter((menu) => menu != null)
    },
    {
        label: permissions.value.includes('users:read') || permissions.value.includes('siswa:read') || permissions.value.includes('pegawai:read') ? 'Master' : '',
        items: [
            permissions.value.includes('siswa:read') ? { label: 'Siswa', icon: 'pi pi-fw pi-id-card', to: '/siswa' } : null,
            permissions.value.includes('pegawai:read') ? { label: 'Pegawai', icon: 'pi pi-fw pi-users', to: '/pegawai' } : null,
            permissions.value.includes('users:read') ? { label: 'Users', icon: 'pi pi-fw pi-users', to: '/users' } : null,
            permissions.value.includes('roles:read') ? { label: 'Hak Akses', icon: 'pi pi-fw pi-key', to: '/roles' } : null
        ].filter((menu) => menu != null)
    }
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
