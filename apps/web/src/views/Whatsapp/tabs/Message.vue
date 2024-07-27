<script setup lang="ts">
import Textarea from 'primevue/textarea';
import SelectSiswa from '../../../components/SelectSiswa.vue';
const test = (val) => {
    console.log(val)
}
</script>

<template>
    <form>
        <div class="field">
            <select-siswa @change="test" />
        </div>
        <div class="field">
            <Textarea placeholder="Masukan pesan" class="w-full" rows="8" />
        </div>
        <div class="field">
            <Button label="Kirim" icon="pi pi-send" />
        </div>
    </form>
</template>