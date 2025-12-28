<template>
  <div class="home-container">
    <!-- 背景装饰元素 -->
    <div class="background-particles">
      <div v-for="n in 15" :key="n" class="particle" :style="particleStyle(n)"></div>
    </div>

    <!-- 导航栏 -->
    <div class="top-nav">
      <div class="nav-logo">
        <span>WanliStore</span>
      </div>
      <div v-if="!hasToken" class="auth-buttons">
        <button class="nav-btn login-btn" @click="toLogin">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
          </svg>
          登录
        </button>
        <button class="nav-btn register-btn" @click="toRegister">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
          </svg>
          注册
        </button>
      </div>
      <div v-else class="user-section">
        <UserTable />
      </div>
    </div>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="hero-section">
        <h1 class="hero-title">WanliStore</h1>
        <p class="hero-subtitle">发现精选好物 · 享受购物乐趣</p>
        <div class="hero-stats">
          <StatsCard :stats-value="s.length" label="在售商品" />
          <StatsCard :stats-value="getTotalValue()" label="商品总价值" />
          <StatsCard :stats-value="getAvgPrice()" label="平均价格" />
        </div>
        
        <div class="project-info">
          <p class="author-info">制作人: xxxx</p>
          <p class="github-link">
            项目地址:
            <a href="https://github.com/hyhgfrgh/WanliStore-web" target="_blank" rel="noopener noreferrer">
              WanliStore-web
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </p>
        </div>
      </div>

      <div class="features-section">
        <h2 class="section-title">核心功能</h2>
        <div class="features-grid">
          <FeatureCard title="所有商品"  description="展示所有商品" hint="浏览商品" :onClick="() => router.push('/allGoods')">
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="我的仓库" 
            description="管理您的商品库存，轻松上架下架"
            hint="管理商品"
            :onClick="() => router.push('/userGoods')"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
            </template>
          </FeatureCard>
          
          <FeatureCard 
            title="个人中心" 
            description="管理您的个人信息和购物记录"
            hint="查看资料"
            :onClick="() => router.push('/user')"
          >
            <template #icon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </template>
          </FeatureCard>
        </div>
      </div>

      <!-- 商品展示区 -->
      <div class="showcase-section">
        <Show :s="s" />
      </div>

      <!-- 操作指引 -->
      <div class="guide-section">
        <h2 class="section-title">快速开始</h2>
        <div class="guide-steps">
          <div class="step">
            <div class="step-number">1</div>
            <h3>注册账号</h3>
            <p>创建您的专属账户</p>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-number">2</div>
            <h3>浏览商品</h3>
            <p>探索各种精选商品</p>
          </div>
          <div class="step-line"></div>
          <div class="step">
            <div class="step-number">3</div>
            <h3>发布商品</h3>
            <p>开始销售您的商品</p>
          </div>
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="page-footer">
      <div class="footer-content">
        <p class="copyright">© 2025 WanliStore. 保留所有权利.</p>
        <p class="tech-stack">基于 Vue.js + Spring Boot 构建</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import Show from '../compents/show.vue';
import StatsCard from '@/compents/StatsCard.vue';
import FeatureCard from '@/compents/FeatureCard.vue';
import UserTable from '@/compents/UserTable.vue';
import router from '@/router';
import { hasToken } from '@/store/auth';

const s = ref([]);

function getList(){
    axios.get("/api/list").then((data)=>{
        s.value = data.data.data || [];
    });
}

function getTotalValue() {
  if (!s.value.length) return '0';
  const total = s.value.reduce((sum, item) => sum + (item.price*item.stock || 0), 0);
  return '￥' + total.toFixed(2);
}

function getAvgPrice() {
  if (!s.value.length) return '0';
  const avg = s.value.reduce((sum, item) => sum + (item.price || 0), 0) / s.value.length;
  return '￥' + avg.toFixed(2);
}

const toLogin = () => router.push('/login');
const toRegister = () => router.push('/register');

onMounted(() => {
  getList();
});


const particleStyle = (n) => {
  const size = Math.random() * 4 + 2;
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    background: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.05})`
  };
};
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden; /* 避免水平滚动条 */
}


.home-container {
  position: relative; /* 保留滚动 */
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden;
  background-image: url('img/yeshijie.png');
  background-size: cover;
  background-position: center;
}

.home-container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 100%
  );
  backdrop-filter: blur(3px);
}

.background-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.particle {
  position: absolute;
  border-radius: 50%;
  animation: float 15s infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(20px) translateX(5px);
  }
}

/* 导航栏 */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-logo span {
  color: white;
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.nav-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.login-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.register-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: white;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* 主内容区 */
.main-content {
  position: relative;
  z-index: 1;
  padding: 140px 20px 80px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.hero-title {
  margin: 0 0 16px 0;
  color: white;
  font-size: 56px;
  font-weight: 800;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  background: linear-gradient(135deg, #667eea 0%, #ee8f50 50%, #FF6B6B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  margin: 0 0 40px 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 20px;
  font-weight: 300;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.project-info {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: inline-block;
}

.author-info, .github-link {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 16px;
}

.github-link a {
  color: #4ECDC4;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.github-link a:hover {
  color: #FFD700;
}

.github-link a svg {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

/* 功能特性 */
.features-section, .guide-section {
  margin-bottom: 80px;
}

.section-title {
  text-align: center;
  color: white;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 40px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

/* 指引步骤 */
.guide-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 40px;
  position: relative;
  
}

.step {
  text-align: center;
  min-width: 180px;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 16px;
}

.step h3 {
  margin: 0 0 8px 0;
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.step p {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.step-line {
  width: 60px;
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
}

/* 页脚 */
.page-footer {
  position: relative;
  z-index: 1;
  padding: 30px 20px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.copyright, .tech-stack {
  margin: 0;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.tech-stack {
  margin-top: 8px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-nav {
    padding: 16px 20px;
  }
  
  .nav-logo span {
    font-size: 20px;
  }

  .guide-steps {
    flex-direction: column;
    gap: 20px;
  }
  
  .step-line {
    width: 2px;
    height: 40px;
  }


}
</style>