<template>
    <el-form label-width="auto" style="margin-top: 25px;">
        <el-form-item label="Change user name" label-position="top" required error="user name must not be empty"
            :validate-status="user_name.trim() == '' ? 'error' : 'success'">
            <el-input v-model="user_name">
                <template #append><el-button @click="changeUserName">Confirm</el-button></template>
            </el-input>
        </el-form-item>
        <el-form-item label="Change password">
        </el-form-item>
        <el-form-item label="Old password" label-position="top">
            <el-input type="password" v-model="old_password" show-password clearable />
        </el-form-item>
        <el-form-item label="New password" label-position="top">
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

onMounted(() => {
    store.post("/api/username", null, (resp) => user_name.value = resp.data.data)
})
function changeUserName() {
    if (user_name.value.trim() == "") return
    store.post("/api/set/username", { username: user_name.value }, (resp) => ElMessage(resp.data))
}

function changePassword() {
    if (new_password.value.trim() == "") return
    let new_p = new_password.value
    let old_p = old_password.value
    store.post("/public_key", null, (response) => {
        const encryptor = new JSEncrypt()
        encryptor.setPublicKey(response.data.data)
        store.post("/api/set/password",
            { new: encryptor.encrypt(new_p), old: encryptor.encrypt(old_p) },
            (resp) => ElMessage(resp.data))
    })
    new_password.value = ""
    old_password.value = ""
}
</script>