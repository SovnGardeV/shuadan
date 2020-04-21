<template>
  <div class="app-container">
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
        <el-table-column align="center" label="订单ID" prop="orderId" />
        <el-table-column align="center" label="码商ID" prop="userId" />
        <el-table-column align="center" label="一级码商">
          <template slot-scope="scope">
            <div>ID：{{ scope.row.oneUserId }}</div>
            <div>收益：{{ $tool.division(scope.row.oneUserMoney) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="二级码商">
          <template slot-scope="scope">
            <div>ID：{{ scope.row.twoUserId }}</div>
            <div>收益：{{ $tool.division(scope.row.twoUserMoney) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="三级码商">
          <template slot-scope="scope">
            <div>ID：{{ scope.row.threeUserId }}</div>
            <div>收益：{{ $tool.division(scope.row.threeUserMoney) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="四级码商">
          <template slot-scope="scope">
            <div>ID：{{ scope.row.fourUserId }}</div>
            <div>收益：{{ $tool.division(scope.row.fourUserMoney) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="个人收益">
          <template slot-scope="scope">
            <div>{{ $tool.division(scope.row.proxyMoney) }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" />
        <el-table-column align="center" label="修改时间" prop="updateTime" />

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
import { getCommissionList } from '@/api/merchant'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      mainTable: {
        loading: false,
        row: {},
        filter: {
          accountNum: '',
          type: '',
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
    getMainTableData() {
      const self = this
      this.mainTable.loading = true
      const _form = {
        phoneId: this.$route.query.phoneId,
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
      getCommissionList(_form).then(response => {
        const { result } = response
        this.mainTable.pager.total = result.data || 0
        this.mainTable.array = result.records || []
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

<style lang="scss">

</style>
