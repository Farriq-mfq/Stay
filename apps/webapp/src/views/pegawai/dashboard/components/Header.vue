<script setup>
import { inject, ref, getCurrentInstance } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Banner from "./Banner.vue";
import { rupiahFormat } from "@/utils/money";
import CreateAccount from "./CreateAccount.vue";
import { useToast } from "primevue/usetoast";
import { useClipboard } from "@vueuse/core";
import { useBallance } from "@/store/ballance";
const { proxy } = getCurrentInstance();
const axios = proxy.axios;
const showSaldo = ref(true);
const ballanceStore = useBallance();

const getAccount = async () => {
  const response = await axios.get("/pegawai/modules/account");
  return response.data;
};

const {
  data: account,
  isLoading: accountLoading,
  status,
} = useQuery({
  queryKey: ["account"],
  queryFn: getAccount,
});

const auth = inject("auth");

const toast = useToast();
const { copy } = useClipboard();

const copyAccountNumber = async (accountNumber) => {
  await copy(accountNumber);
  toast.add({
    severity: "success",
    summary: "Berhasil",
    detail: "Nomor rekening berhasil disalin",
    life: 2000,
  });
};
</script>

<template>
  <div class="relative px-2" style="z-index: 99">
    <div class="mx-2">
      <div class="glass-container border-round-2xl relative shadow-2 mt-8">
        <div class="glass-container-padding" v-if="status === 'success'">
          <!-- User greeting -->
          <div class="flex align-items-center justify-content-between mb-3">
            <span class="text-base font-medium text-white name-text">
              Hai, {{ account.data.name }}
            </span>
            <Button
              @click="ballanceStore.toogleShowBallance()"
              v-if="!accountLoading && account.data"
              :icon="
                ballanceStore.getShowBallance ? 'pi pi-eye-slash' : 'pi pi-eye'
              "
              rounded
              class="p-button-text p-button-rounded text-white custom-icon-button"
              size="small"
            />
          </div>

          <!-- Balance card -->
          <div class="mb-3">
            <span class="text-white text-xs font-medium block mb-1"
              >Saldo Tersedia</span
            >
            <h2
              class="text-2xl font-bold text-white m-0"
              v-if="!accountLoading && account.data"
            >
              {{
                ballanceStore.getShowBallance
                  ? rupiahFormat(account.data.balance)
                  : "••••••"
              }}
            </h2>

            <!-- Account number section update -->
            <div
              class="account-number-container mt-3"
              v-if="!accountLoading && account.data"
            >
              <div
                class="account-number-card glass-card-light border-round-xl p-3"
              >
                <div class="flex align-items-center justify-content-between">
                  <div>
                    <span class="text-white text-xs block mb-1 opacity-70"
                      >Nomor Rekening</span
                    >
                    <div class="flex align-items-center gap-2">
                      <span
                        class="account-number text-white font-medium text-base"
                      >
                        {{
                          account.data.accountNumber.match(/.{1,4}/g).join(" ")
                        }}
                      </span>
                      <div
                        class="copy-button flex align-items-center cursor-pointer"
                        @click="copyAccountNumber(account.data.accountNumber)"
                        v-tooltip.bottom="'Salin nomor rekening'"
                      >
                        <i
                          class="pi pi-copy text-white text-xs opacity-70 hover:opacity-100"
                        ></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="action-buttons-container mt-3">
            <div class="action-button">
              <Button
                icon="pi pi-plus"
                rounded
                class="glass-button custom-icon-button-sm mb-1"
                @click="$router.push({ name: 'transactions-topup' })"
              />
              <p class="text-xs font-medium text-white m-0">Top up</p>
            </div>
            <div class="action-button">
              <Button
                icon="pi pi-arrow-up"
                rounded
                class="glass-button custom-icon-button-sm mb-1"
                @click="$router.push({ name: 'transactions-transfer' })"
              />
              <p class="text-xs font-medium text-white m-0">Transfer</p>
            </div>
            <div class="action-button">
              <Button
                icon="pi pi-arrow-down"
                rounded
                class="glass-button custom-icon-button-sm mb-1"
                @click="$router.push({ name: 'transactions-withdraw' })"
              />
              <p class="text-xs font-medium text-white m-0">Tarik</p>
            </div>
            <div class="action-button">
              <Button
                icon="pi pi-history"
                rounded
                class="glass-button custom-icon-button-sm mb-1"
                @click="$router.push({ name: 'transactions' })"
              />
              <p class="text-xs font-medium text-white m-0">Riwayat</p>
            </div>
          </div>
        </div>

        <div class="p-3">
          <div class="h-12rem" v-if="status === 'pending'">
            <div class="flex justify-content-center align-items-center h-full">
              <ProgressSpinner class="w-6rem h-6rem" />
            </div>
          </div>
          <div class="h-12rem" v-if="status === 'error'">
            <CreateAccount />
          </div>
        </div>
      </div>
    </div>
    <Banner />
  </div>
</template>

<style scoped>
.glass-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-container-padding {
  padding: 1rem 1.4rem 0 1.4rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-card-light {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-button {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: white !important;
  transition: all 0.2s ease;
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-1px);
}

.custom-icon-button {
  width: 2rem !important;
  height: 2rem !important;
}

.custom-icon-button-sm {
  width: 2.5rem !important;
  height: 2.5rem !important;
}

.custom-icon-button-sm .p-button-icon {
  font-size: 1rem;
}

@media screen and (max-width: 576px) {
  .action-buttons-container {
    gap: 0.25rem;
    padding: 0;
  }

  .action-button {
    min-width: 60px;
  }

  .custom-icon-button-sm {
    width: 2rem !important;
    height: 2rem !important;
  }

  .custom-icon-button-sm .p-button-icon {
    font-size: 0.875rem;
  }

  .action-button p {
    font-size: 0.65rem;
    margin-top: 0.25rem;
  }
}

@media screen and (max-width: 360px) {
  .action-buttons-container {
    gap: 0.15rem;
  }

  .action-button {
    min-width: 50px;
  }

  .custom-icon-button-sm {
    width: 1.75rem !important;
    height: 1.75rem !important;
  }

  .custom-icon-button-sm .p-button-icon {
    font-size: 0.75rem;
  }

  .action-button p {
    font-size: 0.6rem;
  }
}

.action-buttons-container {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

/* Optimize spacing for mobile */
@media screen and (max-width: 640px) {
  .grid {
    gap: 0.5rem;
  }

  .p-3 {
    padding: 0.75rem !important;
  }

  .mb-3 {
    margin-bottom: 0.75rem !important;
  }
}

.account-number-container {
  position: relative;
}

.account-number-card {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.account-number-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}

.account-number {
  letter-spacing: 0.5px;
  transition: all 0.2s ease;
}

.copy-button {
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.1);
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.copy-button:active {
  transform: translateY(0);
}

.bank-logo {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

/* Responsive adjustments */
@media screen and (max-width: 576px) {
  .account-number {
    font-size: 0.875rem;
  }

  .copy-button {
    width: 1.25rem;
    height: 1.25rem;
  }

  .bank-logo {
    padding: 0.375rem 0.5rem;
  }

  .bank-logo span {
    font-size: 0.625rem;
  }
}

/* Add shimmer effect on hover */
.account-number-card:hover::before {
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.name-text {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media screen and (max-width: 576px) {
  .name-text {
    max-width: 150px;
  }
}
</style>
