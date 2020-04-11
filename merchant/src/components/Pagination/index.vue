<template>
  <div>
    <el-pagination
      class="table-pagination"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="pagerSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagerTotal"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    pagerSize: {
      type: Number,
      default: 10
    },
    pagerIndex: {
      type: Number,
      default: 1
    },
    pagerTotal: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pager: {
        index: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pager.size = val
      this.$emit('pagination-change', this.pager)
    },
    handleCurrentChange(val) {
      this.pager.index = val
      this.$emit('pagination-change', this.pager)
    }
  }
}
</script>

<style lang="scss" scope>
.table-pagination{
    margin-top: 20px;
    text-align: right;
    .el-pagination__total,.el-pagination__sizes{
        float: left;
    }
}

</style>
