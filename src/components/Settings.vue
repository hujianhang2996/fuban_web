<template>
    <el-form label-width="auto" style="margin: 30px; max-width: 600px;">
        <el-form-item label="Change user name">
            <el-input v-model="user_name">
                <template #append><el-button @click="changeUserName">Confirm</el-button></template>
            </el-input>
        </el-form-item>
        <el-form-item label="Change password">
        </el-form-item>
        <el-form-item label="Old password">
            <el-input type="password" v-model="old_password" show-password clearable />
        </el-form-item>
        <el-form-item label="New password">
            <el-input type="password" v-model="new_password" show-password clearable>
                <template #append><el-button @click="changePassword">Confirm</el-button></template>
            </el-input>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { store } from "../store"
import { ElMessage } from 'element-plus'
import JSEncrypt from 'jsencrypt'
const user_name = ref("")
const old_password = ref("")
const new_password = ref("")
const publicKey = `-----BEGIN RSA Public Key-----
MIIBCgKCAQEAu/mnwjPaOXez5iVqNHux3Q9ZHhdw1gaDudvurAeaWqIJpY1zyZrO
NL1MfkTuC8b8uUNLdHs6nr+6GhHNdyva1SO0wVJWfodoR9z7reyOv7PEQcYAHVeT
g2OTdrH3n5Yuw79VJYLuOhygYxKTapxgdzJQ6tHZn54Yqjvw69mCnQ5rGBVGCpS0
q67evYwRKYYu73U23E2ngdoo/v0mT98t0p7Z+L/Y+yEOk/AUbgk66qgb4rT3SWPP
ggKmQ1NOy1hzaOXl3we5PmQx8The8XTOQ+k+bx16rAjkoggXOfsxPpNqdtJv1Wd4
e7VmLyRGpWlol1TD38qIiBkHykScaI/HzwIDAQAB
-----END RSA Public Key-----`
onMounted(() => {
    store.post("/api/username", null, (resp) => user_name.value = resp.data.data)
})
function changeUserName() {
    if (user_name.value == "") return
    store.post("/api/set/username", { username: user_name.value }, (resp) => ElMessage(resp.data))
}

function changePassword() {
    if (new_password.value == "") return
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    store.post("/api/set/password", { new: encryptor.encrypt(new_password.value), old: encryptor.encrypt(old_password.value) }, (resp) => ElMessage(resp.data))
    new_password.value = ""
    old_password.value = ""
}
</script>