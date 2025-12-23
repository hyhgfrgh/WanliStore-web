import { ref } from "vue"

export const hasToken = ref(!!localStorage.getItem("userInfo"))

