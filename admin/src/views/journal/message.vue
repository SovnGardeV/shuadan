<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">消息列表</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.title" placeholder="消息标题" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.sendType" clearable size="mini" placeholder="接收人类型">
                  <el-option v-for="(value, key) in map.sendType" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.messageType" clearable size="mini" placeholder="消息类型">
                  <el-option v-for="(value, key) in map.messageType" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.sendStatus" clearable size="mini" placeholder="推送状态">
                  <el-option v-for="(value, key) in map.sendStatus" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
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
          <el-table-column align="center" label="ID" prop="id" />
          <el-table-column align="center" label="标题" prop="title" />
          <el-table-column align="center" label="消息内容" prop="content" />
          <el-table-column align="center" label="接收人类型">
            <template slot-scope="scope">
              {{ map.sendType[scope.row.sendType] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="消息类型">
            <template slot-scope="scope">
              {{ map.messageType[scope.row.messageType] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="发送时间" prop="sendTime" />
          <el-table-column align="center" label="推送状态">
            <template slot-scope="scope">
              {{ map.sendStatus[scope.row.sendStatus] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="失败原因" prop="failedReason" />

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
import { getMessageList } from '@/api/journal'
import Pagination from '@/components/Pagination'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      map: {
        sendType: {
          user: '码商',
          merchant: '商户',
          full: '全平台'
        },
        messageType: {
          0: '提现',
          1: '充值',
          2: '订单',
          3: '系统公告'
        },
        sendStatus: {
          0: '未发送',
          1: '成功',
          2: '失败'
        }
      },
      getTreeData: '',
      mainTable: {
        loading: false,
        row: {},
        filter: {
          title: '',
          sendType: '',
          messageType: '',
          sendStatus: ''
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
        title: this.mainTable.filter.title,
        sendType: this.mainTable.filter.sendType,
        messageType: this.mainTable.filter.messageType,
        sendStatus: this.mainTable.filter.sendStatus,
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getMessageList(_form).then(response => {
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
