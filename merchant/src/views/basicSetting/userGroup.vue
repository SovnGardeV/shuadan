<template>
  <div>
    <el-card style="width:60%; margin: 20px auto; max-width: 1024px">
      <div slot="header" class="clearfix">
        <span>用户组设置</span>
      </div>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card>
            <div slot="header" class="clearfix">
              <span>码商用户组</span>
            </div>
            <el-form size="mini">
              <el-form-item v-for="item in user" :key="item.id" :label="item.groupName">
                <el-input v-model="item.defaultPer" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div slot="header" class="clearfix">
              <span>商户用户组</span>
            </div>
            <el-form size="mini">
              <el-form-item v-for="item in merchant" :key="item.id" :label="item.groupName">
                <el-input v-model="item.defaultPer" />
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
      <div style="margin-top:20px;text-align:center">
        <el-button type="primary" size="small" @click="saveGroup">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGroup, saveGroup } from '@/api/admin'

export default {
  data() {
    return {
      user: [],
      merchant: []
    }
  },
  created() {
    this.getMainData()
  },
  methods: {
    getMainData() {
      getGroup().then(response => {
        this.user = []
        this.merchant = []
        if (Array.isArray(response.rows)) {
          response.rows.forEach(item => {
            if (item.type === 1) {
              this.user.push(item)
            } else {
              this.merchant.push(item)
            }
          })
        }
      })
    },
    saveGroup() {
      const _data = this.user.concat(this.merchant)
      saveGroup({ listStr: JSON.stringify(_data) }).then(response => {
        if (!response.success) return

        this.$message.success(response.message)
        this.getMainData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 18px;
}
.el-input{
    max-width: 178px;
}
hr{
    margin-bottom: 18px;
}
</style>
