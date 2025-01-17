<script setup>
import changelogmarkdownraw from '@/assets/changelog.md?raw'
import { onMounted, ref } from 'vue';

const latestVersion = ref("")
function extractLatestVersion() {

    const versionRegex = /## \[(.*?)\]/;
    const match = versionRegex.exec(changelogmarkdownraw);
    if (match && match[1]) {
        latestVersion.value = match[1]; // Simpan versi terbaru
    } else {
        latestVersion.value = "Unknown";
    }
}



onMounted(() => {
    extractLatestVersion()
})
</script>

<template>
        <div class="fixed bg-primary z-[9999] right-0 bottom-0 h-10 p-2 shadow-lg border-1">
            V{{ latestVersion }}
        </div>
</template>