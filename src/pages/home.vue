<template>

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


    <!-- 增加商品 -->
    <add :getList="getList" /> 
    

    <hr></hr>   
    
    <br></br>
    <input v-model="delId"  @keyup.enter="del"></input>
    <br></br>
    <button @click="del">DeleteById</button>
    <br></br>
    <hr></hr>

    
    <update :getList="getList" />

    
    <p>
        <img src="/img/ying.jpg" />
    </p>
    <hr></hr>
    <button @click="deleteAll"> DeleteAll</button>

    
</template>

<style>
    .fixed-nav-buttons{
        position: fixed;
        
        top: 20px;
        right: 20px;
        
        z-index: 1000;
        
        display: flex;
        gap: 10px;
    }

</style>


<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import Show from '../compents/show.vue';
import Add from '../compents/add.vue';
import Update from '../compents/update.vue';

    const s = ref([]);
    const delId = ref("")
    
    function del(){
        axios.get("/api/del",{
            params: {
                id: delId.value
            }
        }).then((data)=>getList())
    }

    function deleteAll(){
        axios.get("/api/delAll").then((data)=>{s.value = []})
    }
    
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