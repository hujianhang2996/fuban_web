<template>
    <el-switch v-model="navs_editing"></el-switch>
    <el-row class="navs-child-card" :gutter="10" align="middle">
        <el-col v-for="nav in navs" :xs="12" :sm="8" :md="6" :lg="4" :xl="3">
            <el-card shadow="hover" style="position: relative;">
                <el-form inline>
                    <el-form-item style="margin-bottom: 0px;margin-right: 10px;">
                        <el-avatar :src="nav.icon" size="small" />
                    </el-form-item>
                    <el-form-item style="margin-bottom: 0px;">
                        <el-text truncated size="large">{{ nav.name }}</el-text>
                    </el-form-item>
                </el-form>
                <div v-if="navs_editing"
                    style="position: absolute; width: 100%; height: 100%; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(122, 122, 122, 0.8)">
                    <el-button type="primary"
                        style="position: absolute;top: 50%;left:20%;transform: translate(0, -50%);" circle><i
                            class="bi-list"></i></el-button>
                    <el-button type="danger"
                        style="position: absolute;top: 50%;right:20%;transform: translate(0, -50%);" circle><i
                            class="bi-trash"></i></el-button>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: 'Navs',
    props: {
        navs: Array,

    },
    data() {
        return { navs_editing: false }
    }
}
</script>

<style type="text/css">
.navs-child-card .el-card {
    margin-bottom: 10px;
}
</style>