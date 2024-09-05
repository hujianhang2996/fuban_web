<template>
    <h3>Array</h3>
    <el-row class="disks-child-card" :gutter="10" align="middle">
        <el-col v-for="disk in array_disks" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <el-card>
                <template #header>
                    <el-row justify="space-between">
                        <el-col :span="20"><el-text style="font-weight: bold;" truncated>{{ disk.Name }}
                            </el-text>
                            <br>
                            <el-text truncated>{{ disk.Path }}
                            </el-text>
                        </el-col>
                        <el-col :span="3" style="text-align: end;">{{ disk.Temp }}°C</el-col>
                    </el-row>
                </template>
                <el-row justify="space-evenly" :gutter="10" align="middle">
                    <el-col :span="10">
                        <el-text truncated>
                            R:{{ disk.ReadCount }}/W:{{ disk.WriteCount }}
                        </el-text>
                    </el-col>
                    <el-col :span="14" style="text-align: right;">
                        <el-progress style="width: 60%;margin-left: 40%;"
                            :percentage="(disk.UsedSize / (disk.TotalSize <= 0 ? 1 : disk.TotalSize) * 100)"
                            :format="(p) => p.toFixed(0) + '%'" />
                    </el-col>
                </el-row>
                <el-text>{{ `(${sizeFormatter(disk.TotalSize -
                    disk.UsedSize,
                    'size')} ava, total ${sizeFormatter(disk.TotalSize,
                        'size')})` }}</el-text>
            </el-card>
        </el-col>
    </el-row>
    <h3>Others</h3>
    <el-row class="disks-child-card" :gutter="10" align="middle">
        <el-col v-for="disk in nonarray_disks" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <el-card>
                <template #header>
                    <el-row justify="space-between">
                        <el-col :span="20"><el-text style="font-weight: bold;" truncated>{{ disk.Name }}
                            </el-text>
                            <br>
                            <el-text truncated>{{ disk.Path }}
                            </el-text>
                        </el-col>
                        <el-col :span="3" style="text-align: end;">{{ disk.Temp }}°C</el-col>
                    </el-row>
                </template>
                <el-row justify="space-evenly" :gutter="10" align="middle">
                    <el-col :span="10">
                        <el-text truncated>
                            R:{{ disk.ReadCount }}/W:{{ disk.WriteCount }}
                        </el-text>
                    </el-col>
                    <el-col :span="14" style="text-align: right;">
                        <el-progress style="width: 60%;margin-left: 40%;"
                            :percentage="(disk.UsedSize / (disk.TotalSize <= 0 ? 1 : disk.TotalSize) * 100)"
                            :format="(p) => p.toFixed(0) + '%'" />
                    </el-col>
                </el-row>

                <el-text truncated>{{ `(${sizeFormatter(disk.TotalSize -
                    disk.UsedSize,
                    'size')} ava, total ${sizeFormatter(disk.TotalSize,
                        'size')})` }}</el-text>
            </el-card>
        </el-col>
    </el-row>
</template>

<script setup>
import { computed } from 'vue'
import { store } from '../store.js'
import { sizeFormatter } from '../utils.js'

const array_disks = computed(() => {
    var res = []
    for (var i in store.ws_5s.Disks) {
        if (store.ws_5s.Disks[i].MD) {
            res.push(store.ws_5s.Disks[i])
        }
    }
    return res
})

const nonarray_disks = computed(() => {
    var res = []
    for (var i in store.ws_5s.Disks) {
        if (!store.ws_5s.Disks[i].MD) {
            res.push(store.ws_5s.Disks[i])
        }
    }
    return res
})
</script>

<style type="text/css">
.disks-child-card .el-card {
    height: 150px;
    margin-bottom: 10px;
    position: relative;
}

.disks-child-card .el-card__header {
    padding: 8px 18px;
}
</style>