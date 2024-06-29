<script setup>
import NavbarMenu from '../components/NavbarMenu.vue'
import Header from '../components/Header.vue'
</script>
<template>
    <div class="min-w-full relative min-h-full">
        <Header />
        <div class="py-6 px-1">
            <router-view></router-view>
        </div>
        <navbar-menu></navbar-menu>
    </div>
</template>