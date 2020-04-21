<template>
  <div class="app-container">
    <el-card class="filter-container">
      <el-row>
        <el-col class="title-color" :span="6" style="line-height: 40px; font-weight: bold;">
          平台订单记录
          <i :class="isShowing ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" style="cursor:pointer" @click="isShowing = !isShowing" />
        </el-col>
        <el-col :span="18">
          <el-form :inline="true" style="text-align:right">
            <el-form-item>
              <el-input v-model="mainTable.filter.number" placeholder="订单号或用户id" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="mainTable.filter.orderStatus" size="mini" placeholder="订单状态">
                <el-option v-for="(value, key) in map.orderStatus" :key="key" :value="key" :label="value">{{ value }}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-select v-model="mainTable.filter.pay_status" size="mini" placeholder="是否正常回调">
                <el-option v-for="(value, key) in map.orderStatus" :key="key" :value="key" :label="value">{{ value }}</el-option>
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
              <el-tag>今日订单额 (0)</el-tag>
              <el-tag>今日订单额 (0)</el-tag>
              <el-tag>今日订单额 (0)</el-tag>
              <el-tag>今日订单额 (0)</el-tag>
              <el-tag>今日订单额 (0)</el-tag>
              <el-tag>今日订单额 (0)</el-tag>
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
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column type="selection" /> -->
        <el-table-column align="center" label="渠道信息" prop="orderId" />
        <el-table-column align="center" label="订单号">
          <template slot-scope="scope">
            <div class="over-hide" :title="`订单号:${scope.row.orderId}`">订单号:{{ scope.row.orderId }}</div>
            <div class="over-hide" :title="`外部订单号:${scope.row.outId}`">外部订单号:{{ scope.row.outId }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户ID">
          <template slot-scope="scope">
            <div class="over-hide">码商ID:{{ scope.row.userId }}</div>
            <div class="over-hide">商户ID:{{ scope.row.merchantId }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收款金额" prop="earnMonry" />
        <el-table-column align="center" label="收益">
          <template slot-scope="scope">
            <div>平台:{{ $tool.division(scope.row.merchantEarn) }}</div>
            <div>码商:{{ $tool.division(scope.row.userEarn ) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="确认方式">
          <template slot-scope="scope">
            {{ map.userPassType[scope.row.userPassType] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <div>{{ map.orderStatus[scope.row.orderStatus] }}</div>
            <div>{{ map.payStatus[scope.row.payStatus] }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="异常单">
          <template slot-scope="scope">
            {{ map.isUnusual[scope.row.isUnusual] }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="利润概况">
          <template slot-scope="scope">
            <div>平台利润比:{{ scope.row.platRatio }}</div>
            <div>代理分润:{{ scope.row.agencyRatio }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="回调次数" prop="backNum" />
        <el-table-column align="center" label="订单时间" prop="orderTime" />
        <el-table-column align="center" label="打款时间" prop="remitTime" />
        <el-table-column align="center" label="回调时间" prop="backTime" />
        <el-table-column align="center" label="过期时间" prop="pastTime" />
        <el-table-column align="center" label="备注" prop="remark" />
        <el-table-column align="center" label="操作" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.payStatus" size="mini" type="primary" @click="confirmOrder(scope.row.orderId, 1)">通过</el-button>
            <el-popover
              placement="top-end"
              trigger="click"
            >
              <el-button slot="reference" :disabled="scope.row.payStatus" size="mini" type="danger" @click="mainTable.form.remark = '';mainTable.row = scope.row">驳回</el-button>
              <el-input v-model="mainTable.form.remark" placeholder="请输入理由" size="mini" type="textarea" :rows="2" />
              <el-button type="text" size="mini" style="float:right" @click="confirmOrder(mainTable.row.orderId, 0)">确定</el-button>
            </el-popover>
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
  </div>
</template>

<script>
import { getOrderList, affirmOrder, staticOrder } from '@/api/order'
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
  },
  methods: {
    getStaticOrderInfo() {
      staticOrder().then(response => {
        this.mainTable.result = response.result
      })
    },
    getMainTableData() {
      const self = this
      this.mainTable.loading = true
      const _form = {
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
