<template>
  <div class="container">
    <div v-if="s.stock === -1" class="no-product">
      所查询id编号暂无商品
    </div>
    <div v-else class="product-card">
      <h1 class="title">商品详情</h1>
      <div class="product-info">
        <div class="left">
          <img :src="s.img_url" alt="商品图片" class="product-img"/>
        </div>
        <div class="right">
          <h2>商品编号: <span>{{ s.id }}</span></h2>
          <h2>商品名称: <span>{{ s.name }}</span></h2>
          <h2>商品库存: <span>{{ s.stock }}</span></h2>
          <h2>商品价格: <span class="price">¥{{ s.price }}</span></h2>
          <h2>商品介绍: <span>{{ s.introduce }}</span></h2>
          <h2>商品所有者: <span>{{ s.belongTo }}</span></h2>
        </div>
      </div>

      <!-- 交易区域 -->
      <div class="transaction">
        <h2>购买商品</h2>
        <div class="buy-section">
          <input type="number" v-model="buyNum" min="1" class="buy-input"/>
          <button class="buy-btn" @click="transact">购买</button>
        </div>
        <p class="msg">{{ msg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const s = ref({});
const buyNum = ref(1);
const msg = ref("");

function getDetails() {
  axios.get("api/find", {
    params: {
      id: route.query.id
    }
  }).then((data) => {
    s.value = data.data;
  });
}

onMounted(() => {
  getDetails();
});

function transact() {
  if (buyNum.value <= 0) {
    msg.value = "购买数量必须大于 0";
    return;
  }
  let user = JSON.parse(localStorage.getItem("userInfo"));
  if (!user) {
    msg.value = "请先登录";
    return;
  }
  if (s.value.belongTo == user.id) {
    msg.value = "这个本来就是属于你的，购买无效";
    return;
  }

  axios.get("api/transact", {
    params: {
      id_seller: s.value.belongTo,
      id_buyer: user.id,
      id_good: s.value.id,
      nums_buy: buyNum.value
    }
  }).then(res => {
    msg.value = res.data.message;
    if (res.data.code === 200) {
      getDetails();
    }
  });
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 40px auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.no-product {
  text-align: center;
  font-size: 20px;
  color: red;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #2d3436;
}

.product-info {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.left {
  flex: 1;
}

.right {
  flex: 2;
}

.product-img {
  width: 100%;
  border-radius: 12px;
  border: 1px solid #dcdcdc;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}

.right h2 {
  margin: 8px 0;
  font-weight: 500;
}

.right span {
  font-weight: 400;
  color: #555;
}

.price {
  color: #e74c3c;
  font-weight: bold;
}

.transaction {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.buy-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.buy-input {
  width: 100px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  outline: none;
}

.buy-input:focus {
  border-color: #3498db;
}

.buy-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 8px;
  background-color: #3498db;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.buy-btn:hover {
  background-color: #2980b9;
}

.msg {
  color: red;
  margin-top: 10px;
}
</style>

