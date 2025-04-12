<template>
    <div
      ref="container"
      class="overflow-y-auto"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <!-- Floating Indicator -->
      <div
        v-if="isRefreshing || pullDistance > 0"
        class="fixed left-0 right-0 flex justify-center items-center z-50 transition-opacity duration-300 bg-red-500"
        :style="{ top:top,height: '0px', opacity: pullDistance > 0 || isRefreshing ? 1 : 0 }"
      >
        <ProgressSpinner
          v-if="isRefreshing"
          style="width: 50px; height: 50px"
          strokeWidth="4"
          animationDuration=".8s"
        />
      </div>
  
      <!-- Main Content -->
      <div :style="{ transform: `translateY(${pullDistance}px)` }">
        <slot />
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  import ProgressSpinner from 'primevue/progressspinner'
  
  export default {
    emits: ['refresh'],
    components: {
      ProgressSpinner,
    },
    props: {
    top: {
      type: String,
      default: '6rem',
    },
  },
    setup(props, { emit ,}) {
      const container = ref(null)
      const startY = ref(0)
      const pullDistance = ref(0)
      const isRefreshing = ref(false)
  
      const onTouchStart = (e) => {
        if (container.value?.scrollTop === 0 && !isRefreshing.value) {
          startY.value = e.touches[0].clientY
        }
      }
  
      const onTouchMove = (e) => {
        const currentY = e.touches[0].clientY
        const distance = currentY - startY.value
  
        if (distance > 0 && container.value?.scrollTop === 0 && !isRefreshing.value) {
          pullDistance.value = Math.min(distance, 80)
        }
      }
  
      const onTouchEnd = () => {
        if (pullDistance.value > 40) {
          isRefreshing.value = true
          emit('refresh')
  
          setTimeout(() => {
            isRefreshing.value = false
            pullDistance.value = 0
          }, 1500)
        } else {
          pullDistance.value = 0
        }
      }
  
      return {
        container,
        startY,
        pullDistance,
        isRefreshing,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        top: props.top,
      }
    },
  }
  </script>
  