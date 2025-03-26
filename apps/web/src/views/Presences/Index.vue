<script setup>
import { ref, getCurrentInstance } from 'vue';
const $can = getCurrentInstance().appContext.config.globalProperties.$can;
const items = ref([
    $can('presences:read') ? { label: 'Semua data', route: '/presences/all' } : null,
    $can('presences:read-daily') ? { label: 'Rekap Harian', route: '/presences/daily' } : null,
    $can('presences:read-monthly') ? { label: 'Rekap Bulanan', route: '/presences/monthly' } : null
    // { label: 'Rekap data', icon: 'pi pi-book', route: '/presences/recap' },
    // {
    //   label: 'Rekap',
    //   icon: 'pi pi-folder',
    //   command: () => {
    //     this.$router.push('/unstyled');
    //   }
    // },
]);
</script>
<template>
    <Card>
        <template #title> Data Presensi </template>
        <template #content>
            <TabMenu :model="items.filter((item) => item != null)">
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                        <a v-ripple :href="href" v-bind="props.action" @click="navigate">
                            <span v-bind="props.label">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
                        <span v-bind="props.icon" />
                        <span v-bind="props.label">{{ item.label }}</span>
                    </a>
                </template>
            </TabMenu>
            <!-- content -->
            <div class="mt-4">
                <router-view></router-view>
            </div>
        </template>
    </Card>
</template>
