<template>
  <div class="app-container">
    <el-card class="filter-container">
      <el-row>
        <el-col class="title-color" :span="6" style="line-height: 40px; font-weight: bold;">
          收款码管理
          <el-tag size="small">{{ mode }}</el-tag>
          <i class="el-icon-refresh changeMode" @click="changeMode" />
        </el-col>
        <el-col :span="18">
          <el-form :inline="true" style="text-align:right">
            <!-- <el-form-item label="图片地址">
          <el-input v-model="mainTable.filter.qrUrl " size="mini" />
        </el-form-item> -->
            <el-form-item>
              <el-input v-model="mainTable.filter.name" placeholder="收款名" clearable size="mini" />
            </el-form-item>
            <el-form-item>
              <el-select v-model="mainTable.filter.type" placeholder="类型" clearable size="mini">
                <el-option :value="1" label="支付宝">支付宝</el-option>
                <el-option :value="2" label="微信">微信</el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="getQRList">
                <i class="el-icon-search" />
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

    <el-card>
      <el-col style="text-align:right;margin-bottom:10px;position:relative;z-index:2">
        <el-button v-show="mode === '系统'" size="mini" type="primary" @click="showDialog('add')">新增二维码</el-button>
      </el-col>

      <el-row v-loading="mainTable.loading" :gutter="10">
        <el-col v-for="item in mainTable.array" :key="item.qrId" :xs="24" :sm="12" :lg="8" :xl="6">
          <el-card style="margin-bottom:10px;position:relative;">
            <el-image :src="item.qrUrl" style="border-radius: 4px;width:100px;height:100px" />
            <div class="qr-info">
              <div class="account">{{ item.bankAccount }}</div>
              <div class="name">{{ item.name }}</div>
              <div class="account-type" style="width:49%;display:inline-block">今日收款:{{ item.todayAccount }}</div>
              <div class="account-type" style="width:49%;display:inline-block">最大收款:{{ item.maxAccount }}</div>
              <div v-show="item.useStatus !== 3" style="font-size:12px;line-height:20px">轮询开关:
                <el-switch
                  v-model="item.pollStatus"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="(val) => {
                    return changePollStatus(val, item.id)
                  }"
                />
              </div>
              <div class="account-type">
                {{ map.type[item.type] }}
                <span v-show="item.alipay">:{{ item.alipay }}</span>
              </div>
              <div class="time" style="bottom: 20px">创建时间:{{ item.createTime }}</div>
              <div class="time">更新时间:{{ item.updateTime }}</div>
              <i v-show="mode === '系统'" class="el-icon-edit-outline edit" @click="showDialog('edit', item)" />
              <div class="user-status" @click="item.useStatus !== 3 ? showStatus(item) : ''">
                <el-popover
                  placement="top-start"
                  width="160"
                  :trigger="item.useStatus === 3 || item.useStatus === 0 ? 'hover' : 'manual'"
                  :content="item.remark"
                >
                  <span slot="reference" :style="`color:${map.useStatusColor[item.useStatus]}`">{{ map.useStatus[item.useStatus] }}</span>
                </el-popover>

                <i v-show="item.useStatus !== 3" style="color:#ccc" class="el-icon-edit-outline" />
              </div>
              <!-- <div class="circle" :class="item.useStatus == 1 ? 'circle-success' : 'circle-error'" :title="'当前状态：'+ (item.useStatus == 1 ? '启用' : '停用')" @click="changeStatus(item)">
                <i class="el-icon-check enable-status" />
                <i class="el-icon-close disable-status" />
              </div> -->

            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-dialog width="400px" center title="修改收款码状态" :visible.sync="mainTable.dialogStatusVisible">
      <el-form ref="statusForm" size="mini" label-width="100px" :model="mainTable.statusForm" :rules="mainTable.formRules">
        <el-form-item label="启用状态">
          <el-select v-model="mainTable.statusForm.useStatus">
            <el-option :value="1" label="开启">开启</el-option>
            <el-option :value="0" label="关闭">关闭</el-option>
            <el-option v-show="mainTable.row.useStatus === 2" :value="3" label="驳回">驳回</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="mainTable.statusForm.useStatus === 0 || mainTable.statusForm.useStatus === 3" label="备注" :prop="mainTable.statusForm.useStatus !== 0 && mainTable.statusForm.useStatus !== 3 ? '' : 'remark'">
          <el-input v-model="mainTable.statusForm.remark" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="mainTable.dialogStatusVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleStatus">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog width="400px" center :title="mainTable.dialogTitle" :visible.sync="mainTable.dialogCodeVisible">
      <el-form ref="codeForm" :model="mainTable.codeForm" :rules="mainTable.formRules" size="mini" label-width="100px">
        <el-form-item label="收款码路径" prop="qrUrl">
          <el-upload
            v-loading="uploadLoading"
            element-loading-text="正在上传中，请稍候"
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="handleUploadPicture"
          >
            <img v-if="mainTable.codeForm.qrUrl" :src="mainTable.codeForm.qrUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="收款名" prop="name">
          <el-input v-model="mainTable.codeForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="收款码类型" prop="type">
          <el-select v-model="mainTable.codeForm.type" style="width:100%">
            <el-option :value="1" label="支付宝">支付宝</el-option>
            <el-option :value="2" label="微信">微信</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="mainTable.codeForm.type === 1" label="支付宝账号">
          <el-input v-model="mainTable.codeForm.alipay" autocomplete="off" />
        </el-form-item>
        <el-form-item label="最大收款额度">
          <el-input v-model="mainTable.codeForm.maxAccount" type="number" autocomplete="off" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="mainTable.codeForm.userRemark" type="textarea" :rows="2" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="mainTable.dialogCodeVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleQR">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { uploadPicture, addQR, editQR, updatePollStatus, queryQrAll, updateEnableStatus } from '@/api/qrCode'
import { handleCopyObject } from '@/utils/index'
// import cryptoJs from 'crypto-js'

export default {
  data() {
    return {
      dialogMode: 'add',
      uploadLoading: false,
      mode: '系统',
      map: {
        type: {
          1: '支付宝',
          2: '微信'
        },
        adminStatus: {
          1: '是',
          2: '否'
        },
        useStatus: {
          0: '关闭',
          1: '开启',
          2: '待审核',
          3: '驳回'
        },
        useStatusColor: {
          0: '#F56C6C',
          1: '#67C23A',
          2: '#909399',
          3: '#E6A23C'
        }
      },
      showCard: {
        qrUrl: '',
        floatMoney: ''
      },
      mainTable: {
        loading: false,
        dialogTitle: '新增收款码',
        dialogStatusVisible: false,
        dialogCodeVisible: false,
        array: [],
        filter: {
          name: '',
          userId: 'admin',
          type: ''
        },
        row: {},
        codeForm: {
          id: '',
          qrUrl: '',
          userId: 'admin',
          alipay: '',
          name: '',
          type: '',
          maxAccount: 0,
          userRemark: ''
        },
        statusForm: {
          id: '',
          // userType: 2,
          useStatus: '',
          remark: ''
        },
        formRules: {
          qrUrl: [{ required: true, trigger: 'blur' }],
          enableStatus: [{ required: true, trigger: 'blur' }],
          name: [{ required: true, trigger: 'blur' }],
          type: [{ required: true, trigger: 'blur' }],
          remark: [{ required: true, trigger: 'blur', message: '请填写理由' }]

        }

      }
    }
  },
  watch: {
    mode(val) {
      if (val === '系统') {
        this.mainTable.filter.userId = 'admin'
      } else {
        this.mainTable.filter.userId = ''
      }

      this.getQRList()
    }
  },
  created() {
    this.getQRList()
  },
  methods: {
    changeMode() {
      document.querySelector('.changeMode')
      this.mode = this.mode === '系统' ? '码商' : '系统'
    },
    handleStatus() {
      this.$refs.statusForm.validate(valid => {
        if (valid) {
          updateEnableStatus(this.mainTable.statusForm).then(response => {
            if (response.code !== 200) return

            this.mainTable.dialogStatusVisible = false
            this.getQRList()
          })
        }
      })
    },
    initForm(form, formName) {
      const keyNameArr = Object.keys(form)
      keyNameArr.forEach(item => {
        if (item !== 'userId') form[item] = ''
      })

      this.$nextTick(_ => {
        this.$refs[formName].clearValidate()
      })
    },
    showDialog(type, item) {
      this.dialogMode = type
      if (type === 'add') {
        this.initForm(this.mainTable.codeForm, 'codeForm')
        this.mainTable.dialogTitle = '新增收款码'
      } else {
        this.mainTable.row = item
        handleCopyObject(this.mainTable.codeForm, item)
        this.mainTable.dialogTitle = '编辑收款码'
      }

      this.$nextTick(_ => {
        if (this.$refs['codeForm']) this.$refs['codeForm'].clearValidate()
      })
      this.mainTable.dialogCodeVisible = true
    },
    showStatus(item) {
      this.mainTable.row = item
      handleCopyObject(this.mainTable.statusForm, item)
      if (this.mainTable.statusForm.useStatus === 2) this.mainTable.statusForm.useStatus = ''

      this.$nextTick(_ => {
        if (this.$refs['statusForm']) this.$refs['statusForm'].clearValidate()
      })
      this.mainTable.dialogStatusVisible = true
    },
    handleUploadPicture(file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('imgType', 2)
      this.uploadLoading = true

      uploadPicture(formData).then(response => {
        this.mainTable.codeForm.qrUrl = response.result
      }).finally(_ => {
        this.uploadLoading = false
      })
    },
    handleQR() {
      const _map = {
        add: addQR,
        edit: editQR
      }
      _map[this.dialogMode](this.mainTable.codeForm).then(response => {
        if (response.code !== 200) return
        this.$message({
          type: 'success',
          message: response.message
        })
        this.mainTable.dialogCodeVisible = false
        this.getQRList()
      })
    },
    changePollStatus(val, id) {
      updatePollStatus({
        id,
        pollStatus: val ? 1 : 0
      }).then(response => {
        if (response.code !== 200) {
          this.getQRList()
        }
        // item.useStatus = useStatus === 0 ? 1 : 0
        // this.getQRList()
      })
    },
    getQRList() {
      this.mainTable.loading = true
      const _form = this.mainTable.filter
      queryQrAll(_form).then(response => {
        if (response.code !== 200) return
        if (Array.isArray(response.rows)) {
          response.rows.forEach(item => {
            item.pollStatus = !!item.pollStatus
          })
        }
        this.mainTable.array = response.rows || []
      }).finally(_ => {
        this.mainTable.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container{
  height: 100%;
}
.changeMode{
  cursor: pointer;
  transition: .2s;
}
.user-status{
  font-weight: bold;
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
  cursor: pointer;
}
.edit{
  position: absolute;
  cursor: pointer;
  color: #ccc;
  left: 20px;
  bottom: 20px;
}
.line{
  text-align: center;
}
.bg{
  height: 600px;
  background: url('../../assets/phone.png') no-repeat;
  background-size: contain;
  background-position-x: 50%;

  .price{
    color: #F79709;
    font-size: 24px;
    line-height: 48px;
    font-weight: bold;
  }
}
.qr-info{
  float: right;
  width: calc(100% - 100px);
  height: 150px;
  padding: 10px 15px;
  .account{
    font-weight: bold;
    font-size: 24px;
    line-height: 40px;
  }
  .name{
    font-size: 16px;
    color: #8c939d;
    line-height: 24px;
  }
  .account-type{
    font-size: 12px;
    line-height: 20px;
  }
  .time{
    font-size: 12px;
    position: absolute;
    right: 10px;
    bottom: 5px;
    color: #ccc;
  }
  .circle{
    width: 80px;
    height: 80px;
    position: absolute;
    top: -40px;
    right: -40px;
    border-radius: 50%;
    transition: .2s all;
    cursor: pointer;
    &-success{
      background: #5cb87a;
    }
    &-error{
      background: #F56C6C;
      transform: rotate(90deg);
    }

    .enable-status{
      font-size: 26px;
      position: absolute;
      left: 10px;
      bottom: 10px;
      color: #fff;
    }
    .disable-status{
      font-size: 26px;
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: #fff;
    }
  }
}
</style>

