<script setup>
import { useMutation } from '@tanstack/vue-query';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';
import { ref, getCurrentInstance, inject, computed } from 'vue';

const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const toast = useToast();

const auth = inject('auth')

const account = computed(() => auth.user())

const onChangeProfilePictureService = async (file) => {
    const formData = new FormData()
    formData.append('profile_picture', file)
    const response = await axios.post('/siswa/modules/profile/update-profile-picture', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return response.data
}

const { mutate: onChangeProfilePicture, isPending: isChangingProfilePicture } = useMutation({
    mutationFn: onChangeProfilePictureService,
    mutationKey: ['onChangeProfilePicture'],
})

const handleFileUpload = async (event) => {
    const target = event.target;
    if (target.files && target.files[0]) {
        await onChangeProfilePicture(target.files[0], {
            onSuccess: (data) => {
                account.value.profile_picture = data.data.profile_picture
            },
            onError: (error) => {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: "Terjadi kesalahan, silahkan coba lagi",
                    life: 3000
                })
            }
        })
    }
};



</script>

<template>
    <div class="">
        <AppHeaderBack title="Informasi Akun" />
        <div class="mt-8 px-3 pt-3">
            <div class="flex flex-column gap-4">
                <!-- Profile Picture Section -->
                <div class="flex flex-column align-items-center gap-2">
                    <div class="relative">
                        <div class="w-8rem h-8rem border-circle border-1 surface-border overflow-hidden"
                            v-if="!isChangingProfilePicture">
                            <img :src="account.profile_picture" class="w-full h-full object-cover" />
                        </div>
                        <ProgressSpinner v-if="isChangingProfilePicture" />
                        <label for="profile-upload"
                            class="absolute bottom-0 right-0 bg-primary border-circle p-2 cursor-pointer">
                            <i class="pi pi-camera text-white"></i>
                        </label>
                        <input type="file" id="profile-upload" class="hidden" accept="image/*"
                            @change="handleFileUpload" />
                        </div>
                        <span class="text-xs text-500 mt-1 text-center text-primary">Foto Profile Maksimal 1.5 MB</span>
                </div>

                <div class="flex flex-column gap-2">
                    <h3 class="text-lg m-0 text-color px-1">Informasi Akun</h3>
                    <span class="text-xs text-500 text-muted mb-2 px-1">Update Profile Hanya Bisa Dilakukan Oleh Admin, Kecuali Foto Profile</span>
                    <div class="p-card shadow-1 flex flex-column justify-content-center p-3 border-round-xl">
                        <div class="flex flex-column gap-3">
                            <div class="flex flex-column gap-1">
                                <span class="text-sm text-500">Nama</span>
                                <span class="text-lg text-color">{{ account.name }}</span>
                            </div>
                            <div class="flex flex-column gap-1">
                                <span class="text-sm text-500">NISN</span>
                                <span class="text-lg text-color">{{ account.nisn }}</span>
                            </div>
                            <div class="flex flex-column gap-1">
                                <span class="text-sm text-500">NIS</span>
                                <span class="text-lg text-color">{{ account.nis }}</span>
                            </div>
                            <div class="flex flex-column gap-1">
                                <span class="text-sm text-500">Nomor Telepon</span>
                                <span class="text-lg text-color">{{ account.notelp }}</span>
                            </div>
                            <div class="flex flex-column gap-1">
                                <span class="text-sm text-500">Rombel</span>
                                <span class="text-lg text-color">{{ account.rombel }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hidden {
    display: none;
}
</style>