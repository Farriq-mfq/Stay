<script setup>
import NavbarMenu from '../components/NavbarMenu.vue'
import Header from '../components/Header.vue'
</script>
<template>
    <div class="min-w-full relative min-h-full">
        <Header />
        <div class="py-7">
            <router-view v-slot="{ Component, route }">
                <transition name="fade">
                    <component :is="Component" :key="route.path" />
                </transition>
            </router-view>
        </div>
        <navbar-menu></navbar-menu>
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>