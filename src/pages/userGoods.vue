<template>
  <div class="manage-container">
    <div class="glass-overlay">
      <div class="content-wrapper">
        <header class="page-header">
          <div class="title-section">
            <h2>我的仓库</h2>
            <p v-if="!loading">共有 {{ goods.length }} 件在售商品</p>
          </div>
          <button class="add-btn" @click="goToAdd">+ 发布新商品</button>
        </header>

        <div v-if="loading" class="loading-box">
          <div class="spinner"></div>
          <p>正在同步数据库数据...</p>
        </div>

        <div v-else class="goods-list">
          <!-- 优化后的商品卡片开始 -->
          <div class="good-card" v-for="g in goods" :key="g.id">
            <!-- 图片区域 -->
            <div class="card-image" @click="router.push({name: 'details', query: {id: g.id}})">
              <img :src="g.imgUrl || g.img_url || 'https://via.placeholder.com/150'" 
                   :alt="g.name" 
                   class="product-img"
                   loading="lazy">
              <div class="image-overlay">
                <span class="category-badge">{{ g.category || '默认' }}</span>
                <div class="view-details">查看详情</div>
              </div>
            </div>

            <!-- 内容区域 -->
            <div class="card-content">
              <!-- 商品信息 -->
              <div class="product-info">
                <h3 class="product-title">{{ g.name }}</h3>
                <p class="product-description">{{ g.introduce || '暂无详细介绍' }}</p>
              </div>

              <!-- 底部元数据 -->
              <div class="card-footer">
                <!-- 价格和库存 -->
                <div class="product-meta">
                  <div class="price-section">
                    <span class="price-label">价格</span>
                    <div class="price-value">
                      <span class="currency">￥</span>
                      <span class="price">{{ g.price.toFixed(2) }}</span>
                    </div>
                  </div>
                  <div class="stock-section">
                    <span class="stock-label">库存</span>
                    <span class="stock-count">{{ g.stock }}</span>
                    <span class="stock-unit">件</span>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div class="action-buttons">
                  <button class="action-btn edit-action" @click="goToEdit(g.id, g.name, g.price, g.category, g.stock, g.introduce, g.img_url)">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    编辑
                  </button>
                  <button class="action-btn delete-action" @click="deleteGood(g.id)">
                    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    下架
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- 优化后的商品卡片结束 -->
        </div>
        
      </div>
      <button class="back-home" @click="router.push('/')">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"
import router from "@/router"

// 1. 定义响应式数据
const goods = ref([])
const loading = ref(true)

// 2. 获取用户信息（从本地缓存获取登录时的用户对象）
const user = JSON.parse(localStorage.getItem("userInfo"))

/**
 * 加载商品列表 - 对应你的后端 @GetMapping("/api/findUserGoods")
 */
const loadGoods = async () => {
  if (!user || !user.id) {
    alert("登录状态已过期，请重新登录")
    loading.value = false
    return
  }

  try {
    // 这里的 params 会自动拼接成 ?id=xxx
    const res = await axios.get("/api/findUserGoods", {
      params: { id: user.id }
    })

    // 适配后端 Result<List<GoodInfo>> 结构
    // res.data 是 Result 对象, res.data.data 是商品数组
    if (res.data.code === 200 || res.data.data) {
      goods.value = res.data.data
    } else {
      console.error("数据加载失败:", res.data.message)
    }
  } catch (error) {
    console.error("网络请求异常:", error)
  } finally {
    // 无论成功失败，都关闭加载动画
    loading.value = false
  }
}

/**
 * 删除商品逻辑
 * @param id 商品ID
 */
async function deleteGood(id) {
  if (!confirm("确定要下架并删除该商品吗？此操作不可逆。")) return

  try {
    // 假设你的删除接口是 /api/deleteGood?id=xxx
    const res = await axios.get("/api/del", { 
      params: { id:id } 
    })
    
    if (res.data.code === 200) {
      alert("删除成功")
      // 这里的逻辑是：删除成功后，直接从本地数组过滤掉，不需要重新请求接口，用户体验更好
      goods.value = goods.value.filter(item => item.id !== id)
    }
  } catch (error) {
    alert("删除失败，请检查后端接口")
  }
}

/**
 * 跳转编辑页面
 */
const goToEdit = (id,name,price,category,stock,introduce,img_url) => {
  // 这里可以根据你的路由跳转，例如：
  // router.push(`/edit-good/${id}`)
  console.log("准备编辑商品ID:", id)
  router.push({
    name: 'update',
    query:{
      id: id,
      name: name,
      price:price,
      category:category,
      stock:stock,
      introduce:introduce,
      img_url:img_url
    }
  })
}

/**
 * 跳转新增页面
 */
const goToAdd = () => {
  console.log("跳转新增商品页面")
  router.push("/add");
}

// 3. 生命周期挂载
onMounted(() => {
  loadGoods()
})
</script>

<style scoped>
/* 原有基础样式保持不变 */
.manage-container {
  margin: 0 auto;
  min-height: 100vh;
  width: 100vw;
  /* 你的背景图 */
  background-image: url('img/background.png');
  background-position: center;
  background-size: cover;
  background-attachment: fixed; /* 背景固定，滑动时更有质感 */
  padding: 40px 20px;
  box-sizing: border-box;
}

/* 玻璃容器卡片：包裹整个内容区域（可选） */
.content-glass-wrapper {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.15); /* 半透明白 */
  backdrop-filter: blur(10px); /* 磨砂玻璃核心 */
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* 亮边框模拟玻璃厚度 */
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* 顶部标题栏文字改为白色更清晰 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.title-section h2 { margin: 0; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.3); }
.title-section p { margin: 5px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }

/* 商品条目玻璃化 */
.good-item {
  display: flex;
  background: rgba(255, 255, 255, 0.1); /* 极低透明度 */
  backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 15px;
}

.good-item:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

/* 图片区域 */
.image-wrapper {
  width: 160px;
  height: 140px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 内容文字颜色适配 */
.name { color: #fff; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.2); }
.intro { color: rgba(255, 255, 255, 0.7); }

/* 价格与标签 */
.price-value {
  color: #ffeb3b; /* 玻璃背景下亮黄色比粉色更醒目 */
  font-size: 22px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
.price-label { color: rgba(255,255,255,0.9); margin-right: 5px; }

.stock-tag {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}

/* 按钮样式微调 */
.actions button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  transition: all 0.2s;
}
.btn-edit:hover { background: #409eff; border-color: #409eff; }
.btn-delete:hover { background: #f56c6c; border-color: #f56c6c; }

.add-btn {
  background: linear-gradient(135deg, #67c23a, #4caf50);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}
/* 新增商品卡片样式 */
.goods-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.good-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.good-card:hover {
  transform: translateY(-8px);
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

/* 图片区域 */
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.card-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  z-index: 1;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.good-card:hover .product-img {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.good-card:hover .image-overlay {
  opacity: 1;
}

.category-badge {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.view-details {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.good-card:hover .view-details {
  transform: translateY(0);
}

/* 内容区域 */
.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.product-info {
  flex: 1;
  margin-bottom: 20px;
}

.product-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
  line-height: 1.4;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 底部元数据 */
.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 16px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.price-section,
.stock-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.price-label,
.stock-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.price-value {
  display: flex;
  align-items: baseline;
  color: #FFD700;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.currency {
  font-size: 14px;
  margin-right: 2px;
}

.price {
  font-size: 22px;
  line-height: 1;
}

.stock-count {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin-right: 2px;
}

.stock-unit {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.action-btn .icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.edit-action {
  background: rgba(64, 158, 255, 0.2);
  border: 1px solid rgba(64, 158, 255, 0.4);
  color: #fff;
}

.edit-action:hover {
  background: rgba(64, 158, 255, 0.3);
  border-color: rgba(64, 158, 255, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.delete-action {
  background: rgba(245, 108, 108, 0.2);
  border: 1px solid rgba(245, 108, 108, 0.4);
  color: #fff;
}

.delete-action:hover {
  background: rgba(245, 108, 108, 0.3);
  border-color: rgba(245, 108, 108, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.2);
}

/* 返回首页按钮优化 */
.back-home {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
}

.back-home:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-4px);
}

.back-icon {
  width: 20px;
  height: 20px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .goods-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .card-image {
    height: 180px;
  }
  
  .price {
    font-size: 20px;
  }
  
  .stock-count {
    font-size: 18px;
  }
}
</style>