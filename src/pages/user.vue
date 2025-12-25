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

        
        <p><strong>用户名：</strong>{{ user.username }}</p>
        <p><strong>用户名：</strong>{{ user.nickname }}</p>
        <p><strong>邮箱：</strong>{{ user.email }}</p>
        <p><strong>ID：</strong>{{ user.id }}</p>
        <p><strong>角色：</strong>{{ user.role || '普通用户' }}</p>
        <p><strong>注册时间：</strong>{{ user.start_time }}</p>

        <div class="btn-group" v-if="!editing">
          <button class="main-btn" @click="startEdit ">编辑资料</button>
          <button class="logout-btn" @click="logout">退出登录</button>
          <button class="danger-btn" @click="removeUser">注销账号</button>
        </div>


        <div v-else class="edit-box">
          <input class="input" v-model="editNickname" placeholder="请输入昵称">
          <input class="input" v-model="editEmail" placeholder="请输入新的邮箱">
          <input class="input" v-model="editAvatar" placeholder="请输入头像图片 URL">

          <div class="upload-row">
            <input type="file" @change="handleFile" accept="image/*" />
            <button class="main-btn" :class="{ uploading: uploading }" @click="uploadImage" :disabled="!file || uploading">
              {{ uploading ? "正在上传..." : "上传图片" }}
            </button>
          </div>

          <!-- 预览 -->
          <div v-if="editAvatar" class="preview">
            <span>图片预览</span>
            <img :src="editAvatar" />
          </div>

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
  import router from "@/router"
  import { hasToken } from "@/store/auth"
  import axios from "axios"
  // 用户数据
  const user = ref(null)
  const loading = ref(true)

  const defaultAvatar = "/img/default.png"

  async function getUserInfo() {
      user.value = JSON.parse(localStorage.getItem("userInfo"))

      loading.value = false
  }
  onMounted(() => {
      getUserInfo()
  })  
  async function logout(){
    if(!confirm("确定要推出登陆账号吗？")){
      return;
    }
    localStorage.removeItem("userInfo")
    hasToken.value = false
    alert("已退出登录")
    router.replace("/login")
  }

  function goHome(){
    router.push("/")
  }

  

  const editing = ref(false)
  const editEmail = ref(""), editAvatar = ref(""), editNickname = ref("")


  function startEdit(){
    editing.value = true
    editEmail.value = user.value.email
    editAvatar.value = user.value.avatar_url
    editNickname.value = user.value.nickname
  }

  function cancelEdit(){
    editing.value = false
  }

  async function saveInfo(){
    try{
      await axios.get("/api/editUser", {
        params:{
          id: user.value.id,
          email: editEmail.value,
          avatar_url: editAvatar.value,
          nickname: editNickname.value
        }
      })
      user.value.email = editEmail.value
      user.value.avatar_url = editAvatar.value
      user.value.nickname = editNickname.value

      localStorage.setItem("userInfo", JSON.stringify(user.value))

      alert("修改成功")
      editing.value = false

    }catch(e){
      console.log(e)
      alert("修改失败，请稍后再试")
    }
  }

  // 注销
  async function removeUser(){
    if(!confirm("确定要注销账号吗？此操作不可恢复！")){
      return;
    }

    try{
      const res = await axios.get("/api/remove",{
        params:{
          id: user.value.id
        }
      })

      alert(res.data.message || "账号已注销")

      localStorage.removeItem("userInfo")
      hasToken.value = false

      router.replace("/login")

    }catch(e){
      console.log(e)
      alert("注销失败，请稍后再试")
    }
  }

  // 上传新头像
  const file = ref(null)
  const uploading = ref(false)

  function handleFile(e) {
    file.value = e.target.files[0]
  }

  async function uploadImage() {
    if (!file.value) return alert("请选择图片")

    uploading.value = true

    try {
      const form = new FormData()
      form.append("file", file.value)
      form.append("strategy_id", 1)

      const res = await axios.post(
        "http://image.wanli.zhiyuansofts.cn/api/v1/upload",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      )
      editAvatar.value = res.data.data.links.url
      file.value = null
    } catch (err) {
      alert("上传失败，请重试")
    } finally {
      uploading.value = false
    }
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
  .danger-btn{
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    background: #d63031;
    color: white;
  }
  .danger-btn:hover{
    background:#b71515;
  }

  .preview img{
    width:100px;
    border-radius:10px;
    margin-top:5px;
  }
</style>
