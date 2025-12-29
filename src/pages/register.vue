<template>
    <div  class="page-background" @click.self="router.replace('/')">
        <div v-if="!registerSuccess" class="register-container">
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

                <p v-if="triedSubmit && message" style="color:red;">
                    {{ message }}
                </p>

                
                <button @click="register" :disabled="isLoading">
                    {{ isLoading ? '注册中...' : '注册' }}
                </button>

            </form>
        </div>
        <div v-else class="register-container">
            <h1 style="color: green;">注册成功！</h1>
            <div>
                点击 <router-link to="/login">此处</router-link> 跳转至登陆页面
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue'
    import axios from 'axios'
    import router from '@/router'
    const username = ref(""),nickname = ref(""),password = ref(""),repassword = ref("")
    const message = ref(""),registerSuccess = ref(false),isLoading = ref(false)
    const validate = () => {
        if (!username.value.trim()) return "用户名不能为空"
        if (username.value.trim().length < 3) return "用户名至少 3 个字符"

        if (!nickname.value.trim()) return "昵称不能为空"

        if (!password.value) return "密码不能为空"
        if (password.value.length < 6) return "密码至少 6 位"
        if (!/^(?=.*[0-9])(?=.*[A-Za-z]).+$/.test(password.value))
            return "密码需要包含字母和数字"

        if (!repassword.value) return "请重复密码"
        if (password.value !== repassword.value) return "两次密码不一致"

        return null
    }
    const triedSubmit = ref(false)

    async function register() {
        message.value = ""
        triedSubmit.value = true

        const err = validate()
        if (err) {
            message.value = err
            return
        }

        isLoading.value = true
        
        try {
            const res = await axios.get("/api/register",{
                params: {
                    username: username.value,
                    nickname: nickname.value,
                    password: password.value,
                    start_time: new Date().toISOString().slice(0,16).replace('T',' ')
                }
            })

            if(res.data.code === 200){
                registerSuccess.value = true
            }else{
                message.value = res.data.message || "注册失败"
            }
        } catch (e){
            message.value = "服务器异常，请稍后再试"
        } finally {
            isLoading.value = false
        }
    }


</script>

<style scoped>

    .page-background {
        position: relative;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;

        background-image: url('/img/background.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba(0,0,0,0.3);
    }

    .page-background::before{
    content: "";
        position: absolute;
        inset: 0;
        background: rgba(0,0,0,0.25);
        backdrop-filter: blur(2px);
    }


    /* 登录容器 */
    .register-container {
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

    /* 标题 */
    .register-container h2{
        margin-bottom: 20px;
        letter-spacing: 2px;
        font-size: 28px;
    }

    /* 表单布局 */
    .login-form {
        display: flex;
        flex-direction: column;
    }

    .form-group {
        text-align: left;
        margin-bottom: 18px;
    }

    label {
        font-weight: bold;
    }

    /* 输入框 */
    input {
        width: 100%;
        padding: 10px;
        border-radius: 10px;

        border: 1px solid rgba(255,255,255,0.4);
        background: rgba(255,255,255,0.2);
        color:white;

        outline: none;
    }

    input::placeholder{
    color:#eee;
    }

    button {
        padding: 10px 20px;
        border-radius: 12px;
        border: none;
        cursor: pointer;

        background: #ff7675;
        color: white;
        font-weight: bold;
        transition: .2s;
    }

    button:hover {
        background: #ff4d4d;
    }

    /* 注册链接 */
    .register-link{
        margin-top:15px;
    }

    .register-link a{
        color:#ffd37a;
        font-weight:bold;
    }

    
    
</style>