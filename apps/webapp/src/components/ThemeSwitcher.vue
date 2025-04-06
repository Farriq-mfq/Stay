<script setup>
import { useTheme } from "@/store/theme";
import { ref, computed } from "vue";

const themeStore = useTheme();
const searchQuery = ref("");

const filteredThemes = computed(() => {
  return themeStore.themes.filter(theme =>
    theme.label.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleTheme = (themeOption) => {
  themeStore.setTheme(themeOption.name);
};
</script>

<template>
  <div>
    <div class="current-theme mb-3 p-3 border-round surface-ground">
      <div class="text-sm font-medium mb-2">Tema Saat Ini:</div>
      <div class="flex align-items-center gap-2">
        <div class="w-2rem h-2rem border-circle"
          :style="{ backgroundColor: themeStore.themes.find(t => t.name === themeStore.currentTheme)?.color }">
        </div>
        <span class="font-bold">{{
          themeStore.themes.find(t => t.name === themeStore.currentTheme)?.label
        }}</span>
      </div>
    </div>

    <div class="search-box mb-3">
      <span class="p-input-icon-left w-full">
        <InputText v-model="searchQuery" placeholder="Cari tema..." class="w-full p-2 border-round" />
      </span>
    </div>

    <div class="theme-grid">
      <div v-for="themeOption in filteredThemes" :key="themeOption.name"
        class="theme-option p-2 border-round cursor-pointer hover:surface-hover"
        :class="{ 'surface-hover': themeStore.currentTheme === themeOption.name }" @click="handleTheme(themeOption)">
        <div class="flex align-items-center gap-2">
          <div class="w-2rem h-2rem border-circle" :style="{ backgroundColor: themeOption.color }"></div>
          <span>{{ themeOption.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-grid {
  display: grid;
  gap: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
}

.theme-option {
  transition: background-color 0.2s;
}

.current-theme {
  background: var(--surface-ground);
  border: 1px solid var(--surface-border);
}
</style>