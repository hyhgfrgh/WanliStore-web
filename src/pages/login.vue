<template>
    <div class="page-background" @click.self="router.replace('/')">
        <div class="login-container">
            <h2>用户登录</h2>
        
            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="username">用户名/邮箱:</label>
                    <input id="username" type="text" v-model="username">
                </div>
                <div class="form-group">
                    <label for="password">密码:</label>
                    <input id="password" type="password" v-model="password">
                </div>

                <div v-if="triedSubmit && error" class="error-message">
                    <p color="red">{{ error }}</p>
                </div>
                <button type="submit" :disabled="isLoading">
                    {{ isLoading ? '登录中...' : '登录' }}
                </button>
            </form>
            
            <p class="register-link">
                还没有账号？<router-link to="/register">立即注册</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { hasToken } from '@/store/auth';
    import router from '@/router';
    
    const  username = ref(''),password = ref('');

    const isLoading = ref(false);
    const error = ref('');
    const triedSubmit = ref(false);

    // 登录校验，统一逻辑
    const validate = () => {
        if(!username.value) return "请填写用户名"
        if(!password.value) return "请填写密码"
        if(password.value.length < 6) return "密码至少6位"
        return null
    }
    const handleLogin = async () => {
        error.value = '';
        triedSubmit.value = true;

        const err = validate();
        if(err){
            error.value = err;
            return;
        }else{
            isLoading.value = true;
            try{
                const res = await axios.get("/api/auth/login",{
                    params: {
                        username: username.value,
                        password: password.value
                    }
                });
                if(res.data.code === 200){
                    // 暂时用 user 当作 token
                    const user = res.data.data
                    localStorage.setItem('userInfo',JSON.stringify(user));
                    
                    hasToken.value = true;

                    console.log("登录成功:", res.data.data)
                    router.replace('/');
                } else {
                    error.value = res.data.message || "账号或密码错误";
                }
            }catch(e){
                error.value = "服务器异常，请稍后再试"
            }finally{
                isLoading.value = false
            }
        }
        
    };

</script>

<style scoped>
.page-background {
  position: relative;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;

  background-image: url('/img/yeshijie.png');
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
.login-container {
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
.login-container h2{
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


.register-link{
  margin-top:15px;
}

.register-link a{
  color:#7aff8c;
  font-weight:bold;
}

    
    
</style>