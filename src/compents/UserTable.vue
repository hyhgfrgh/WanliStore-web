<template>
<div class="user-menu">
  <div class="avatar-btn" @click="toggleMenu">
    <img :src="user.avatar_url || '/img/default.png'" />
  </div>

  <div v-if="showMenu" class="menu-box">
    <p class="menu-item" @click="goProfile">个人中心</p>
    <p class="menu-item" @click="goUserGoods">我的仓库</p>
    <p class="menu-item" @click="logout">退出登录</p>
  </div>
</div>

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
    function goUserGoods(){
        router.push("/userGoods")
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
        margin-top: 12px;

        width: clamp(130px, 22vw, 170px);

        background: linear-gradient(135deg, rgba(255,255,255,.98), rgba(245,245,245,.9));
        border-radius: 14px;
        padding: 10px 0;
        text-align: center;

        box-shadow:
            0 10px 25px rgba(0,0,0,0.25),
            inset 0 0 1px rgba(255,255,255,.9);

        border: 1px solid rgba(255,255,255,.7);
        backdrop-filter: blur(6px);

        animation: drop 0.18s ease-out;
    }

    /* 下拉出现动画 */
    @keyframes drop{
        from{
            opacity: 0;
            transform: translateY(-8px) scale(.96);
        }
        to{
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    /* 每个菜单项 */
    .menu-item{
        padding: 10px 0;
        color: #333;
        font-weight: 500;
        letter-spacing: .5px;
        cursor: pointer;
        transition: .18s;
        border-radius: 10px;
        margin: 2px 8px;
    }

    /* hover 效果：柔和高亮 + 轻微放大 */
    .menu-item:hover{
        background: rgba(255,120,120,.15);
        color: #ff5e57;
        transform: translateX(2px);
    }

    .mask{
        position: fixed;
        inset: 0;
    }

</style>