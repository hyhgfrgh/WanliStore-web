<template>
<div class="user-menu">
  <div class="avatar-btn" @click="toggleMenu">
    <img :src="user.avatar_url || '/img/default.png'" />
  </div>

  <div v-if="showMenu" class="menu-box">
    <p class="menu-item" @click="goProfile">个人中心</p>
    <p class="menu-item" @click="   ">我的物品</p>
    <p class="menu-item" @click="logout">退出登录</p>
  </div>
</div>

<!-- 点击背景关闭 -->
<div v-if="showMenu" class="mask" @click="showMenu=false"></div>


</template>


<script setup>
    import { ref } from "vue"
    import router from "@/router"
    import { hasToken } from "@/store/auth"
    const showMenu = ref(false)

    const user = ref(JSON.parse(localStorage.getItem("userInfo")))

    function toggleMenu(){
        showMenu.value = !showMenu.value
    }

    function goProfile(){
        router.push("/user")
        showMenu.value = false
    }
    async function logout(){
        if(!confirm("确定要退出登陆账号吗？")){
            return;
        }
        localStorage.removeItem("userInfo")
        hasToken.value = false
        alert("已退出登录")
        router.replace("/")
    }
</script>


<style scoped>
    .user-menu{
        position: fixed;
        top: 1vh;          /* 用相对单位，自适应屏幕高度 */
        right: 1vw;        /* 用相对单位，自适应屏幕宽度 */
        z-index: 1000;
    }

    /* 头像按钮自适应 */
    .avatar-btn{
        width: min(6vw, 48px);    /* 小屏变小，大屏不超过48px */
        height: min(6vw, 48px);
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid rgb(247, 215, 200);
    }

    .avatar-btn img{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    /* 下拉菜单 */
    .menu-box{
        position: absolute;
        right: 0;
        margin-top: 10px;

        width: clamp(120px, 22vw, 160px); 

        background: rgba(255,255,255,0.95);
        border-radius: 12px;
        text-align: center;
        padding: 10px 0;
        box-shadow: 0 5px 20px rgba(0,0,0,0.25);
        backdrop-filter: blur(4px);
    }


    .menu-item{
        padding: clamp(8px, 2vh, 12px) 0;
        cursor: pointer;
        color: #333;
        font-size: clamp(12px, 2.2vw, 14px);
    }

    .menu-item:hover{
        background: rgba(0,0,0,0.12);
    }


    .mask{
        position: fixed;
        inset: 0;
    }

</style>