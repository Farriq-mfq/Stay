<script setup>
import SplashLogo from '@/assets/logo.png'
</script>

<template>
    <Transition name="fade">
        <div
            class="surface-ground w-full h-screen flex flex-column justify-content-center align-items-center">
            <div class="flex flex-column align-items-center z-5">
                <img :src="SplashLogo" alt="Splash Logo" class="h-6rem mb-4">
                <ProgressSpinner strokeWidth="2" class="w-3rem" animationDuration="2s" />
            </div>
        </div>
    </Transition>
</template>
