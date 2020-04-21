<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">商户账户变动记录</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.phoneId" placeholder="订单号或者用户ID" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.type" size="mini" placeholder="出入账类型">
                  <el-option value="+" label="入账(+)">入账(+)</el-option>
                  <el-option value="-" label="出账(-)">出账(-)</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.recordType" size="mini" placeholder="订单类型">
                  <el-option v-for="(value, key) in map.recordType" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item>
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
          <el-table-column align="center" label="订单号" prop="recordId" />
          <el-table-column align="center" label="用户ID" prop="userId" />
          <el-table-column align="center" label="操作前金额" prop="oldMoney">
            <template slot-scope="scope">
              <div>{{ $tool.division(scope.row.oldMoney) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="当前金额" prop="nowMoney">
            <template slot-scope="scope">
              <div>{{ $tool.division(scope.row.nowMoney) }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="变动金额">
            <template slot-scope="scope">
              {{ scope.row.type + $tool.division(scope.row.changeMoney) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="入账类型">
            <template slot-scope="scope">
              {{ map.recordType[scope.row.recordType] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注" prop="remark" />
          <el-table-column align="center" label="收益费率" prop="rateRatio" />
          <el-table-column align="center" label="添加时间" prop="createTime" />
          <el-table-column align="center" label="更新时间" prop="updateTime" />

        </el-table>

        <pagination
          :pager-size="mainTable.pager.size"
          :pager-index="mainTable.pager.index"
          :pager-total="mainTable.pager.total"
          @pagination-change="handlePagerChange"
        />
      </el-card>

    </div>
  </div>
</template>

<script>
import { getAccountLogList } from '@/api/account'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      map: {
        recordType: {
          0: '提现',
          1: '充值',
          2: '订单'
        }
      },
      getTreeData: '',
      mainTable: {
        loading: false,
        row: {},
        filter: {
          phoneId: '',
          type: '',
          recordType: '',
          time: []
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
        phoneId: this.mainTable.filter.phoneId,
        type: this.mainTable.filter.type,
        recordType: this.mainTable.filter.recordType,
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
      getAccountLogList(_form).then(response => {
        this.mainTable.pager.total = response.data || 0
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
