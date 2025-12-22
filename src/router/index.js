import { createRouter,createWebHashHistory, createWebHistory} from "vue-router";
import Home from '@/pages/home.vue'
import Details from "@/pages/details.vue";
import Login from "@/pages/login.vue";
import Register from "@/pages/register.vue";
import AddGoods from "@/pages/addGoods.vue";
import UpdateGoods from "@/pages/updateGoods.vue";

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'home',
        component: Home
    },
    {
        path: '/details',
        name: 'details',
        component: Details
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/add',
        name: 'add',
        component: AddGoods
    },
    {
        path: '/update',
        name: 'update',
        component: UpdateGoods
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router