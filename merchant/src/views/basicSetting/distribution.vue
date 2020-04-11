<template>
  <div>
    <el-card style="width:80%; margin: 20px auto; max-width: 1024px">
      <div slot="header" class="clearfix">
        <span>码商分销管理</span>
      </div>
      <el-form size="mini" label-width="160px" label-position="left" style="padding:0 20px">
        <el-form-item label="分销开关">
          <el-switch
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>

        <el-row :gutter="10">
          <el-col :sm="24" :md="12">
            <el-form-item label="分销方式">
              <el-select>
                <el-option>1</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="分销等级">
              <el-select>
                <el-option>1</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :sm="24" :md="12">
            <el-form-item label="一级分销比例">
              <el-input>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="二级分销比例">
              <el-input>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :sm="24" :md="12">
            <el-form-item label="三级分销比例">
              <el-input>
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="12">
            <el-form-item label="分销收入转余额限制">
              <el-input>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
