<template>
  <div class="delete-box">

    <label>删除指定 ID:</label>

    <input 
      v-model="delId"
      placeholder="请输入要删除的商品 ID"
      @keyup.enter="del"
    />

    <button @click="del">
      删除数据
    </button>

    <p v-if="error" class="error">{{ error }}</p>

  </div>
</template>

<script setup>
  import axios from 'axios'
  import { ref } from 'vue'

  const props = defineProps({
    getList: {
      type: Function,
      required: true
    }
  })

  const delId = ref("")
  const error = ref("")

  async function del() {
    error.value = ""

    if (!delId.value.trim()) {
      error.value = "ID 不能为空"
      return
    }

    try {
      await axios.get("/api/del", {
        params: { id: delId.value }
      })

      delId.value = ""
      props.getList()

    } catch (e) {
      console.error("删除失败:", e)
      error.value = "删除失败，请检查 ID 是否存在"
    }
  }
</script>

<style scoped>
  .delete-box{
    width: 80%;
    text-align: center;

    display: flex;
    flex-direction: column;
    gap: 10px;

    padding: 15px;
    border-radius: 14px;

    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.3);
  }

  label{
    font-weight: bold;
    letter-spacing: 1px;
  }

  /* 输入框 */
  input{
    width: 60%;
    margin: 0 auto;

    padding: 10px;
    border-radius: 10px;

    border: 1px solid rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.2);
    color: white;
  }

  /* 按钮 */
  button{
    width: 40%;
    margin: 0 auto;

    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;

    background: #ff7675;
    color: white;
    font-weight: bold;
    transition: .2s;
  }

  button:hover{
    background: #ff4d4d;
  }

  /* 错误提示 */
  .error{
    margin-top: 5px;
    color: #dc3e3e;
  }
</style>
