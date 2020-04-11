<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">码商提现申请记录</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.commercialName" placeholder="手机号或账户ID" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="mainTable.filter.commercialNumber" placeholder="商户号" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-input v-model="mainTable.filter.commercialIphone" placeholder="手机号" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
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
        <el-table
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
          <el-table-column align="center" label="订单号" prop="orderId" />
          <el-table-column align="center" label="提现金额" prop="orderId" />
          <el-table-column align="center" label="手续费" prop="orderId" />
          <el-table-column align="center" label="实际到账" prop="orderId" />
          <el-table-column align="center" label="用户ID" prop="orderId" />
          <el-table-column align="center" label="收款银行" prop="orderId" />
          <el-table-column align="center" label="收款人" prop="orderId" />
          <el-table-column align="center" label="收款账号" prop="orderId" />
          <el-table-column align="center" label="银行流水单号" prop="orderId" />
          <el-table-column align="center" label="审核说明" prop="orderId" />
          <el-table-column align="center" label="状态" prop="orderId" />
          <el-table-column align="center" label="处理时间" prop="orderId" />
          <el-table-column align="center" label="添加时间" prop="orderId" />
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="showModify(scope.row)">处理</el-button>

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

      <el-dialog width="450px" center title="审核管理" :visible.sync="mainTable.dialogModifyVisible">
        <el-form ref="modifyForm" label-width="100px" size="mini" :model="mainTable.modifyForm">
          <el-form-item label="转账人姓名" />
          <el-form-item label="收款银行" />
          <el-form-item label="收款卡号" />
          <el-form-item label="提现金额" />
          <el-form-item label="手续费" />
          <el-form-item label="实际结算" />
          <el-form-item label="审核状态">
            <el-select>
              <el-option>待处理</el-option>
              <el-option>处理完成</el-option>
              <el-option>拒绝</el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getAccountList } from '@/api/account'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      getTreeData: '',
      mainTable: {
        loading: false,
        treeLoading: false,
        dialogPasswordVisible: false,
        dialogModifyVisible: false,
        dialogPermissionVisible: false,
        commercialRatio: 0,
        row: {},
        filter: {
          commercialName: '',
          commercialIphone: '',
          commercialNumber: ''
        },
        passwordForm: {
          newPassword: '',
          phone: ''
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
    showPassword() {
      this.mainTable.dialogPasswordVisible = true
    },
    showModify() {
      this.mainTable.dialogModifyVisible = true
    },
    getMainTableData() {
      const self = this
      this.mainTable.loading = true
      const _form = {
        userType: 0,
        accountNum: this.mainTable.filter.accountNum,
        type: this.mainTable.filter.type,
        openTime: (function() {
          if (Array.isArray(self.mainTable.filter.time) && self.mainTable.filter.time.length) {
            return self.mainTable.filter.time[0]
          } else {
            return ''
          }
        })(),
        endTime: (function() {
          if (Array.isArray(self.mainTable.filter.time) && self.mainTable.filter.time.length) {
            return self.mainTable.filter.time[1]
          } else {
            return ''
          }
        })(),
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getAccountList(_form).then(response => {
        this.mainTable.pager.total = response.total || 0
        this.mainTable.array = response.rows || []
      }).finally(_ => {
        this.mainTable.loading = false
      })
    },
    handlePagerChange(val) {
      this.mainTable.pager = val
      this.getMainTableData()
    }

  }
}
</script>
