<script setup>
import { ref } from 'vue';
const items = ref([
    { label: 'History Payment', route: '/payment/all' },
]);
</script>
<template>
    <Card>
        <template #title>
            Payment
        </template>
        <template #content>
            <TabMenu :model="items">
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