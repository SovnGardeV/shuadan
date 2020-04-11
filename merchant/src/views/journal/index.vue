<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">日志列表</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.account" placeholder="用户名" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
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
        <el-tabs @tab-click="changeTabs">
          <el-tab-pane label="登录日志">
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
              <el-table-column align="center" label="日志内容" prop="logContent" />
              <el-table-column align="center" label="操作类型">
                <template slot-scope="scope">
                  {{ map.operateType[scope.row.operateType] }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="登录账号" prop="account" />
              <el-table-column align="center" label="登录账号类型" prop="userType" />
              <!-- <el-table-column align="center" label="操作系统" prop="os" /> -->
              <el-table-column align="center" label="操作时间" prop="createTime" />
            </el-table>

            <pagination
              :pager-size="mainTable.pager.size"
              :pager-index="mainTable.pager.index"
              :pager-total="mainTable.pager.total"
              @pagination-change="handlePagerChange"
            />
          </el-tab-pane>
          <el-tab-pane label="操作日志">
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
              <el-table-column align="center" label="日志内容" prop="logContent" />
              <el-table-column align="center" label="操作类型" prop="name">
                <template slot-scope="scope">
                  {{ map.operateType[scope.row.operateType] }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="登录账号" prop="account" />
              <el-table-column align="center" label="登录账号类型" prop="userType" />
              <el-table-column align="center" label="操作时间" prop="createTime" />

            </el-table>

            <pagination
              :pager-size="mainTable.pager.size"
              :pager-index="mainTable.pager.index"
              :pager-total="mainTable.pager.total"
              @pagination-change="handlePagerChange"
            />
          </el-tab-pane>
        </el-tabs>
      </el-card>

    </div>
  </div>
</template>

<script>
import { getJournalList } from '@/api/journal'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      map: {
        operateType: {
          1: '查询',
          2: '添加',
          3: '修改',
          4: '删除',
          5: '导入',
          6: '导出'
        }
      },
      getTreeData: '',
      mainTable: {
        loading: false,
        row: {},
        filter: {
          account: '',
          logType: 1
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
    changeTabs(e) {
      const _map = {
        '登录日志': 1,
        '操作日志': 2
      }
      this.mainTable.filter.logType = _map[e.label]
      this.getMainTableData()
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
    showPassword() {
      this.initForm(this.mainTable.passwordForm, 'passwordForm')
      this.mainTable.dialogPasswordVisible = true
    },
    showModify() {
      this.mainTable.dialogModifyVisible = true
    },
    getMainTableData() {
      this.mainTable.loading = true
      const _form = {
        account: this.mainTable.filter.account,
        logType: this.mainTable.filter.logType,
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getJournalList(_form).then(response => {
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
