<template>
  <div class="showcase-container">
    <div class="section-header">
      <h2 class="section-title">热门商品推荐</h2>
      <p class="section-subtitle">探索精选好物，发现心仪之选</p>
    </div>
    
    <div v-if="s.length > 0" class="product-grid">
      <div v-for="item in s" :key="item.id" class="product-card" @click="goToDetails(item.id)">
        <div class="product-image">
          <img :src="item.img_url || '/img/placeholder.png'" 
               :alt="item.name"
               class="product-img"
               loading="lazy">
          <div class="image-overlay">
            <span class="quick-view">快速查看</span>
          </div>
          <div class="product-badge" v-if="item.price > 100">
            <span>热门</span>
          </div>
        </div>
        
        <div class="product-info">
          <h3 class="product-name">{{ item.name }}</h3>
          <p class="product-description" v-if="item.introduce">
            {{ item.introduce.length > 50 ? item.introduce.substring(0, 50) + '...' : item.introduce }}
          </p>
          <div class="product-meta">
            <div class="price-section">
              <span class="price">￥{{ item.price }}</span>
              <span class="category">{{ item.category || '通用' }}</span>
            </div>
            <div class="action-indicator">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
      </div>
      <p class="empty-text">暂无商品，敬请期待</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref,onMounted } from 'vue';
import UserTable from './UserTable.vue';
import axios from 'axios';
const router = useRouter();
const s = ref([]);
  
function getList(){
    axios.get("/api/list").then((data)=>{
        s.value = data.data.data
        console.log(data.data.message)
    })
}
onMounted(()=>{
    getList()   
})
const goToDetails = (id) => {
  router.push({
    name: 'details',
    query: { id }
  });
};
</script>

<style scoped>
.showcase-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  margin: 0;
  color: white;
  font-size: 32px;
  font-weight: 700;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  margin: 8px 0 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.product-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.product-card:hover .product-img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .image-overlay {
  opacity: 1;
}

.quick-view {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.product-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.product-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.product-name {
  margin: 0 0 8px 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  flex: 1;
  margin: 0 0 16px 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-section {
  display: flex;
  flex-direction: column;
}

.price {
  color: #FFD700;
  font-size: 20px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.category {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-top: 2px;
}

.action-indicator svg {
  width: 20px;
  height: 20px;
  stroke: rgba(255, 255, 255, 0.6);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px dashed rgba(255, 255, 255, 0.2);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
}

.empty-icon svg {
  width: 100%;
  height: 100%;
  stroke: rgba(255, 255, 255, 0.5);
}

.empty-text {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  text-align: center;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .product-image {
    height: 180px;
  }
}
</style>