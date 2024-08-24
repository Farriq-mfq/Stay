<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const handleToNotification = () => {
    router.push({
        name: 'notifications',
    })
}
</script>
<template>
    <div class="fixed flex w-full md:w-30rem mx-auto h-5rem left-0 right-0 bottom-0" style="z-index: 999;">
        <header
            class="flex justify-content-between align-items-center px-3 fixed md:w-30rem w-full top-0 bg-primary h-4rem pt-2">
            <Button @click.prevent="handleToNotification" icon="pi pi-bell" rounded />
            <router-link>
                <Avatar label="P" class="mr-2" shape="circle" />
            </router-link>
        </header>
    </div>
</template>