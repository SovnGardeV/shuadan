<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">产品管理</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.name" placeholder="产品名" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.status" clearable size="mini" placeholder="上下架状态">
                  <el-option v-for="(value, key) in map.status" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="mainTable.pager.index = 1;getMainTableData()">
                  <i class="el-icon-search" />
                </el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row style="margin-bottom: 10px;text-align:right">
          <el-button size="mini" type="primary" @click="showDialog('add')">新增</el-button>
          <!-- <el-button size="mini" type="danger" @click="deleteProduct">删除</el-button> -->
        </el-row>
        <el-table
          ref="multipleTable"
          v-loading="mainTable.loading"
          class=""
          :data="mainTable.array"
          element-loading-text="加载中，请稍候"
          element-loading-spinner="el-icon-loading"
          border
          stripe
          fit
          highlight-current-row
        >
          <!-- <el-table-column align="center" type="selection" /> -->
          <el-table-column align="center" label="ID" prop="id" />
          <el-table-column align="center" label="产品名" prop="name" />
          <el-table-column align="center" label="小图标/大图标">
            <template slot-scope="scope">
              <el-popover
                placement="right"
                trigger="click"
              >
                <span slot="reference" class="title-color" style="cursor:pointer">查看</span>
                <el-image :src="scope.row.icon" style="width:100px;height:100px" />
              </el-popover>
              /
              <el-popover
                placement="right"
                trigger="click"
              >
                <span slot="reference" class="title-color" style="cursor:pointer">查看</span>
                <el-image :src="scope.row.bigIcon" style="width:100px;height:100px" />
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column align="center" label="产品描述" prop="shopDescribe" />
          <el-table-column align="center" label="利润" prop="profit" />
          <el-table-column align="center" label="价格" prop="price" />
          <el-table-column align="center" label="上下架状态">
            <template slot-scope="scope">
              <div>
                <el-switch
                  v-model="scope.row.statusIsTrue"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="(val) => {
                    return changeStatus(val, scope.row.id)
                  }"
                /></div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="160px">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showDialog('edit', scope.row)">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

        <pagination
          :pager-size="mainTable.pager.size"
          :pager-index="mainTable.pager.index"
          :pager-total="mainTable.pager.total"
          @pagination-change="handlePagerChange"
        />
      </el-card>

      <el-dialog width="450px" center :title="mainTable.dialogTitle" :visible.sync="mainTable.dialogVisible">
        <el-form ref="form" size="mini" label-width="100px" :model="mainTable.form">
          <el-form-item label="产品名">
            <el-input v-model="mainTable.form.name" />
          </el-form-item>
          <el-form-item label="小图标/大图标">
            <el-upload
              v-loading="uploadLoadingSmall"
              style="width:100px;height:100px;display:inline-block"
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="(file) => {
                return handleUploadPicture(file, 'icon', 'uploadLoadingSmall')
              }"
            >
              <img v-if="mainTable.form.icon" :src="mainTable.form.icon" class="avatar" style="width:100px;height:100px">
              <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px;height:100px;line-height:100px !important" />
            </el-upload>
            <el-upload
              v-loading="uploadLoadingBig"
              style="width:100px;height:100px;display:inline-block"
              class="avatar-uploader"
              action=""
              :show-file-list="false"
              :before-upload="(file) => {
                return handleUploadPicture(file, 'bigIcon', 'uploadLoadingBig')
              }"
            >
              <img v-if="mainTable.form.bigIcon" :src="mainTable.form.bigIcon" class="avatar" style="width:100px;height:100px">
              <i v-else class="el-icon-plus avatar-uploader-icon" style="width:100px;height:100px;line-height:100px !important" />
            </el-upload>
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input v-model="mainTable.form.shopDescribe" />
          </el-form-item>
          <el-form-item label="可分佣金额">
            <el-input v-model="mainTable.form.profit" type="number" />
          </el-form-item>
          <el-form-item label="特供价">
            <el-input v-model="mainTable.form.specialPrice" type="number" />
          </el-form-item>
          <el-form-item label="售价">
            <el-input v-model="mainTable.form.price" type="number" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="mainTable.dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmit(mainTable.dialogType)">保 存</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getProductList, changeStatus, deleteProduct, editProduct, addProduct } from '@/api/product'
import { uploadPicture } from '@/api/qrCode'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      uploadLoadingSmall: false,
      uploadLoadingBig: false,
      map: {
        status: {
          0: '下架',
          1: '上架'
        }
      },
      getTreeData: '',
      mainTable: {
        loading: false,
        dialogVisible: false,
        dialogTitle: '新增产品',
        dialogType: 'add',
        selectedArray: [],
        row: {},
        filter: {
          name: '',
          status: ''
        },
        form: {
          name: '',
          icon: '',
          bigIcon: '',
          status: 1,
          shopDescribe: '',
          profit: 0,
          specialPrice: 0,
          price: 0
        },
        array: [],
        tree: [],
        defaultMenu: [],
        pager: {
          index: 1,
          total: 0,
          size: 10
        }
      }
    }
  },
  created() {
    this.getMainTableData()
  },
  methods: {
    showDialog(type, item) {
      if (type === 'add') {
        this.initForm(this.mainTable.form, 'form')
        this.mainTable.dialogTitle = '新增产品'
      } else {
        Object.assign(this.mainTable.form, item)
        this.mainTable.row = item
        this.mainTable.dialogTitle = '编辑产品'
      }
      this.mainTable.dialogType = type
      this.mainTable.dialogVisible = true
    },
    handleUploadPicture(file, key, loading) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('imgType', 1)
      this[loading] = true

      uploadPicture(formData).then(response => {
        this.mainTable.form[key] = response.result
      }).finally(_ => {
        this[loading] = false
      })
    },
    handleSelectionChange(val) {
      this.mainTable.selectedArray = val
    },
    selectRow(row) {
      this.$refs['multipleTable'].toggleRowSelection(row)
    },
    initForm(form, formName) {
      const keyNameArr = Object.keys(form)
      keyNameArr.forEach(item => {
        if (item !== 'status') form[item] = ''
      })

      this.$nextTick(_ => {
        this.$refs[formName].clearValidate()
      })
    },
    showPassword() {
      this.initForm(this.mainTable.passwordForm, 'passwordForm')
      this.mainTable.dialogPasswordVisible = true
    },
    showModify() {
      this.mainTable.dialogModifyVisible = true
    },
    getMainTableData() {
      this.mainTable.loading = true
      const _form = {
        name: this.mainTable.filter.name,
        status: this.mainTable.filter.status,
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getProductList(_form).then(response => {
        if (Array.isArray(response.rows)) {
          response.rows.forEach(item => {
            item.statusIsTrue = !!item.status
          })
        }
        this.mainTable.pager.total = response.data || 0
        this.mainTable.array = response.rows || []
      }).finally(_ => {
        this.mainTable.loading = false
      })
    },
    handlePagerChange(val) {
      this.mainTable.pager = val
      this.getMainTableData()
    },
    changeStatus(val, id) {
      changeStatus({
        ids: id,
        status: val ? 1 : 0
      }).then(response => {
        if (response.code !== 200) {
          this.getMainTableData()
          return
        }
      })
    },
    deleteProduct(id) {
      // if (!this.mainTable.selectedArray.length) {
      //   this.$message({
      //     type: 'info',
      //     message: '请选择要删除的产品'
      //   })
      //   return
      // }
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        deleteProduct({ id }).then(response => {
          if (response.code !== 200) return
          this.$message.success(response.message)
          this.getMainTableData()
        })
      })
    },
    handleSubmit(type) {
      const typeMap = {
        add: addProduct,
        edit: editProduct
      }
      const _form = {
        id: type === 'edit' ? this.mainTable.row.id : undefined
      }
      Object.assign(_form, this.mainTable.form)

      typeMap[type](_form).then(response => {
        if (response.code !== 200) return

        this.$message.success(response.message)
        this.getMainTableData()
        this.mainTable.dialogVisible = false
      })
    }

  }
}
</script>
