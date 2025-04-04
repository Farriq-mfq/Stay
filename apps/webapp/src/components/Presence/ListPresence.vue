<script setup>
import { format } from "date-fns";
import { id } from "date-fns/locale";
const { items } = defineProps({
  items: {
    type: Array,
    default: [],
    required: true,
  },
});

const getMethodColor = (method) => {
  switch (method.toLowerCase()) {
    case 'qr':
      return 'var(--green-500)';
    case 'manual':
      return 'var(--blue-500)';
    default:
      return 'var(--primary-color)';
  }
};
</script>

<template>
  <div class="presence-list">
    <router-link v-for="(item, index) in items" :key="index" :to="{ name: 'presences-detail', params: { id: item.id } }"
      class="presence-item mb-2">
      <div class="presence-content">
        <div class="presence-header">
          <h4 class="presence-title">{{ item.session.name }}</h4>
          <span class="presence-method" :style="{ backgroundColor: getMethodColor(item.method) }">
            {{ item.method }}
          </span>
        </div>
        <div class="presence-details">
          <div class="detail-item">
            <i class="pi pi-map-marker"></i>
            <span class="detail-value">{{ item.gateway ? item.gateway.location : "-" }}</span>
          </div>
          <div class="detail-item">
            <i class="pi pi-calendar"></i>
            <span class="detail-value">
              {{ format(item.createdAt, "dd MMMM yyyy", { locale: id }) }}
            </span>
          </div>
        </div>
      </div>
      <div class="presence-actions">
        <i class="pi pi-chevron-right"></i>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.presence-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  /* padding: 0.5rem; */
}

.presence-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-card);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-color);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--surface-border);
}

.presence-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--primary-color);
}

.presence-content {
  flex: 1;
  min-width: 0;
}

.presence-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.presence-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.presence-method {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.presence-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.detail-item i {
  font-size: 0.9rem;
  color: var(--text-color-secondary);
}

.detail-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.presence-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--surface-hover);
  color: var(--text-color-secondary);
  transition: all 0.2s ease;
}

.presence-item:hover .presence-actions {
  background: var(--primary-50);
  color: var(--primary-color);
  transform: translateX(2px);
}

.presence-actions i {
  font-size: 0.9rem;
}
</style>
