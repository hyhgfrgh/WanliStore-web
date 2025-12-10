<template>
    <div  class="page-background">
        <p v-if="!registerSuccess" class="login-container">
            <h2>用户注册</h2>
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="username">用户名:</label>
                    <input id="username" type="text" v-model="username" required>
                </div>
                <div class="form-group">
                    <label for="nickname">昵称:</label>
                    <input id="nickname" type="text" v-model="nickname" required>
                </div>
                <div class="form-group">
                    <label for="password">密码:</label>
                    <input id="password" type="password" v-model="password" required>
                </div>
                <div class="form-group">
                    <label for="repassword">重复密码:</label>
                    <input id="repassword" type="password" v-model="repassword" required>
                </div>

                <p v-if="username == ''" style="color: red;">用户名为空</p>
                <p v-else-if="nickname==''" style="color: red;">昵称为空</p>
                <p v-else-if="password==''" style="color: red;">密码为空</p>
                <p v-else-if="repassword==''" style="color: red;">密码未验证</p>
                <p v-else-if="repassword!='' && password!=repassword"  style="color: red;">密码不一致</p>
                
                
                <button @click="register" :disabled="isLoading || password == '' || password!=repassword || username=='' || nickname == ''">
                    {{ isLoading ? '注册中...' : '注册' }}
                </button>
                <p style="color: red;"> {{ message }} </p>
            </form>
            </p><p v-else class="login-container">
                <h1 style="color: green;">注册成功！</h1>
                <p>
                    点击 <router-link to="/login">此处</router-link> 跳转至登陆页面
                </p>
            </p>
    </div>
</template>


<script setup>
    import { ref, reactive } from 'vue';
    import { useRouter } from 'vue-router';
    import axios from 'axios';

    const router = useRouter();
    const username = ref(""),nickname = ref(""),password = ref(""),repassword = ref("")
    const message = ref("")
    const registerSuccess = ref(false)
    const isLoading = ref(false);

    function register(){
        axios.get("/api/register",{
            params:{
                username: username.value,
                nickname: nickname.value,
                password: password.value
            }
        }).then((data)=>{
            console.log(data.data)
            if(data.data.code == 200)
                registerSuccess.value = true
            else
                message.value = data.data.message
        })
    }

</script>

<style scoped>
    .login-container {
        width: 40%;
        margin: 50px auto;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        text-align: center;
        background-color: rgba(80, 180, 216, 0.4);
    }
    .page-background {
        /* 使其占据整个视口 */
        position: fixed; /* 固定在视口，不随滚动条移动 */
        top: 0;
        left: 0;
        width: 100vw;   /* 100% 视口宽度 */
        height: 100vh;  /* 100% 视口高度 */
        
        /* 设置背景图片 */
        background-image: url('public/img/xiaogong.png'); /* !!! 替换成你的图片路径 !!! */
        background-size: cover;       /* 确保图片覆盖整个容器，可能会裁剪 */
        background-position: center;  /* 图片居中显示 */
        background-repeat: no-repeat; /* 防止图片重复 */
        
        /* 确保登录容器能在其内部居中 */
        display: flex;
        justify-content: center; /* 水平居中 */
        align-items: center;     /* 垂直居中 */
        
        /* 可以根据需要添加一个半透明的蒙版，使登录框更突出 */
        background-color: rgba(80, 180, 216, 0.8); /* 灰色半透明蒙版 */ 
    }
    .login-form {
        display: flex;
        flex-direction: column;
    }

    .form-group {
        text-align: left;
        margin-bottom: 15px;
    }

    label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box; /* 确保 padding 不会增加宽度 */
    }

    button {
        padding: 10px 15px;
        background-color: #42b983; /* Vue 绿色 */
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        transition: background-color 0.3s;
    }

    button:hover:not(:disabled) {
        background-color: #368e65;
    }

    button:disabled {
        background-color: #a3d9bf;
        cursor: not-allowed;
    }

    .error-message {
        color: red;
        margin-top: -10px;
        margin-bottom: 15px;
    }

    .register-link {
        margin-top: 20px;
        font-size: 0.9em;
    }

    
</style>