<template>

  <div class="page-background" @click.self="goHome">

    <div class="user-card">
      <h2>个人中心</h2>

      <div v-if="loading" class="loading">
        正在加载用户信息...
      </div>

      <div v-else-if="!user">
        未能获取用户信息
      </div>

      <div v-else class="content">

        <img class="avatar" :src="user.avatar || defaultAvatar">

        <p><strong>ID：</strong>{{ user.id }}</p>
        <p><strong>用户名：</strong>{{ user.username }}</p>
        <p><strong>用户名：</strong>{{ user.nickname }}</p>
        <p><strong>邮箱：</strong>{{ user.email }}</p>
        <p><strong>角色：</strong>{{ user.role || '普通用户' }}</p>
        <p><strong>注册时间：</strong>{{ user.create_time }}</p>

        <div class="btn-group">
          <button class="main-btn" @click="goHome">返回首页</button>
          <button class="logout-btn" @click="logout">退出登录</button>
        </div>

      </div>

    </div>

  </div>

</template>


<script setup>
    import axios from "axios"
    import { ref, onMounted } from "vue"
    import { useRouter } from "vue-router"

    const router = useRouter()

    // 用户数据
    const user = ref(null)
    const loading = ref(true)

    const defaultAvatar = "/img/ye.png"   // 你可以换成自己的

    async function getUserInfo() {
        const token = localStorage.getItem("token")
        try {
            const res = await axios.get("/api/findUser", {
                params: { id: token }
            })
            user.value = res.data.data   // 根据你的后端结构调整
        } catch (e) {
            console.log(e)
            alert("获取用户信息失败")
        }
        loading.value = false
    }

    function logout(){
        localStorage.removeItem("token")
        alert("已退出登录")
        router.replace("/login")
        }

        function goHome(){
        router.push("/")
        }

        onMounted(() => {
        getUserInfo()
    })
</script>


<style scoped>
.page-background{
  position: fixed;
  inset: 0;
  background-image: url('/img/yeshijie.png');
  background-size: cover;
  background-position: center;
  display:flex;
  justify-content:center;
  align-items:center;
}

.page-background::before{
  content:"";
  position:absolute;
  inset:0;
  background:rgba(0,0,0,0.25);
  backdrop-filter:blur(2px);
}

.user-card{
  position:relative;
  width: 45%;
  padding: 25px;

  background: rgba(255,255,255,0.15);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(6px);

  color:white;
  text-align:center;
}

.avatar{
  width:100px;
  height:100px;
  border-radius:50%;
  border:2px solid white;
  margin-bottom:10px;
}

.main-btn{
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: #ff7675;
  color: white;
  font-weight: bold;
  transition: .2s;
}
.main-btn:hover{
  background:#ff4d4d;
}

.logout-btn{
  padding: 10px 20px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  background: gray;
  color: white;
}
.logout-btn:hover{
  background:#555;
}

.btn-group{
  margin-top:10px;
  display:flex;
  justify-content:space-between;
}
</style>
