<template>
    <div>
        
        <div v-if="s.stock == -1">
            所查询id编号暂无商品
        </div>
        <div v-else>
            <h1>商品详情:</h1>
            <h2>商品编号: {{ s.id}}</h2>
            <h2>商品名称: {{ s.name}}</h2>
            <h2>商品库存: {{ s.stock}}</h2>
            <h2>商品价格: {{ s.price}}</h2>
            <h2>商品介绍: {{ s.introduce}}</h2>
            <h2>商品所有者: {{ s.belongTo}}</h2>
            
            <!-- 交易区域 -->
            <h2>购买商品</h2>
            <div>
                购买数量：
                <input type="number" v-model="buyNum" min="1">
                <button @click="transact">购买</button>
            </div>

            <p style="color:red">{{ msg }}</p>


            <hr/>
            <h3>商品展示:</h3>
            <br/>
            <img :src="s.img_url" class="imgg"/>
        </div>
    </div>


</template>

<style>
    .imgg{
        max-width: 100%;
    }
</style>

<script setup>
    import axios from 'axios';
    import { onMounted, ref } from 'vue';
    import { useRoute } from 'vue-router';
    const route = useRoute()


    const s = ref({})
    const buyNum = ref(1)
    const msg = ref("")

    function getDetails(){
        axios.get("api/find",{
            params:{
                id: route.query.id
            }
        }).then((data)=>{
            s.value = data.data;
        })
    }
    onMounted(()=>{
        getDetails()
    })
    function transact(){
        
        if(buyNum.value <= 0){
            msg.value = "购买数量必须大于 0"
            return
        }
        let user = JSON.parse(localStorage.getItem("userInfo"))
        if(!user){
            msg.value = "请先登录"
            return
        }
        if(s.value.belongTo == user.id){
            msg.value = "这个本来就是属于你的，购买无效"
            return 
        }
        
        axios.get("api/transact",{
            params:{
                id_seller: s.value.belongTo,
                id_buyer: user.id,
                id_good: s.value.id,
                nums_buy: buyNum.value
            }
        }).then(res=>{
            msg.value = res.data.message
            if(res.data.code === 200){
                getDetails()
            }
        })
    }

</script>