<script setup></script>

<template>
  <div class="bg-primary h-28rem absolute top-0 left-0 right-0 w-full overflow-hidden" style="z-index: -1"> 
    <div class="bubble bg-primary-50 opacity-20 h-25rem w-25rem absolute border-circle backdrop-blur-sm" style="right: -15rem; top: 10rem"></div>
    <div class="bubble-delay bg-primary-50 opacity-20 h-30rem w-30rem absolute border-circle backdrop-blur-sm" style="left: -20rem; top: -10rem;"></div>
  </div>
</template>

<style scoped>
.bubble {
  animation: float 8s ease-in-out infinite;
}

.bubble-delay {
  animation: float 8s ease-in-out infinite;
  animation-delay: 2s;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-50px) scale(1.1);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}
</style>
