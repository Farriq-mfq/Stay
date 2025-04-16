<script setup>
import { isArray } from 'lodash';
import { computed, inject } from 'vue';
import { features } from '@/utils/pegawai-feature'

const auth = inject('auth')

const user = computed(() => auth.user())

const featureFilter = features.filter(feature => isArray(feature.group) && feature.group.length > 0 && feature.group.includes(user.value.group))

</script>
<template>
    <div>
        <div class="grid relative" v-if="featureFilter.length">
            <!-- <Unavailable /> -->
            <router-link :to="{ name: feature.route }" v-for="feature in featureFilter" :key="feature.route"
                class="col-3 p-0 cursor-pointer transition-all transition-duration-300 no-underline">
                <div class="p-2 flex flex-column align-items-center">
                    <div
                        class="border-1 border-primary-100 bg-primary-50/50 p-2 border-circle w-3rem h-3rem flex align-items-center justify-content-center">
                        <i :class="`${feature.icon} text-base ${iconColor ?? 'text-primary-600'}`"></i>
                    </div>
                    <span class="text-900 font-medium text-xs text-center mt-2">
                        {{ feature.title }}
                    </span>
                </div>
            </router-link>
        </div>
        <div class="text-center text-sm mt-5 mb-2" v-else>
            <i class="pi pi-folder-open" />
            <span class="ml-2">Tidak Tersedia Fitur Untuk Anda</span>
        </div>
    </div>
</template>