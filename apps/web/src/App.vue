<script setup>
import LatestVersion from '@/components/LatestVersion.vue';
</script>

<template>
    <div>
        <router-view />
        <ConfirmDialog></ConfirmDialog>
        <Toast />
        <LatestVersion />
    </div>
</template>

<style scoped></style>
