<template>
  <div>
    <el-card style="width:80%; margin: 20px auto; max-width: 1024px">
      <div slot="header" class="clearfix">
        <span>网站基础建设</span>
      </div>
      <el-form size="mini" label-width="160px" label-position="left" style="padding:0 20px">
        <el-row :gutter="10">
          <el-col :sm="24" :md="12">
            <el-form-item label="网站名字">
              <el-input />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="网站域名">
              <el-input />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <el-col :sm="24" :md="12">
            <el-form-item label="商户注册默认组">
              <el-select>
                <el-option>1</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="码商注册默认组">
              <el-select>
                <el-option>1</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="谷歌口令开关">
          <el-switch
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="码商邀请注册">
          <el-switch
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="商户邀请注册">
          <el-switch
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <hr>
        <el-form-item label="随机支付金额">
          <el-switch
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="随机类型">
          <el-select>
            <el-option>1</el-option>
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :sm="24" :md="12">
            <el-form-item label="最大随机金额">
              <el-input>
                <template slot="append">分</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="最小随机金额">
              <el-input>
                <template slot="append">分</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <hr>
        <el-form-item label="DEMO默认收款商户">
          <el-input />
        </el-form-item>
        <el-button>保存</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
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
