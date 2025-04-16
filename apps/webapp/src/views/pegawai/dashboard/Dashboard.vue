<script setup>
import Feature from "./components/Feature.vue";
import Header from "./components/Header.vue";
import LatestPresence from "./components/LatestPresence.vue";
import LatestTransaction from "./components/LatestTransaction.vue";

</script>

<template>
  <div class="flex flex-column gap-4" ref="el">
    <AppHeader :bg="false" />
    <Header />
    <div class="mx-3 p-card shadow-1  border-round-xl" style="margin: -10px; z-index: 99">
      <div class="p-3 overflow-hidden">
        <div class="flex align-items-center justify-content-between mb-3">
          <div>
            <h3 class="m-0 text-900">Shortcut <span class="text-primary font-medium">Menu</span></h3>
            <p class="text-600 text-sm mt-1 mb-0">Akses cepat ke fitur utama</p>
          </div>
        </div>
        <Feature />
      </div>
    </div>
    <div class="flex flex-column gap-4 p-2">
      <LatestTransaction />
      <LatestPresence />
    </div>
  </div>
</template>
