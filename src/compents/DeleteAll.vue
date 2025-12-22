<template>
    <br></br>
    <button @click="deleteAll"> DeleteAll</button>
    <br></br>

</template>

<script setup>
    import axios from 'axios';
    const props = defineProps({
        getList:Function,
        s:Array
    })
    
    function deleteAll(){
        axios.get("/api/delAll").then((data)=>{
            props.s.value = []
        }).then((data)=>{props.getList()})
    }


</script>