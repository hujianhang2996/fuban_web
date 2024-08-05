<template>
    <el-row class="disks-child-card" :gutter="10" align="middle">
        <el-col v-for="disk in ws_5s.Disks" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <el-card>
                <template #header>
                    <el-row justify="space-between">
                        <el-col :span="20" style="font-weight: bold;"><el-text truncated>{{ disk.Name
                                }}</el-text></el-col>
                        <el-col :span="3" style="text-align: end;">{{ disk.Temp }}°C</el-col>
                    </el-row>
                </template>
                <el-progress :percentage="((disk.TotalSize - disk.UsedSize) / disk.TotalSize * 100)"
                    :format="(p) => `${p.toFixed(0)}%(${sizeFormatter(disk.TotalSize - disk.UsedSize, 'size')}/${sizeFormatter(disk.TotalSize, 'size')})`" />
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import { sizeFormatter } from '../utils.js'
export default {
    name: 'Disks',
    props: {
        ws_5s: Object
    },
    methods: {
        sizeFormatter: sizeFormatter
    }
}
</script>

<style type="text/css">
.disks-child-card .el-card {
    height: 110px;
    margin-bottom: 10px;
    position: relative;
}
</style>