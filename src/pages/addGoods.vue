<template>

  <div class="page-background"  @click.self="uploading ? null : router.replace('/userGoods')">

    <div class="add-container">

      <h2>新增商品</h2>

      <div class="form">

        <input v-model="name" placeholder="商品名称" required />
        <input v-model="price" placeholder="商品价格" required />
        <input v-model="category" placeholder="商品分类" required />
        <input v-model="stock" placeholder="库存数量" required />

        <textarea 
          v-model="introduce"
          rows="4"
          placeholder="商品介绍"
        ></textarea>

        <input v-model="img_url" type="url" placeholder="商品图片 URL" />

        <div class="upload-row">
          <input type="file" @change="handleFile" accept="image/*" />
          <button class="main-btn" :class="{ uploading: uploading }" @click="uploadImage" :disabled="!file || uploading">
            {{ uploading ? "正在上传..." : "上传图片" }}
          </button>

        </div>

        <p v-if="!name" class="warn">未输入商品名称</p>

        <div v-if="img_url" class="preview">
          <span>图片预览</span>
          <img :src="img_url" />
        </div>

        <div class="btn-group">
          <button class="main-btn" @click="add">保存</button>
          <button class="cancel-btn" @click="goBack">返回首页</button>
        </div>

      </div>

    </div>

  </div>

</template>


<script setup>
  import axios from 'axios'
  import { ref,onMounted } from 'vue'
  import { useRouter } from "vue-router"

  const router = useRouter()

  const name = ref("")
  const img_url = ref("")
  const category = ref("")
  const price = ref("")
  const stock = ref("")
  const introduce = ref("")
  const uploading = ref(false)
  const user = ref("")
  async function getUserInfo() {
      user.value = JSON.parse(localStorage.getItem("userInfo"))

  }
  onMounted(() => {
      getUserInfo()
  })  

  function add() {
    axios.get("/api/add", {
      params: {
        id: user.value.id,
        name: name.value,
        img_url: img_url.value,
        category: category.value,
        price: price.value,
        stock: stock.value,
        introduce: introduce.value
      }
    }).then(() => {
      clearForm()
      router.push("/")   // 保存后返回首页
    })
  }

  const file = ref(null)

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

      img_url.value = res.data.data.links.url
      file.value = null
    } catch (err) {
      alert("上传失败，请重试")
    } finally {
      uploading.value = false
    }
  }


  function clearForm() {
    name.value = ""
    img_url.value = ""
    category.value = ""
    price.value = ""
    stock.value = ""
    introduce.value = ""
  }

  function goBack(){
    router.push("/")
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

  .add-container{
    position:relative;
    width: 60%;
    padding: 25px;

    background: rgba(255,255,255,0.15);
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.3);
    backdrop-filter: blur(6px);

    color:white;
    text-align:center;
  }

  h2{
    margin-bottom:15px;
  }

  .form{
    display:flex;
    flex-direction:column;
    gap:10px;
  }

  input, textarea{
    padding:10px;
    border-radius:10px;
    border:1px solid rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.15);
    color:white;
  }

  input:focus, textarea:focus{
    outline:none;
    border-color:#ff7675;
  }

  .upload-row{
    display:flex;
    gap:10px;
  }

  .warn{
    color:#e63333;
  }

  .preview img{
    width:100px;
    border-radius:10px;
    margin-top:5px;
  }

  .btn-group{
    display:flex;
    justify-content:space-between;
    margin-top:10px;
  }

  /* 和 center-box 一致的按钮 */

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

  /* 上传中状态 */
  .main-btn.uploading{
    background: #888;        /* 灰色 */
    cursor: not-allowed;
    opacity: 0.8;
  }

  /* disabled 兼容态（确保所有情况一致） */
  .main-btn:disabled{
    background:#888;
    cursor:not-allowed;
    opacity:0.8;
  }

  .cancel-btn{
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    background: gray;
    color:white;
  }
  .cancel-btn:hover{
    background:#555;
  }

</style>
