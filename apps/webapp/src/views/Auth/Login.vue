<template>
    <div class="flex justify-content-center align-items-center" style="min-height: 80vh;">
        <div class="col-12 mx-auto">
            <div class="px-3 py-5">
                <div class="text-center mb-5">
                    <div class="text-primary text-4xl border-bottom-1 pb-3 font-bold mb-3 uppercase">
                        Stay <i class="pi pi-verified" />
                    </div>
                    <div class="text-900 text-3xl font-medium mb-3">
                        Selamat datang
                    </div>
                    <span class="text-600 font-medium">
                        Silahkan login
                    </span>
                </div>
                <div class="field">
                    <label for="username" class="block text-900 text-xl font-medium mb-2">
                        Username
                    </label>
                    <InputText class="w-full" style="padding: 1rem" />
                </div>
                <div class="field">
                    <label for="username" class="block text-900 text-xl font-medium mb-2">
                        Password
                    </label>
                    <Password class="w-full" :feedback="false" :toggleMask="true" inputClass="w-full"
                        :inputStyle="{ padding: '1rem' }" />
                </div>
                <div class="field">
                    <Button label="Masuk" class="w-full" style="padding: 1rem" />
                </div>
            </div>
        </div>
    </div>
</template>