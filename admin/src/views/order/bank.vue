<template>
  <div class="app-container">
    <el-card class="filter-container">
      <el-row>
        <el-col class="title-color" :span="6" style="line-height: 40px; font-weight: bold;">
          银行卡列表
        </el-col>
        <el-col :span="18">
          <el-form :inline="true" style="text-align:right">
            <el-form-item>
              <el-input v-model="mainTable.filter.name" placeholder="持卡人" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="mainTable.filter.account" placeholder="卡号" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="mainTable.filter.bankName" placeholder="银行名" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
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
      <el-row style="text-align: right;margin-bottom: 10px">
        <el-button type="primary" size="mini" @click="showDialog('add')">新增</el-button>
      </el-row>
      <el-table
        ref="mainTable"
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
        <!-- <el-table-column type="selection" /> -->
        <el-table-column align="center" label="持卡人" prop="name" />
        <el-table-column align="center" label="银行名" prop="bankName" />
        <el-table-column align="center" label="卡号" prop="account" />
        <el-table-column align="center" label="开户地址" prop="bankAddress" />
        <el-table-column align="center" label="创建时间" prop="createTime" />
        <el-table-column align="center" label="更新时间" prop="updateTime" />
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="(val) => {
                return changeStatus(val, scope.row.id)
              }"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" />
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="showDialog('edit', scope.row)">编辑</el-button>
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

    <el-dialog width="400px" center :title="mainTable.dialogTitle" :visible.sync="mainTable.dialogVisible">
      <el-form ref="form" size="mini" label-width="100px" :model="mainTable.statusForm" :rules="mainTable.formRules">
        <el-form-item label="银行名">
          <el-input v-model="mainTable.form.bankName" />
        </el-form-item>
        <el-form-item label="持卡人">
          <el-input v-model="mainTable.form.name" />
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="mainTable.form.account" />
        </el-form-item>
        <el-form-item label="开户地址">
          <el-input v-model="mainTable.form.bankAddress" />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="mainTable.form.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="mainTable.dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getBankList, bank } from '@/api/order'
import { handleCopyObject } from '@/utils/index'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      type: '',
      mainTable: {
        dialogVisible: false,
        dialogTitle: '新增银行卡',
        loading: false,
        filter: {
          name: '',
          account: '',
          bankName: ''
        },
        row: {},
        form: {
          bankName: '',
          name: '',
          account: '',
          bankAddress: '',
          remark: '',
          status: '',
          id: '',
          userId: localStorage.getItem('merchantId')
        },
        array: [],
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
      this.type = type
      if (type === 'add') {
        this.mainTable.dialogTitle = '新增银行卡'
        this.initForm(this.mainTable.form, 'form')
        this.mainTable.form.status = 0
      } else {
        this.mainTable.dialogTitle = '编辑银行卡'
        handleCopyObject(this.mainTable.form, item)
      }

      this.mainTable.dialogVisible = true

      this.$nextTick(_ => {
        if (this.$refs['form']) this.$refs.form.clearValidate()
      })
    },
    initForm(form, formName) {
      const keyNameArr = Object.keys(form)
      keyNameArr.forEach(item => {
        if (item !== 'userId') form[item] = ''
      })

      this.$nextTick(_ => {
        if (this.$refs[formName]) this.$refs[formName].clearValidate()
      })
    },
    getMainTableData() {
      this.mainTable.loading = true
      const _form = {
        name: this.mainTable.filter.name,
        account: this.mainTable.filter.account,
        bankName: this.mainTable.filter.bankName,
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getBankList(_form).then(response => {
        if (Array.isArray(response.rows)) {
          response.rows.forEach(item => {
            item.status = !!item.status
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
      const _form = {
        id,
        status: val ? 1 : 0
      }
      bank('edit', _form).then(response => {
        if (!response.success) {
          this.getMainTableData()
          return
        }
      })
    },
    handleSubmit() {
      this.mainTable.form.status = this.mainTable.form.status ? 1 : 0
      bank(this.type, this.mainTable.form).then(response => {
        if (!response.success) return

        this.$message.success(response.message)
        this.getMainTableData()
        this.mainTable.dialogVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
