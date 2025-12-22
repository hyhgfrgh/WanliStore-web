<template> <div class="page-background">

    <h1>商店交易系统</h1>
    <h3>制作人:
        xxxx</h3>
    <p>学校:
        <a style="color:blueviolet;" href="https://www.cwxu.edu.cn/"title="无锡学院官网链接">
            Wuxi University
        </a>
    </p>
    <hr>

    <div class="fixed-nav-buttons">
        <button class="register-btn" @click="toRegister">注册</button>
        <button class="login-btn" @click="toLogin">登录</button>
    </div>
    
    
    <show :s="s" />
    <div class="center-box">
        <button @click="router.replace('/add')"  >新增商品</button><hr></hr>
        <button @click="router.replace('/update')">更新商品信息</button><hr></hr>   
        <DeleteById :getList="getList" /><hr></hr>
        <DeleteAll :getList="getList" :s="s"/>
    </div>
</div></template>



<!-- js -->
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Show from '../compents/show.vue';
import DeleteById from '@/compents/DeleteById.vue';
import DeleteAll from '@/compents/DeleteAll.vue';
import router from '@/router';

    const s = ref([]);
    
    function getList(){
        axios.get("/api/list").then((data)=>{
            // console.log(data.data[0].name)
            s.value = data.data.data
            console.log(data.data.message)

        })
    }

    const toLogin = () => {
        window.location.href = '/login';
    }
    const toRegister = () => {
        window.location.href = '/register';
    }
    
    
    onMounted(()=>{
        getList()   
    })


</script>




<!-- CSS -->
<style>
    html, body {
      margin: 0;
      padding: 0;
    }
    h1 {
      text-align: center;
      margin-top: 0px;
      font-size: 42px;
      letter-spacing: 2px;
    }
    h3, p {
      text-align: center;
    }
    
    .page-background {
      position: relative;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-image: url('img/yeshijie.png');
      background-position: center;
      background-size: cover;
    }

    /* 半透明遮罩，提高可读性 */
    .page-background::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.25);
      backdrop-filter: blur(2px);
    }

    /* 主内容容器 */
    .page-background > * {
      position: relative;
      color: white;
    }

    .fixed-nav-buttons{
        position: fixed;
        
        top: 20px;
        right: 20px;
        
        z-index: 1000;
        
        display: flex;
        gap: 10px;
    }
    .fixed-nav-buttons button {
      border: none;
      padding: 10px 18px;
      border-radius: 999px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;

      background: rgba(255,255,255,0.2);
      color: white;
      backdrop-filter: blur(6px);
      border: 1px solid rgba(255,255,255,0.3);
      transition: all .2s;
    }

    .fixed-nav-buttons button:hover {
      background: rgba(255,255,255,0.4);
    }
    /* 中心功能区容器 */
    .center-box {
      width: 60%;
      margin: 40px auto;
      padding: 25px;

      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;

      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.3);
      backdrop-filter: blur(6px);
    }

    /* 组件之间的分割线 */
    .center-box hr {
      width: 80%;
      border: none;
      height: 1px;
      background: rgba(255,255,255,0.5);
    }

    /* 下方按钮统一风格 */
    .center-box button {
      padding: 10px 20px;
      border-radius: 12px;
      border: none;
      cursor: pointer;

      background: #ff7675;
      color: white;
      font-weight: bold;
      transition: .2s;
    }

    .center-box button:hover {
      background: #ff4d4d;
    }

</style>