<template>
  <div class="full-height">
    <div class="app-container">
      <el-card class="filter-container">
        <el-row>
          <el-col class="title-color" :span="4" style="line-height: 40px; font-weight: bold;">商户管理</el-col>
          <el-col :span="20">
            <el-form :inline="true" style="text-align:right">
              <el-form-item>
                <el-input v-model="mainTable.filter.phoneId" placeholder="手机号或账户ID" size="mini" @keyup.enter.native="mainTable.pager.index = 1;getMainTableData()" />
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.permanentLock" size="mini" placeholder="永久锁定">
                  <el-option v-for="(value, key) in map.permanentLock" :key="key" :value="key" :label="value">{{ value }}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="mainTable.filter.tempLock" size="mini" placeholder="临时锁定">
                  <el-option v-for="(value, key) in map.tempLock" :key="key" :value="key" :label="value">{{ value }}</el-option>
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
                  start-placeholder="注册开始日期"
                  end-placeholder="注册结束日期"
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
          <el-table-column align="center" label="用户信息">
            <template slot-scope="scope">
              <div>账号ID:{{ scope.row.id }}</div>
              <div>手机号:{{ scope.row.phone }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="账户信息">
            <template slot-scope="scope">
              <div>余额:{{ scope.row.balance }}</div>
              <div>订单冻结:{{ scope.row.frozen }}</div>
              <div>提现冻结:{{ scope.row.withFrozen }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="时间信息">
            <template slot-scope="scope">
              <div>注册时间:{{ scope.row.registerTime }}</div>
              <div>上次登录:{{ scope.row.lastTime }}</div>
            </template>
          </el-table-column>
          <!-- <el-table-column align="center" label="联系信息">
            <template slot-scope="scope">
              <div>QQ:{{ scope.row }}</div>
              <div>微信:{{ scope.row }}</div>
            </template>
          </el-table-column> -->
          <el-table-column align="center" label="设置信息">
            <template slot-scope="scope">
              <div>订单匹配:{{ map.matchState[scope.row.matchState] }}</div>
              <div>用户组:{{ scope.row.groupName }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="账号状态">
            <template slot-scope="scope">
              <div style="line-height:28px">临时锁定:
                <el-switch
                  v-model="scope.row.tempLock"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </div>
              <div>永久锁定:
                <el-switch
                  v-model="scope.row.permanentLock"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="240px" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="showPassword(scope.row)">改密</el-button>
              <el-button plain size="mini" type="primary" @click="showModify(scope.row)">用户余额变动</el-button>

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
        <el-form ref="passwordForm" size="mini" label-width="100px" :model="mainTable.passwordForm">
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
          <el-button size="mini" type="primary" @click="handlePassword">保 存</el-button>
        </div>
      </el-dialog>

      <el-dialog width="450px" center title="商户余额修改" :visible.sync="mainTable.dialogModifyVisible">
        <el-form ref="modifyForm" size="mini" :model="mainTable.modifyForm">
          <el-form-item>
            <el-input v-model="mainTable.modifyForm.value" type="number">
              <el-select slot="prepend" v-model="mainTable.modifyForm.operator_type" placeholder="请选择" style="width:80px">
                <el-option :label="'减少'" :value="'-'">减少</el-option>
                <el-option :label="'增加'" :value="'+'">增加</el-option>
              </el-select>
              <el-button slot="append">￥</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="mainTable.modifyForm.remark" type="textarea" :rows="4" placeholder="备注信息" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="mainTable.dialogModifyVisible = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleModify">保 存</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getMerchantList } from '@/api/merchant'
import { updatePassword, editBalance } from '@/api/admin'
import Pagination from '@/components/Pagination'
import { JSEncrypt } from 'jsencrypt'

export default {
  components: {
    Pagination
  },
  data() {
    return {
      map: {
        permanentLock: {
          0: '关闭',
          1: '打开'
        },
        tempLock: {
          0: '关闭',
          1: '打开'
        },
        matchState: {
          0: '关闭',
          1: '开启'
        }
      },
      getTreeData: '',
      mainTable: {
        loading: false,
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
          operator_type: '-',
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
        if (item !== 'operator_type') {
          form[item] = ''
        } else {
          form[item] = '-'
        }
      })

      this.$nextTick(_ => {
        if (this.$refs[formName]) this.$refs[formName].clearValidate()
      })
    },
    showPassword(item) {
      this.initForm(this.mainTable.passwordForm, 'passwordForm')
      this.mainTable.passwordForm.phone = item.phone
      this.mainTable.row = item
      this.mainTable.dialogPasswordVisible = true
    },
    showModify(item) {
      this.mainTable.row = item
      this.mainTable.dialogModifyVisible = true
    },
    getMainTableData() {
      const self = this
      this.mainTable.loading = true
      const _form = {
        phoneId: this.mainTable.filter.phoneId,
        practiceStatus: this.mainTable.filter.practiceStatus,
        receiptLock: this.mainTable.filter.receiptStatus,
        userStatus: this.mainTable.filter.userStatus,
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
      getMerchantList(_form).then(response => {
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
    handlePassword() {
      this.$store.dispatch('user/getPublicKey').then(response => {
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(response.publicKey)
        const _password = encrypt.encrypt(this.mainTable.passwordForm.password)
        const _form = {
          newPwd: _password,
          id: this.mainTable.row.id
        }
        updatePassword(_form).then(response => {
          if (response.code !== 200) return
          this.$message.success(response.message)
          this.mainTable.dialogPasswordVisible = false
        })
      }).finally(() => {
        this.loading = false
      })
    },
    handleModify() {
      const _form = {
        id: this.mainTable.row.id
      }
      Object.assign(_form, this.mainTable.modifyForm)
      editBalance(_form).then(response => {
        if (response.code !== 200) return
        this.$message.success(response.message)
        this.mainTable.dialogModifyVisible = false
        this.getMainTableData()
      })
    }
  }
}
</script>
