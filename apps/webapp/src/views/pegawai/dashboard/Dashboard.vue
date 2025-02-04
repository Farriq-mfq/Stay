<script setup>
import Banner from "./components/Banner.vue";
import Header from "./components/Header.vue";
</script>

<template>
  <div class="flex flex-column gap-4">
    <div class="relative">
      <Header />
      <Banner />
      <div
        class="mx-3 absolute p-card shadow-2 h-6rem border-round-xl"
        style="bottom: -4rem; right: 0; left: 0"
      >
        <div class="h-1">sdf</div>
      </div>
    </div>
    <div class="mt-7 px-4">Another contetn</div>
  </div>
</template>
