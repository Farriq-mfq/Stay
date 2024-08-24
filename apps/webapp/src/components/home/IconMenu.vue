<script setup>
import { capitalize } from 'vue'
const props = defineProps({
    href: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})



</script>
<template>
    <router-link :to="props.href"
        class="flex w-full flex-column text-center no-underline justify-content-center align-items-center text-color-secondary">
        <div class="bg-white border-round-2xl flex justify-content-center align-items-center w-full h-4rem shadow-1">
            <i :class="`${props.icon} text-2xl text-primary`" />
        </div>
        <div class="text-xs mt-2 font-semibold overflow-hidden text-overflow-ellipsis white-space-nowrap"
            style="width: 100px;">
            {{ capitalize(props.text) }}
        </div>
    </router-link>
</template>