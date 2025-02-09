<script setup>
import { useDrawer } from "@/store/drawer";
import { watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter()

const drawer = useDrawer();

watch(
  () => drawer.getData.success,
  (val) => {
    if (val) {
      drawer.setTitle("Transfer Berhasil");
      setTimeout(() => {
        drawer.closeDrawer();
        router.push({ name: "payment-detail", params: { transaction_id: 1 } });
      }, 1000);
    }
  }
);
</script>

<template>
  <div class="flex flex-column justify-content-center align-items-center">
    <Transition>
      <i
        v-if="drawer.getData.success"
        class="pi pi-check-circle text-primary"
        style="font-size: 7rem"
      />
      <ProgressSpinner v-else />
    </Transition>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
