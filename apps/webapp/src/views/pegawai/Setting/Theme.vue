<script setup>
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
</script>

<template>
    <div>
        <AppHeaderBack :title="'Tema'" />
        <div class="flex flex-column mt-8">
            <div class="p-3 flex gap-3 sticky surface-ground shadow-1 flex-column surface-ground mx-2 mt-2"
                style="top: 5rem;z-index: 1000;">
                <h3 class="m-0 text-lg font-semibold">Tema Aplikasi</h3>
                <ThemeSwitcher />
            </div>
        </div>
    </div>
</template>