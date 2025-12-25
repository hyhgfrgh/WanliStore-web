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

        <img class="avatar" :src="user.avatar_url || defaultAvatar">

        <p><strong>ID：</strong>{{ user.id }}</p>
        <p><strong>用户名：</strong>{{ user.username }}</p>
        <p><strong>用户名：</strong>{{ user.nickname }}</p>
        <p><strong>邮箱：</strong>{{ user.email }}</p>
        <p><strong>角色：</strong>{{ user.role || '普通用户' }}</p>
        <p><strong>注册时间：</strong>{{ user.start_time }}</p>

        <!-- <div class="btn-group">
          <button class="main-btn" @click="goHome">返回首页</button>
          <button class="logout-btn" @click="logout">退出登录</button>
        </div> -->


        <div class="btn-group" v-if="!editing">
          <button class="main-btn" @click="editing = true">编辑资料</button>
          <button class="logout-btn" @click="logout">退出登录</button>
        </div>


        <div v-else class="edit-box">
          <input class="input" v-model="editEmail" placeholder="请输入新的邮箱">
          <input class="input" v-model="editAvatar" placeholder="请输入头像图片 URL">

          <div class="btn-group">
            <button class="main-btn" @click="saveInfo">保存</button>
            <button class="logout-btn" @click="cancelEdit">取消</button>
          </div>
        </div>



      </div>

    </div>

  </div>

</template>


<script setup>
    import { ref, onMounted } from "vue"
    import { useRouter } from "vue-router"
    import router from "@/router"
    import { hasToken } from "@/store/auth"
    // const router = useRouter()

    // 用户数据
    const user = ref(null)
    const loading = ref(true)

    const defaultAvatar = "/img/touxiang.png"

    async function getUserInfo() {
        user.value = JSON.parse(localStorage.getItem("userInfo"))

        loading.value = false
    }

    function logout(){
      localStorage.removeItem("token")
      hasToken.value = false
      alert("已退出登录")
        router.replace("/login")
      }
      function goHome(){
        router.push("/")
      }

      onMounted(() => {
        getUserInfo()
    })

    const editing = ref(false)
    const editEmail = ref("")
    const editAvatar = ref("")

    function cancelEdit(){
      editing.value = false
    }

    function saveInfo(){
      if(!editEmail.value){
        alert("邮箱不能为空")
        return
      }

      // 更新 user（页面响应式）
      user.value.email = editEmail.value
      user.value.avatar_url = editAvatar.value

      localStorage.setItem("userInfo", JSON.stringify(user.value))

      alert("修改成功")
      editing.value = false
    }

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
.input{
  width: 90%;
  padding: 8px;
  border-radius: 8px;
  border: none;
  margin: 6px 0;
}
.edit-box{
  margin-top: 10px;
}

</style>
