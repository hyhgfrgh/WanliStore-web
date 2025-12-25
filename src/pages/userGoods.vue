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
          <div class="good-item" v-for="g in goods" :key="g.id">
            <div class="image-wrapper">
              <img :src="g.imgUrl || g.img_url || 'https://via.placeholder.com/150'" alt="图">
              <span class="category-tag">{{ g.category || '默认' }}</span>
            </div>

            <div class="detail-box">
              <div class="text-group">
                <h3 class="good-name">{{ g.name }}</h3>
                <p class="good-intro">{{ g.introduce || '暂无详细介绍' }}</p>
              </div>

              <div class="meta-row">
                <div class="price-info">
                  <span class="currency">￥</span>
                  <span class="price">{{ g.price }}</span>
                  <span class="stock-badge">库存: {{ g.stock }}</span>
                </div>
                <div class="button-group">
                  <button class="edit-btn" @click="goToEdit(g.id)">编辑</button>
                  <button class="del-btn" @click="deleteGood(g.id)">下架</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

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
const deleteGood = async (id) => {
  if (!confirm("确定要下架并删除该商品吗？此操作不可逆。")) return

  try {
    // 假设你的删除接口是 /api/deleteGood?id=xxx
    const res = await axios.delete("/api/deleteGood", { params: { id } })
    
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
const goToEdit = (id) => {
  // 这里可以根据你的路由跳转，例如：
  // router.push(`/edit-good/${id}`)
  console.log("准备编辑商品ID:", id)
  alert(`跳转到商品 ${id} 的编辑页面`)
}

/**
 * 跳转新增页面
 */
const goToAdd = () => {
  console.log("跳转新增商品页面")
}

// 3. 生命周期挂载
onMounted(() => {
  loadGoods()
})
</script>


<style scoped>
.manage-container {
  margin: 0 auto;
  min-height: 100vh;
  width: 100vw;
  /* 你的背景图 */
  background-image: url('img/yeshijie.png');
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
</style>