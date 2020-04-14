<template>
  <div class="full-height">
    <el-row class="full-height" :gutter="10">
      <el-col :span="12" class="full-height">
        <el-card class="full-height">
          <div slot="header" class="clearfix">
            <span>个人基础信息</span>
          </div>
          <el-form size="mini" label-width="160px" label-position="left" style="padding:0 20px">
            <el-row :gutter="10">
              <el-col :sm="24" :md="12">
                <el-form-item label="账号">
                  <span>{{ userInfo.id }}</span>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12">
                <el-form-item label="联系电话">
                  <span>{{ userInfo.phone }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10">
              <el-col :sm="24" :md="12">
                <el-form-item label="联系QQ">
                  <span>{{ userInfo.qq }}</span>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12">
                <el-form-item label="联系微信">
                  <span>{{ userInfo.wechat }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <hr>

            <el-form-item label="我的秘钥">
              <span id="secret-key">{{ userInfo.secretKey }}</span>
              <el-button type="primary" @click="copy">复制</el-button>
              <input id="input" type="text" style="opacity: 0;z-index:-1;position: relative;">
            </el-form-item>

            <el-row :gutter="20">
              <el-col :sm="24" :md="12">
                <el-form-item label="注册时间">
                  <span>{{ userInfo.registerTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12">
                <el-form-item label="账号状态">
                  <span>{{ userInfo.status }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <hr>
            <el-row :gutter="20">
              <el-col :sm="24" :md="12">
                <el-form-item label="上次登录城市">
                  <span>{{ userInfo.lastCity }}</span>
                </el-form-item>
              </el-col>
              <el-col :sm="24" :md="12">
                <el-form-item label="上次登录时间">
                  <span>{{ userInfo.lastTime }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
      <el-col :span="12" class="full-height">
        <el-card style="height:49%;margin-bottom:2%">
          <div slot="header" class="clearfix">
            <span>登录密码修改</span>
          </div>
          <el-form ref="loginForm" v-loading="loginForm.loading" size="mini" label-width="100px">
            <el-form-item label="原密码">
              <el-input v-model="loginForm.oldPwd" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="loginForm.newPwd" type="password" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="loginForm.newPwdConfirm" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="safePassword('loginForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card style="height:49%">
          <div slot="header" class="clearfix">
            <span>安全密码修改</span>
          </div>
          <el-alert
            style="margin-bottom:20px"
            title="默认原始安全码与登陆密码相同"
            type="info"
            :closable="false"
          />
          <el-form ref="safeForm" v-loading="safeForm.loading" size="mini" label-width="100px">
            <el-form-item label="原密码">
              <el-input v-model="safeForm.oldPwd" type="password" />
            </el-form-item>
            <el-form-item label="新密码">
              <el-input v-model="safeForm.newPwd" type="password" />
            </el-form-item>
            <el-form-item label="确认密码">
              <el-input v-model="safeForm.newPwdConfirm" type="password" />
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="safePassword('safeForm')">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { JSEncrypt } from 'jsencrypt'
import { getUserInfo, updateLoginPassword, updateSafePassword } from '@/api/user'

export default {
  data() {
    return {
      loginForm: {
        loading: false,
        oldPwd: '',
        newPwd: '',
        newPwdConfirm: ''
      },
      safeForm: {
        loading: false,
        oldPwd: '',
        newPwd: '',
        newPwdConfirm: ''
      },
      userInfo: {
        id: '',
        phone: '',
        email: '',
        qq: '',
        wechat: '',
        secretKey: '',
        registerTime: '',
        status: '',
        lastTime: '',
        lastOs: '',
        lastCity: ''
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    copy() {
      const text = document.getElementById('secret-key').innerText
      const input = document.getElementById('input')
      input.value = text
      input.select()
      document.execCommand('copy')
      this.$message.success('复制成功')
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
    getUserInfo() {
      getUserInfo().then(response => {
        if (!response.success) return
        this.userInfo = response.result
      })
    },
    safePassword(type) {
      const _map = {
        loginForm: updateLoginPassword,
        safeForm: updateSafePassword
      }
      this[type].loading = true

      this.$store.dispatch('user/getPublicKey').then(response => {
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(response.publicKey)
        const _oldPwd = encrypt.encrypt(this[type].oldPwd)
        const _newPwd = encrypt.encrypt(this[type].newPwd)
        const _form = {
          oldPwd: _oldPwd,
          newPwd: _newPwd
        }
        _map[type](_form).then(response => {
          if (!response.success) return

          this.$message.success(response.message)
          this.initForm(this[type], type)
        }).finally(_ => {
          this[type].loading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 18px;
}
.el-input{
    max-width: 178px;
}
hr{
    margin-bottom: 18px;
}
</style>
