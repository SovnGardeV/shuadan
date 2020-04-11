<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">管理员列表</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.account" placeholder="手机号或账号" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.isSuperAdmin" size="mini" placeholder="是否为超级管理员" clearable>
                  <el-option v-for="(value, key) in map.isSuperAdmin" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.lockStatus" size="mini" placeholder="锁定状态" clearable>
                  <el-option v-for="(value, key) in map.lockStatus" :key="key" :value="key" :label="value">{{ value }}</el-option>
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
          <el-table-column align="center" label="账户" prop="account" />
          <!-- <el-table-column align="center" label="上次登录时间" prop="id" />
          <el-table-column align="center" label="最后登录城市" prop="id" /> -->
          <el-table-column align="center" label="超管">
            <template slot-scope="scope">
              {{ map.isSuperAdmin[scope.row.isSuperAdmin] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="角色" prop="id" />
          <el-table-column align="center" label="可用状态">
            <template slot-scope="scope">
              {{ map.lockStatus[scope.row.lockStatus] }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="添加时间" prop="createTime" />
          <el-table-column align="center" label="更新时间" prop="updateTime" />

          <el-table-column align="center" label="操作" width="240px" fixed="right">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="showPassword(scope.row)">删除</el-button>

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

      <el-dialog width="450px" center title="修改用户密码" :visible.sync="mainTable.dialogPasswordVisible">
        <el-form ref="form" size="mini" label-width="100px" :model="mainTable.passwordForm">
          <el-form-item label="手机号">
            <el-input v-model="mainTable.passwordForm.phone" disabled="" />
          </el-form-item>
          <el-form-item label="新登录密码">
            <el-row :gutter="10">
              <el-col :span="16">
                <el-input v-model="mainTable.passwordForm.password" />
              </el-col>
              <el-col :span="6">
                <el-button type="warning">生成密码</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="mainTable.dialogPasswordVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitForm">保 存</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getAdminList } from '@/api/admin'
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
        treeLoading: false,
        dialogPasswordVisible: false,
        dialogModifyVisible: false,
        dialogPermissionVisible: false,
        commercialRatio: 0,
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
    getMainTableData() {
      this.mainTable.loading = true
      const _form = {
        isSuperAdmin: this.mainTable.filter.isSuperAdmin,
        account: this.mainTable.filter.account,
        lockStatus: this.mainTable.filter.lockStatus,
        pageNo: this.mainTable.pager.index,
        pageSize: this.mainTable.pager.size
      }
      getAdminList(_form).then(response => {
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
