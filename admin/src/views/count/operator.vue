<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">商户提现申请记录</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.commercialName" placeholder="手机号或账户ID" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <!-- <el-form-item>
                <el-select v-model="mainTable.filter.type" size="mini" placeholder="类型">
                  <el-option v-for="(value, key) in map.type" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-date-picker
                  v-model="mainTable.filter.time"
                  align="right"
                  size="mini"
                  :editable="false"
                  clearable
                  unlink-panels
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                />
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
          <el-table-column align="center" label="订单号" prop="id" />
          <el-table-column align="center" label="操作前金额">
            <template slot-scope="scope">
              {{ $tool.division(scope.row.operationMoney) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="手续费" prop="serviceMoney">
            <template slot-scope="scope">
              {{ $tool.division(scope.row.serviceMoney) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际金额" prop="actualMoney">
            <template slot-scope="scope">
              {{ $tool.division(scope.row.actualMoney) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="用户ID" prop="userId" />
          <el-table-column align="center" label="收款银行" prop="receiptBank" />
          <el-table-column align="center" label="收款人" prop="receiptName" />
          <el-table-column align="center" label="收款账号" prop="bankNumber" />
          <el-table-column align="center" label="银行流水单号" prop="bankNum" />
          <!-- <el-table-column align="center" label="审核说明" prop="orderId" /> -->
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              {{ map.status[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="处理时间" prop="updateTime" />
          <el-table-column align="center" label="添加时间" prop="createTime" />
          <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" :disabled="scope.row.status !== 1" @click="showModify(scope.row)">处理</el-button>

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

      <el-dialog width="450px" center title="审核管理" :visible.sync="mainTable.dialogVisible">
        <el-form ref="form" label-width="80px" size="mini" :model="mainTable.form">
          <el-form-item label="审核状态">
            <el-select v-model="mainTable.form.status">
              <el-option :value="3" label="通过">通过</el-option>
              <el-option :value="2" label="驳回">驳回</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="mainTable.form.remark" type="textarea" rows="4" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="mainTable.dialogVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getAccountList, auditWith } from '@/api/account'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      map: {
        status: {
          1: '待处理',
          2: '驳回',
          3: '通过'
        }
      },
      mainTable: {
        loading: false,
        dialogVisible: false,
        row: {},
        filter: {
          accountNum: '',
          type: '',
          time: []
        },
        form: {
          status: '',
          remark: ''
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
    showModify(item) {
      this.mainTable.row = item
      this.mainTable.dialogVisible = true
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
    handleSubmit() {
      auditWith({
        id: this.mainTable.row.id,
        status: this.mainTable.form.status,
        remark: this.mainTable.form.remark
      }).then(response => {
        if (response.code !== 200) return

        this.$message.success(response.message)
        this.mainTable.dialogVisible = false
        this.getMainTableData()
      })
    }
  }
}
</script>
