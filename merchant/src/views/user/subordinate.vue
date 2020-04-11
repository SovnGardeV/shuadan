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
        <el-table-column align="center" label="手机号" prop="phone" />
        <el-table-column align="center" label="联系微信" prop="wechat" />
        <el-table-column align="center" label="注册时间" prop="registerTime" />
        <el-table-column align="center" label="账号状态" prop="status" />
        <el-table-column align="center" label="上次登录时间" prop="lastTime" />
        <el-table-column align="center" label="代理等级" prop="proxyLevel" />
        <el-table-column align="center" label="接单状态" prop="receiptStatus" />

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
import { getSubordinateList } from '@/api/merchant'
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
        startTime: (function() {
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
      getSubordinateList(_form).then(response => {
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
