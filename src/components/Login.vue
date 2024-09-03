<template>
    <el-card class="login-card">
        <div class="unraid-saga"></div>
        <h1 style="position: absolute;width: 90%; left: 5%; margin: 20px; color: #FFF;">Fuban </h1>
        <div style="position: absolute;width: 90%;  top: 50%; left: 5%; transform: translate(0, -50%);">
            <el-form :model="login_data" size="large" label-width="auto" label-position="right" style="margin: 20px;">
                <el-form-item>
                    <el-input v-model="login_data.username" />
                </el-form-item>
                <el-form-item>
                    <el-input v-model="login_data.password" type="password" show-password />
                </el-form-item>
                <el-form-item style="text-align: end;">
                    <el-button type="primary" @click="onSubmit">login</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button text circle style="position: absolute;bottom: 20px;right: 20px;" @click="openGithub()"><i
                class="bi-github"></i></el-button>
    </el-card>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '../store'
import JSEncrypt from 'jsencrypt'

const login_data = ref({ username: 'admin', password: 'admin' })
const publicKey = `-----BEGIN RSA Public Key-----
MIIBCgKCAQEAu/mnwjPaOXez5iVqNHux3Q9ZHhdw1gaDudvurAeaWqIJpY1zyZrO
NL1MfkTuC8b8uUNLdHs6nr+6GhHNdyva1SO0wVJWfodoR9z7reyOv7PEQcYAHVeT
g2OTdrH3n5Yuw79VJYLuOhygYxKTapxgdzJQ6tHZn54Yqjvw69mCnQ5rGBVGCpS0
q67evYwRKYYu73U23E2ngdoo/v0mT98t0p7Z+L/Y+yEOk/AUbgk66qgb4rT3SWPP
ggKmQ1NOy1hzaOXl3we5PmQx8The8XTOQ+k+bx16rAjkoggXOfsxPpNqdtJv1Wd4
e7VmLyRGpWlol1TD38qIiBkHykScaI/HzwIDAQAB
-----END RSA Public Key-----`
function onSubmit() {
    const encryptor = new JSEncrypt()
    encryptor.setPublicKey(publicKey)
    store.post("/login",
        {
            username: encryptor.encrypt(login_data.value.username),
            password: encryptor.encrypt(login_data.value.password)
        }, (response) => {
            ElMessage(response.data)
            if (response.data.type == 'success') {
                localStorage.setItem('token', response.data.token)
                store.auth()
            } else {
                store.unauth()
            }
        })
}

function openGithub() {
    window.open('https://github.com/hujianhang2996')
}

// export default {
//     name: 'Login',
//     props: {
//         isMobile: false,
//     },
//     data() {
//         return {
//             login_data: { user: '', password: '' }
//         }
//     },
//     methods: {

//     }
// }
</script>

<style type="text/css">
@media (max-width: 600px) {
    .login-card {
        width: 300px;
    }
}

@media (min-width: 600px) {
    .login-card {
        width: 400px;
    }
}

.login-card {
    position: absolute;
    height: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


.unraid-saga {
    background: -webkit-gradient(linear, left top, right top, from(hsl(213, 100%, 63%)), to(hsl(213, 75%, 73%)));
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    height: 110px;
    transform: skewY(-6deg) translateY(-30px);
}
</style>