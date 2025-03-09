<script setup>
import { inject, ref } from "vue";
import Banner from "./Banner.vue";
import { rupiahFormat } from "@/utils/money";
import CreateAccount from "./CreateAccount.vue";
const showSaldo = ref(true);
const toggleShowSaldo = () => {
  showSaldo.value = !showSaldo.value;
};

const auth = inject("auth");
</script>

<template>
  <div class="relative px-3 pt-3" style="z-index: 99">
    <div class="mt-4">
      <div
        class="bg-opacity h-full w-full border-round-2xl relative shadow-1 mt-8"
      >
        <div class="text-white pt-4 px-4 pb-2 flex-1">
          <h4
            class="text-md mx-0 mb-3 mt-1 white-space-nowrap overflow-hidden text-overflow-ellipsis"
          >
            Hai, {{ auth.user().name }}
          </h4>
          <h2 class="text-3xl mx-0 mb-0 mt-1" v-if="auth.user().account">
            {{
              showSaldo ? rupiahFormat(auth.user().account.balance) : "***"
            }}
          </h2>
          <CreateAccount v-if="!auth.user().account" />

          <p class="text-xs mt-3 mx-0 font-semibold" v-if="auth.user().account">
            Saldo saat ini
          </p>
          <div
            class="mt-4 flex gap-4 align-items-center justify-content-evenly"
          >
            <div>
              <Button
                icon="pi pi-plus"
                size="small"
                class="shadow-none"
                rounded
                variant="outlined"
                @click="$router.push({ name: 'payment-topup' })"
              />
              <p class="text-xs mt-2 mx-0 text-center">Top up</p>
            </div>
            <div>
              <Button
                icon="pi pi-arrow-up"
                size="small"
                class="shadow-none"
                rounded
                variant="outlined"
                @click="$router.push({ name: 'payment-transfer' })"
              />
              <p class="text-xs mt-2 mx-0 text-center">Transfer</p>
            </div>
            <div>
              <Button
                icon="pi pi-arrow-down"
                size="small"
                class="shadow-none"
                rounded
                variant="outlined"
                @click="$router.push({ name: 'payment-withdraw' })"
              />
              <p class="text-xs mt-2 mx-0 text-center">Tarik</p>
            </div>
            <div>
              <Button
                icon="pi pi-history"
                size="small"
                class="shadow-none"
                rounded
                variant="outlined"
                @click="$router.push({ name: 'payment' })"
              />
              <p class="text-xs mt-2 mx-0 text-center">Riwayat</p>
            </div>
          </div>
          <Button
            @click="toggleShowSaldo"
            v-if="auth.user().account"
            icon="pi pi-eye"
            rounded
            class="shadow-none bg-transparent border-none absolute top-0 right-0 bottom-0 mr-2 mt-8"
            variant="text"
          />
        </div>
      </div>
    </div>
    <Banner />
  </div>
</template>

<style scoped>
.bg-opacity {
  background: rgba(255, 255, 255, 0.2) !important;
}
</style>
