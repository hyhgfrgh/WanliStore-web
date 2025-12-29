<template>
  <div class="page-background" @click.self="goHome">
    <div class="user-card">
      <h2>个人中心</h2>

      <div v-if="loading" class="loading">正在加载用户信息...</div>

      <div v-else-if="!user">未能获取用户信息</div>

      <div v-else class="content">
        <img v-if="!editing" class="avatar" :src="user.avatar_url || defaultAvatar" />

        <div v-if="!editing && !topuping">
          <p><strong>用户名：</strong>{{ user.username }}</p>
          <p><strong>昵称：</strong>{{ user.nickname }}</p>
          <p><strong>邮箱：</strong>{{ user.email }}</p>
          <p><strong>ID：</strong>{{ user.id }}</p>
          <p><strong>角色：</strong>{{ user.role || '普通用户' }}</p>
          <p><strong>账户余额:</strong>{{ user.golds }}</p>
          <p><strong>注册时间：</strong>{{ user.start_time }}</p>

          <div class="btn-group">
            <button class="main-btn" @click="startEdit">编辑资料</button>
            <button class="topup" @click="topup">卡密充值</button>
            <button class="logout-btn" @click="logout">退出登录</button>
            <button class="danger-btn" @click="removeUser">注销账号</button>
          </div>
        </div>

        <div v-else-if="topuping" class="edit-box">
          <input class="input" v-model="topupCode" placeholder="请输入充值卡密" />
          <div class="btn-group">
            <button class="main-btn" @click="submitTopup">确认充值</button>
            <button class="logout-btn" @click="cancelTopup">取消</button>
          </div>
        </div>

        <div v-else class="edit-box">
          <div class="avatar-edit-section">
            <img class="avatar" :src="editAvatar || defaultAvatar" />
            <label class="upload-label">
              更换头像
              <input type="file" accept="image/*" @change="handleFile" style="display:none" />
            </label>
          </div>

          <input class="input" v-model="editNickname" placeholder="请输入昵称" />
          <input class="input" v-model="editEmail" placeholder="请输入新的邮箱" />

          <div class="btn-group">
            <button class="main-btn" @click="saveInfo">保存全部修改</button>
            <button class="logout-btn" @click="cancelEdit">取消</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCropModal" class="crop-modal-overlay">
      <div class="crop-modal">
        <h3>裁剪头像</h3>
        <div class="cropper-wrapper">
          <img ref="imgRef" :src="imageURL" />
        </div>
        <div class="modal-btns">
          <button class="main-btn" @click="cropAndUpload" :disabled="uploading">
            {{ uploading ? "上传中..." : "确认并上传" }}
          </button>
          <button class="logout-btn" @click="cancelCrop">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from "vue";
import router from "@/router";
import { hasToken } from "@/store/auth";
import axios from "axios";

// 关于头像的裁剪，用全局变量放在index.html了
// import Cropper from "cropperjs";

// 用户数据
const user = ref(null);
const loading = ref(true);
const defaultAvatar = "/img/default.png";

// 状态控制
const editing = ref(false);
const topuping = ref(false);
const showCropModal = ref(false);
const uploading = ref(false);

// 表单数据
const editEmail = ref(""), editAvatar = ref(""), editNickname = ref(""), topupCode = ref("");

// 裁剪相关
const imageURL = ref(null);
const imgRef = ref(null);
const cropper = ref(null);
function initCropper() {
  if (!imgRef.value) return
  cropper.value = new Cropper(imgRef.value, {
    aspectRatio: 1,
    viewMode: 1
  })
}
onMounted(() => {
  getUserInfo();
});

async function getUserInfo() {
  const info = localStorage.getItem("userInfo");
  if (info) {
    user.value = JSON.parse(info);
  }
  loading.value = false;
}

function startEdit() {
  editing.value = true;
  editEmail.value = user.value.email;
  editAvatar.value = user.value.avatar_url;
  editNickname.value = user.value.nickname;
}

function cancelEdit() {
  editing.value = false;
}

// 1. 处理文件选择
function handleFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  imageURL.value = URL.createObjectURL(file);
  showCropModal.value = true;

  nextTick(() => {
    if (cropper.value) cropper.value.destroy();
    cropper.value = new Cropper(imgRef.value, {
      aspectRatio: 1, // 强制正方形
      viewMode: 1,
      background: false,
    });
  });
}

// 2. 确认裁剪并调用上传接口
async function cropAndUpload() {
  if (!cropper.value || uploading.value) return;
  uploading.value = true;

  // 获取裁剪后的 Canvas
  const canvas = cropper.value.getCroppedCanvas({
    width: 200,
    height: 200,
  });

  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append("file", blob, "avatar.jpg");
    formData.append("strategy_id", 1);

    try {
      const res = await axios.post(
        "http://image.wanli.zhiyuansofts.cn/api/v1/upload",
        formData
      );
      // 根据你提供的接口结构获取 URL
      if (res.data && res.data.data.links.url) {
        editAvatar.value = res.data.data.links.url;
        alert("图片上传成功，请点击下方保存按钮生效");
      }
      cancelCrop();
    } catch (err) {
      alert("上传失败，请稍后重试");
    } finally {
      uploading.value = false;
    }
  }, "image/jpeg");
}

function cancelCrop() {
  showCropModal.value = false;
  if (cropper.value) {
    cropper.value.destroy();
    cropper.value = null;
  }
}

async function saveInfo() {
  try {
    await axios.get("/api/editUser", {
      params: {
        id: user.value.id,
        email: editEmail.value,
        avatar_url: editAvatar.value,
        nickname: editNickname.value,
      },
    });
    user.value.email = editEmail.value;
    user.value.avatar_url = editAvatar.value;
    user.value.nickname = editNickname.value;
    localStorage.setItem("userInfo", JSON.stringify(user.value));
    alert("修改成功");
    editing.value = false;
  } catch (e) {
    alert("保存失败");
  }
}

// 其他原有函数 (logout, topup, removeUser, goHome...)
async function logout() {
  if (!confirm("确定要推出登陆账号吗？")) return;
  localStorage.removeItem("userInfo");
  hasToken.value = false;
  router.replace("/login");
}

function goHome() {
  router.push("/");
}

function topup() {
  topuping.value = true;
  topupCode.value = "";
}

function cancelTopup() {
  topuping.value = false;
}

async function submitTopup() {
  if (!topupCode.value) return alert("请输入卡密");
  try {
    const res = await axios.get("/api/topup", {
      params: { user_id: user.value.id, passwd: topupCode.value },
    });
    if (res.data.code === 200) {
      user.value.golds = res.data.data;
      localStorage.setItem("userInfo", JSON.stringify(user.value));
      topuping.value = false;
      alert("充值成功");
    } else {
      alert(res.data.msg);
    }
  } catch (e) {
    alert("充值失败");
  }
}

async function removeUser() {
  if (!confirm("确定要注销账号吗？此操作不可恢复！")) return;
  try {
    await axios.get("/api/remove", { params: { id: user.value.id } });
    localStorage.removeItem("userInfo");
    hasToken.value = false;
    router.replace("/login");
  } catch (e) {
    alert("注销失败");
  }
}
</script>

<style scoped>
.page-background {
  position: fixed;
  inset: 0;
  background-image: url("/img/background.png");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.page-background::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
}

.user-card {
  position: relative;
  width: 450px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  color: white;
  text-align: center;
}

.avatar-edit-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

.upload-label {
  margin-top: 8px;
  font-size: 14px;
  color: #74b9ff;
  cursor: pointer;
  text-decoration: underline;
}

.btn-group {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.main-btn { background: #ff7675; color: white; }
.topup { background: #a4d44a; color: white; }
.logout-btn { background: #636e72; color: white; }
.danger-btn { background: #d63031; color: white; }

.input {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  margin: 8px 0;
  box-sizing: border-box;
}

/* 裁剪弹窗专用样式 */
.crop-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.crop-modal {
  background: #2d3436;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.cropper-wrapper {
  width: 100%;
  height: 300px;
  background: #000;
  margin: 15px 0;
  overflow: hidden;
}

.cropper-wrapper img {
  max-width: 100%;
}

.modal-btns {
  display: flex;
  justify-content: space-around;
}
</style>