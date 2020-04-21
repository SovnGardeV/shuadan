<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">提现取款记录
            <i :class="isShowing ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="cursor:pointer" @click="isShowing = !isShowing" />
          </el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.accountNum" placeholder="账目号" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
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
        <el-row>
          <el-collapse-transition>
            <div v-show="isShowing">
              <div style="padding: 10px 0">
                <el-tag v-for="(value, key) in result" :key="key" style="margin-right:5px;margin-bottom:5px;">
                  {{ key }}({{ value }})
                </el-tag>
              </div>
            </div>
          </el-collapse-transition>
        </el-row>
      </el-card>
      <el-card>
        <el-row style="margin-bottom:10px; text-align: right">
          <el-button type="primary" size="mini" @click="showDialog">提现申请</el-button>
        </el-row>
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
          <el-table-column align="center" label="操作前金额" prop="operationMoney">
            <template slot-scope="scope">
              <div>{{ $tool.division(scope.row.operationMoney) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="手续费" prop="serviceMoney">
            <template slot-scope="scope">
              <div>{{ $tool.division(scope.row.serviceMoney) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="实际金额" prop="actualMoney">
            <template slot-scope="scope">
              <div>{{ $tool.division(scope.row.actualMoney) }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="用户ID" prop="userId" /> -->
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

        </el-table>

        <pagination
          :pager-size="mainTable.pager.size"
          :pager-index="mainTable.pager.index"
          :pager-total="mainTable.pager.total"
          @pagination-change="handlePagerChange"
        />
      </el-card>

      <el-dialog width="450px" center title="提现申请" :visible.sync="mainTable.dialogVisible">
        <el-form ref="form" label-width="100px" size="mini" :model="mainTable.form">
          <el-form-item label="提现银行卡">
            <el-select v-model="mainTable.form.bankId" style="width:100%" @change="selectBank">
              <el-option v-for="item in bankList" :key="item.id" :value="item" :label="`${item.bankName}(${item.account})`">{{ item.bankName }}({{ item.account }})</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款人">
            <el-input v-model="mainTable.form.receiptName" disabled />
          </el-form-item>
          <el-form-item label="银行名">
            <el-input v-model="mainTable.form.receiptBank" disabled />
          </el-form-item>
          <el-form-item label="卡号">
            <el-input v-model="mainTable.form.bankNumber" disabled />
          </el-form-item>
          <el-form-item label="取款金额">
            <el-input v-model="mainTable.form.withMoney" type="number" />
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
import { getAccountList, getWithdraw } from '@/api/account'
import { withBalance, getBankList } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      isShowing: false,
      result: {},
      map: {
        status: {
          1: '待处理',
          2: '驳回',
          3: '通过'
        }
      },
      bankList: [],
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
          withMoney: '',
          receiptBank: '',
          receiptName: '',
          bankNumber: '',
          bankId: ''
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
    this.getBankList()
    this.getWithdraw()
    this.getMainTableData()
  },
  methods: {
    showDialog() {
      this.initForm(this.mainTable.form, 'form')
      this.mainTable.dialogVisible = true
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
    selectBank(val) {
      this.mainTable.form.bankNumber = val.account
      this.mainTable.form.receiptName = val.name
      this.mainTable.form.receiptBank = val.bankName
    },
    getWithdraw() {
      getWithdraw({ id: localStorage.getItem('merchantId') }).then(response => {
        const _map = {
          locationCash: '历史提现',
          todayCash: '今日提现',
          yesterdayCash: '昨日提现'
        }
        const _obj = {}

        for (const key in response.result || {}) {
          _obj[_map[key]] = response.result[key] || 0
        }
        this.result = _obj
      })
    },
    getBankList() {
      getBankList({
        userId: localStorage.getItem('merchantId'),
        status: 1
      }).then(response => {
        this.bankList = response.rows || []
      })
    },
    getMainTableData() {
      const self = this
      this.mainTable.loading = true
      const _form = {
        userType: 0,
        userId: localStorage.getItem('merchantId'),
        accountNum: this.mainTable.filter.accountNum,
        // type: this.mainTable.filter.type,
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
      withBalance({
        id: localStorage.getItem('merchantId'),
        withMoney: this.mainTable.form.withMoney * 100,
        receiptBank: this.mainTable.form.receiptBank,
        receiptName: this.mainTable.form.receiptName,
        bankNumber: this.mainTable.form.bankNumber
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
