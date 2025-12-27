<template>
  <div class="feature-card" @click="onClick">
    <div class="feature-icon">
      <slot name="icon"></slot>
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
    <div class="feature-hint">
      <span>{{ hint }}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: '点击探索'
  },
  onClick: {
    type: Function,
    default: () => {}
  }
})
</script>

<style scoped>
.feature-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.feature-icon svg {
  width: 28px;
  height: 28px;
  stroke: #4ECDC4;
  stroke-width: 2;
}

.feature-title {
  margin: 0 0 12px 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.feature-description {
  flex: 1;
  margin: 0 0 20px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.6;
}

.feature-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FFD700;
  font-size: 14px;
  font-weight: 500;
}

.feature-hint svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

@media (max-width: 768px) {
  .feature-card {
    padding: 22px;
  }
  
  .feature-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
  
  .feature-title {
    font-size: 18px;
  }
}
</style>