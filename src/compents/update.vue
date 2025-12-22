<template>

    <button @click="showDialog = true">更新商品信息</button>
    
    <div class="dialog-mask" v-if="showDialog" @click.self = "showDialog = false">
        <div class="dialog-box">
            <h3>更新商品信息</h3>
            <input v-model="update_id"  placeholder="待更新的商品编号id" required/>
            <br></br>
            <input v-model="update_name"  placeholder="待更新的商品名称" required/>
            <br></br>
            <input v-model="update_price" placeholder="待更新的商品的价格" required/>
            <br></br>
            <input v-model="update_category" placeholder="待更新的商品的种类" required/>
            <br></br>
            
            <input v-model="update_stock" placeholder="待更新的商品库存" required/>
            <br></br>
             <textarea v-model="update_introduce" placeholder="待更新的商品介绍" rows="4" class="big-input" required/>
            <br></br>
            <input v-model="update_img_url" type = "url" placeholder="待更新的商品图片url" required/>
            <br></br>
            <input type="file" @change="handleFile" accept="image/*" />
            <button @click="uploadImage" :disabled="!file" >上传</button>
            
            <button @click="update" :disabled="!update_name">Save</button>
            <br></br>
            <p v-if="!update_name" style="color: red">未输入商品名称</p>


            <p v-if="!update_img_url" style="color: red">暂未选择图片</p>
            <p v-else style="color: green">
                图片选择成功!
                <br></br>
                图片预览:
                <img :src="update_img_url" width="50"></img>
            </p>

            <button @click="update">保存</button>
            <button @click="showDialog = false">取消</button>

            
        </div>
    </div>


</template>


<script setup>
    import axios from 'axios';
    import { ref } from 'vue';

    const props = defineProps({
        getList: Function
    })


    const showDialog = ref(false)

    const update_id = ref("")
    const update_name = ref(""),update_img_url = ref(""),update_category = ref("")
    const update_price = ref(""),update_stock = ref(""),update_introduce = ref("")



    function update(){
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
        }).then((data)=>{
            showDialog.value = false;
            clearForm();
            props.getList();
        })
    }

    const file = ref(null)
    const previewUrl = ref(null)
    const result = ref(null)
    function handleFile(e) {
        file.value = e.target.files[0]
        previewUrl.value = URL.createObjectURL(file.value)
    }

    async function uploadImage() {
        if (!file.value) return alert("请选择图片")

        const form = new FormData()
        form.append("file", file.value)
        form.append("strategy_id", 1)

        const res = await axios.post("http://image.wanli.zhiyuansofts.cn/api/v1/upload", form, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        result.value = res.data.data
        update_img_url.value = res.data.data.links.url
        file.value = ""
        update_name.value = ""
    }
    
    function clearForm() {
        update_name.value = "";
        update_img_url.value = "";
        update_category.value = "";
        update_price.value = "";
        update_stock.value = "";
        update_introduce.value = "";
    }
</script>


<style>
    .dialog-mask {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .dialog-box {
        background: white;
        padding: 20px;
        border-radius: 15px;
        width: 500px;
        height: 600px;
    }
    .big-input {
        width: 61%;
        padding: 8px;
    }
</style>