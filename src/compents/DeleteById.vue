<template>
    <input v-model="delId"  @keyup.enter="del"></input>
    <br></br>
    <button @click="del">DeleteById</button>
    <br></br>

</template>

<script setup>
    import axios from 'axios';
    import { ref } from 'vue';
    const props = defineProps({
        getList: Function
    })

    const delId = ref("")
    
    function del(){
        axios.get("/api/del",{
            params: {
                id: delId.value
            }
        }).then((data)=>{props.getList()})
    }


</script>