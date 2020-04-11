<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">商户邀请码</el-col>
        </el-row>
      </el-card>
      <el-card>
        <el-row style="text-align:right;margin-bottom: 10px">
          <el-button size="mini" type="primary" @click="batchCreateCode">批量生成</el-button>
          <el-button size="mini" type="danger" @click="batchDeleteCode">批量删除</el-button>
        </el-row>
        <el-table
          ref="multipleTable"
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
          @row-click="selectRow"
        >
          <el-table-column align="center" type="selection" />
          <el-table-column align="center" label="ID" prop="id" />
          <el-table-column align="center" label="关联用户" prop="merchantId" />
          <el-table-column align="center" label="邀请码" prop="code" />
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
import { batchCreateCode, getCodeList, batchDeleteCode } from '@/api/admin'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      map: {
        isSuperAdmin: {
          1: '是',
          2: '否'
        },
        lockStatus: {
          0: '锁定',
          1: '正常'
        }
      },
      getTreeData: '',
      mainTable: {
        loading: false,
        selectedArray: [],
        row: {},
        filter: {
          phoneId: '',
          practiceStatus: '',
          userStatus: '',
          receiptStatus: '',
          time: []
        },
        modifyForm: {
          operator_type: '',
          value: '',
          remark: ''
        },
        passwordForm: {
          newPassword: '',
          phone: ''
        },
        array: [],
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
    handleSelectionChange(val) {
      this.mainTable.selectedArray = val
    },
    selectRow(row) {
      this.$refs['multipleTable'].toggleRowSelection(row)
    },
    batchCreateCode() {
      batchCreateCode().then(response => {
      })
    },
    batchDeleteCode() {
      if (!this.mainTable.selectedArray.length) {
        this.$message({
          type: 'info',
          message: '请选择要删除的邀请码'
        })
        return
      }

      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(_ => {
        let ids = []
        this.mainTable.selectedArray.forEach(item => {
          ids.push(item.id)
        })
        ids = ids.join(',')
        batchDeleteCode({ ids }).then(response => {
          if (response.code !== 200) return
          this.$message.success(response.message)
          this.getMainTableData()
        })
      })
    },
    initForm(form, formName) {
      const keyNameArr = Object.keys(form)
      keyNameArr.forEach(item => {
        form[item] = ''
      })

      this.$nextTick(_ => {
        this.$refs[formName].clearValidate()
      })
    },
    getMainTableData() {
      this.mainTable.loading = true
      const _form = {
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getCodeList(_form).then(response => {
        const { result } = response
        this.mainTable.pager.total = result.total || 0
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
