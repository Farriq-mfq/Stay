<script setup>
import { ref } from 'vue'
const items = ref([])
</script>
<template>
    <div class="flex p-2 gap-5 flex-wrap">
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-external-link" text="Artikel" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-book" text="E-book" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-clock" text="Histori" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-pencil" text="Izin" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-user-edit" text="Presensi" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-calendar" text="Jadwal" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-verified" text="Nilai" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-hourglass" text="Tugas" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-paperclip" text="Wali Kelas" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-home" text="Kantin" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-pencil" text="Evaluasi" />
        </div>
        <div class="w-4rem">
            <icon-menu href="/" icon="pi pi-list" text="Perpustakaan" />
        </div>
    </div>
</template>
