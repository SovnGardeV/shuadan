<template>
  <div class="app-container">
    <el-card class="filter-container">
      <el-row>
        <el-col class="title-color" :span="6" style="line-height: 40px; font-weight: bold;">
          抢单记录
          <i :class="isShowing ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="cursor:pointer" @click="isShowing = !isShowing" />
        </el-col>
        <el-col :span="18">
          <el-form :inline="true" style="text-align:right">
            <el-form-item>
              <el-input v-model="mainTable.filter.number" placeholder="订单号" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="mainTable.filter.pay_status" size="mini" placeholder="是否正常回调">
                <el-option v-for="(value, key) in map.payStatus" :key="key" :value="key" :label="value">{{ value }}</el-option>
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
      <el-row>
        <el-collapse-transition>
          <div v-show="isShowing">
            <div style="padding: 10px 0">
              <el-tag v-for="(value, key) in mainTable.result" :key="key" style="margin-right:5px;margin-bottom:5px;">
                {{ key }}({{ value }})
              </el-tag>
            </div>
          </div>
        </el-collapse-transition>
      </el-row>
    </el-card>

    <el-card>
      <!-- <el-button type="primary" size="mini" @click="confirmOrder">确认订单</el-button>
      <el-button size="mini">取消订单</el-button> -->
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
        <!-- <el-table-column align="center" label="渠道信息" prop="orderId" /> -->
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <div class="over-hide" :title="`订单号:${scope.row.orderId}`">订单号:{{ scope.row.orderId }}</div>
            <div class="over-hide" :title="`外部订单号:${scope.row.outId}`">外部订单号:{{ scope.row.outId }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额" prop="earnMonry">
          <template slot-scope="scope">
            <div>{{ $tool.division(scope.row.earnMonry) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="确认方式">
          <template slot-scope="scope">
            {{ map.userPassType[scope.row.userPassType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否正常回调">
          <template slot-scope="scope">
            <!-- <div>{{ map.orderStatus[scope.row.orderStatus] }}</div> -->
            <div>{{ map.payStatus[scope.row.payStatus] }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款时间" prop="remitTime" />
        <el-table-column align="center" label="回调次数" prop="backNum" />
        <el-table-column align="center" label="回调时间" prop="backTime" />
        <!-- <el-table-column align="center" label="过期时间" prop="pastTime" /> -->
        <el-table-column align="center" label="备注" prop="remark" />

      </el-table>

      <pagination
        :pager-size="mainTable.pager.size"
        :pager-index="mainTable.pager.index"
        :pager-total="mainTable.pager.total"
        @pagination-change="handlePagerChange"
      />
    </el-card>
  </div>
</template>

<script>
import { getOrderList, getOrderInfo, affirmOrder } from '@/api/order'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      isShowing: false,
      map: {
        userPassType: {
          0: '手动确认',
          1: '后台确认'
        },
        payType: {
          0: '未操作',
          1: '确认支付'
        },
        orderStatus: {
          0: '未支付',
          1: '已支付',
          2: '过期'
        },
        payStatus: {
          0: '未回调',
          1: '已回调'
        },
        isUnusual: {
          0: '否',
          1: '是'
        }
      },
      mainTable: {
        result: {},
        loading: false,
        filter: {
          number: '',
          orderStatus: '',
          pay_status: '',
          time: []
        },
        row: {},
        form: {
          remark: ''
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
    this.getOrderInfo()
  },
  methods: {
    getOrderInfo() {
      getOrderInfo({
        id: localStorage.getItem('merchantId')
      }).then(response => {
        const _map = {
          money: '总金额',
          num: '总订单数',
          userprofit: '总利润',
          todayMoney: '今日金额',
          todayNum: '今日订单数',
          todayProfit: '今日利润',
          yesterdayMoney: '昨日金额',
          yesterdayProfit: '昨日利润',
          yesterdayNum: '昨日订单数'
        }
        const _obj = {}

        for (const key in response.result) {
          _obj[_map[key]] = this.$tool.division(response.result[key]) || 0
        }
        this.mainTable.result = _obj
      })
    },
    getMainTableData() {
      const self = this
      this.mainTable.loading = true
      const _form = {
        userId: localStorage.getItem('merchantId'),
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
        number: this.mainTable.filter.number,
        orderStatus: this.mainTable.filter.orderStatus,
        pay_status: this.mainTable.filter.pay_status,
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getOrderList(_form).then(response => {
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
    confirmOrder(id, confirm) {
      const _form = {
        id,
        orderStatus: confirm ? 1 : 3,
        payStatus: confirm ? 1 : 0,
        remark: this.mainTable.form.remark
      }

      affirmOrder(_form).then(response => {
        if (!response.success) return

        this.$message.success(response.message)
        this.getMainTableData()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 0;
}
</style>
