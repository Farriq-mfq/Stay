<script setup>
import { ref } from 'vue';
import SelectSiswa from '@/components/SelectSiswa.vue';
import SelectPegawai from '@/components/SelectPegawai.vue';

const selectedUserType = ref('PEGAWAI');

const handleSelectSiswa = (value) => {};

const handleSelectPegawai = (value) => {};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h3>Kirim Notifikasi</h3>
                <hr />
                <div class="flex justify-content-center">
                    <div class="flex flex-wrap gap-3">
                        <div class="flex align-items-center">
                            <RadioButton inputId="pegawai" v-model="selectedUserType" name="selectedUserType" value="COMMON" />
                            <label for="pegawai" class="ml-2">Umum</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton inputId="siswa" v-model="selectedUserType" name="selectedUserType" value="SISWA" />
                            <label for="siswa" class="ml-2">Siswa</label>
                        </div>
                        <div class="flex align-items-center">
                            <RadioButton inputId="pegawai" v-model="selectedUserType" name="selectedUserType" value="PEGAWAI" />
                            <label for="pegawai" class="ml-2">Pegawai</label>
                        </div>
                    </div>
                </div>
                <div class="mt-3" v-if="selectedUserType">
                    <form @submit.prevent="handleSubmit" method="post">
                        <div class="field" v-if="selectedUserType === 'SISWA'">
                            <select-siswa @input="handleSelectSiswa" multiple />
                        </div>
                        <div class="field" v-if="selectedUserType === 'PEGAWAI'">
                            <select-pegawai @input="handleSelectPegawai" multiple />
                        </div>
                        <div class="field">
                            <InputText placeholder="Judul" class="w-full" />
                        </div>
                        <div class="field">
                            <Textarea placeholder="Masukan pesan" class="w-full" rows="8" />
                        </div>
                        <Button type="submit" label="Kirim Notifikasi" />
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
