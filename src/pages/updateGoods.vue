<template>

  <div class="page-background"  @click.self="uploading ? null : router.replace('/userGoods')">

    <div class="add-container">

      <h2>更新商品信息</h2>

      <div class="form">

        <input v-model="update_id" placeholder="商品 ID（必填）" required />

        <input v-model="update_name" placeholder="商品名称" />
        <input v-model="update_price" placeholder="商品价格" />
        <input v-model="update_category" placeholder="商品分类" />
        <input v-model="update_stock" placeholder="库存数量" />

        <textarea 
          v-model="update_introduce"
          rows="4"
          placeholder="商品介绍"
        ></textarea>

        <input v-model="update_img_url" type="url" placeholder="商品图片 URL" />

        <div class="upload-row">
          <input type="file" @change="handleFile" accept="image/*" />
          <button class="main-btn" @click="uploadImage" :disabled="!file">
            上传图片
          </button>
        </div>

        <div v-if="update_img_url" class="preview">
          <span>图片预览</span>
          <img :src="update_img_url" />
        </div>

        <div class="btn-group">
          <button class="main-btn" @click="update">保存修改</button>
          <button class="cancel-btn" @click="goBack">返回首页</button>
        </div>

      </div>

    </div>

  </div>

</template>


<script setup>
    import axios from 'axios'
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useRoute } from 'vue-router'
    const router = useRouter()
    const route = useRoute()

    const update_id = ref(route.query.id)
    const update_name = ref(route.query.name)
    const update_img_url = ref(route.query.img_url)
    const update_category = ref(route.query.category)
    const update_price = ref(route.query.price)
    const update_stock = ref(route.query.stock)
    const update_introduce = ref(route.query.introduce)

    function update() {

    if (!update_id.value) {
        alert("必须填写商品 ID 才能更新")
        return
    }

    axios.get("/api/update", {
        params: {
        id: update_id.value,
        name: update_name.value,
        price: update_price.value,
        stock: update_stock.value,
        category: update_category.value,
        img_url: update_img_url.value,
        introduce: update_introduce.value
        }
    }).then(() => {
        alert("更新成功")
        clearForm()
        router.push("/home")
    })
    }

    const file = ref(null)

    function handleFile(e) {
        file.value = e.target.files[0]
    }

    async function uploadImage() {
    if (!file.value) return alert("请选择图片")

    const form = new FormData()
    form.append("file", file.value)
    form.append("strategy_id", 1)

    const res = await axios.post(
        "http://image.wanli.zhiyuansofts.cn/api/v1/upload",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
    )

    update_img_url.value = res.data.data.links.url
    file.value = null
    }

    function clearForm() {
        update_id.value = ""
        update_name.value = ""
        update_img_url.value = ""
        update_category.value = ""
        update_price.value = ""
        update_stock.value = ""
        update_introduce.value = ""
    }

    function goBack() {
    router.push("/home")
    }
</script>


<style scoped>

    .page-background{
    position: fixed;
    inset: 0;
    background-image: url('/img/background.png');
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
