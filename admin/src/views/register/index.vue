<template>
  <div class="register-container">
    <el-card v-loading="loading" class="register-card">

      <div class="system-register">
        <div class="title-container">
          <span class="title" :class="mode === 'system' ? 'is-active':''" @click="initForm('registerSystemForm');mode = 'system'">系统注册</span>
          <span class="title" :class="mode === 'user' ? 'is-active':''" @click="initForm('registerUserForm');mode = 'user'">客户注册</span>
        </div>

        <div :class="mode === 'system' ? '':'show-transform-rotate'" style="transition:.4s;-webkit-perspective: 500;">
          <el-form ref="registerSystemForm" :model="registerSystemForm" :rules="registerRules">
            <el-form-item prop="commercialName" label="商户号">
              <input
                v-model="registerSystemForm.commercialName"
                class="register-input"
                name="commercialName"
                type="text"
                tabindex="1"
                auto-complete="on"
              >
            </el-form-item>

            <el-form-item prop="commercialIphone" label="手机号">
              <input
                v-model="registerSystemForm.commercialIphone"
                class="register-input"
                name="commercialIphone"
                type="text"
                tabindex="2"
                auto-complete="on"
              >
            </el-form-item>

            <el-form-item prop="commercialPassword" label="密码">
              <input
                v-model="registerSystemForm.commercialPassword"
                class="register-input"
                name="commercialPassword"
                :type="passWordType ? 'password' : ''"
                tabindex="4"
                auto-complete="on"
              >
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passWordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

          </el-form>

        </div>

        <button class="register-button" @click="handleRegister()">注册</button>
        <div class="hr" />
        <div class="back-to-login" @click.prevent="handleToLogin">已有账号？</div>

        <div :class="mode === 'user' ? '':'show-transform'" style="transform: translateY(-157%);transition:.4s;-webkit-perspective: 500;">
          <el-form ref="registerUserForm" :model="registerUserForm" :rules="registerRules">
            <el-form-item
              prop="commercialName"
              label="商户号"
            >
              <input
                v-model="registerUserForm.commercialName"
                class="register-input"
                name="commercialName"
                type="text"
                tabindex="1"
                auto-complete="on"
              >
            </el-form-item>

            <el-form-item prop="commercialIphone" label="手机号">
              <input
                v-model="registerUserForm.commercialIphone"
                class="register-input"
                name="commercialIphone"
                type="text"
                tabindex="2"
                auto-complete="on"
              >
            </el-form-item>

            <el-form-item prop="commercialPassword" label="密码">
              <input
                v-model="registerUserForm.commercialPassword"
                class="register-input"
                name="commercialPassword"
                :type="passWordType ? 'password' : ''"
                tabindex="4"
                auto-complete="on"
              >
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passWordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>

            <!-- <button class="register-button" @click.native.prevent="handleRegister(true)">注册</button>
            <div class="hr" />
            <div class="back-to-login" @click.prevent="handleToLogin">已有账号？</div> -->
          </el-form>
        </div>
      </div>

      <!-- <div class="success-tip">
            <i class="el-icon-success" style="color:#18D78A" />
            <span>注册成功！稍后将返回登录页</span>
          </div> -->

      <!-- <div class="wave-bg">
            <div class="wave-bg1" />
            <div class="wave-bg2" />
          </div> -->
    </el-card>
  </div>
</template>

<script>
import { JSEncrypt } from 'jsencrypt'

export default {
  data() {
    return {
      mode: 'system',
      userType: '',
      registerSystemForm: {
        commercialName: '',
        commercialIphone: '',
        commercialPassword: ''
      },
      registerUserForm: {
        commercialName: '',
        commercialIphone: '',
        commercialPassword: ''
      },
      registerRules: {
        commercialName: [{ required: true, trigger: 'blur', message: '商户名必填' }],
        commercialIphone: [{ required: true, trigger: 'blur', message: '手机号必填' }],
        commercialPassword: [{ required: true, trigger: 'blur', message: '密码必填' }]
      },
      passWordType: 'password',
      loading: false,
      isRegisterSuccess: false
    }
  },
  methods: {
    showPwd() {
      if (this.passWordType === 'password') {
        this.passWordType = ''
      } else {
        this.passWordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    initForm(form) {
      this.$refs[form].resetFields()
    },
    handleRegister() {
      let _formName
      if (this.mode === 'system') {
        this.userType = 0
        _formName = 'registerSystemForm'
      } else {
        this.userType = 1
        _formName = 'registerUserForm'
      }
      this.$refs[_formName].validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/getPublicKey').then(response => {
            const encrypt = new JSEncrypt()
            encrypt.setPublicKey(response.publicKey)
            const _password = encrypt.encrypt(this.registerSystemForm.commercialPassword)
            const _form = {
              commercialName: this.registerSystemForm.commercialName,
              commercialIphone: this.registerSystemForm.commercialIphone,
              userType: this.userType,
              commercialPassword: _password
            }
            this.$store.dispatch('user/register', _form).then(() => {
              this.isRegisterSuccess = true
              setTimeout(() => {
                this.$router.push({ path: this.redirect || '/' })
              }, 2000)
            }).finally(() => {
              this.loading = false
            })
          })
        } else {
          return false
        }
      })
    },
    handleToLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss">

.register-container{
  height: 100%;
  background: #2d3a4b;
}
.hr{
  width: 100%;
  height: 2px;
  margin: 30px 0 30px;
  background: rgba(255,255,255,.2);
}
.register-card{
  width: 500px;
  height: 700px;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 38px 0;
  background: url('../../assets/bg.jpg') no-repeat;
  background-size: cover;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.8) !important;
  &.el-card{
    border: none;
  }
  .el-card__body{
    padding: 0;
    width: 100%;
    height: 100%;
  }
  .el-form-item__label{
    color: #aaa;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
  }

  .el-form-item__error{
    left: 10px;
  }
  // &:before{
  //   content: '';
  //   height: 4px;
  //   width: 100%;
  //   display: block;
  //   background: linear-gradient(to right, #A7D3F1 , #3C57C4);;
  //   position: absolute;
  //   top: 0;
  //   left: 0;
  // }

}
.system-register{
  background: rgba(40,57,101,.9);
  width: 100%;
  height: 100%;
  padding: 80px 60px;
}
.register-input{
  width: 100%;
  border: none;
  padding: 15px 20px;
  border-radius: 25px;
  background: rgba(255,255,255,.1);
  outline: unset;
  color: #fff;
}

.title-container {
  position: relative;
  margin-bottom: 15px;

  .title {
    cursor: pointer;
    font-size: 26px;
    color: #6a6f8c;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
    border-bottom: 2px solid transparent;
    margin: 0 15px 10px 0;
    transition: .2s all;
  }
  .title.is-active{
    color: #fff !important;
    border-color: #1161ee;
  }
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: #444;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.show-pwd {
  position: absolute;
  right: 30px;
  top: 44px;
  font-size: 16px;
  color: #889aa4;
  cursor: pointer;
  user-select: none;
}

.register-button{
  border: none;
  padding: 15px 20px;
  border-radius: 25px;
  background: #1161ee;
  width: 100%;
  color: #fff;
  outline: unset;
  cursor: pointer;
  margin-top: 25px;
}

.show-transform{
  transform: translateY(-157%) rotateY(90deg) !important;
}
.show-transform-rotate{
  transform: rotateY(90deg);
}

.wave-bg{
  width: 100%;
  height: 110px;
  position: absolute;
  bottom: 0;
  left: 0;

  .wave-bg1{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url('../../assets/waveBg.png') 0 -15px repeat-x;
    animation: wave 13s infinite linear;
  }

  .wave-bg2{
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url('../../assets/waveBg.png') 0 -230px repeat-x;
    animation: wave 13s infinite linear;
  }
}
.back-to-login{
  width: 100%;
  text-align: center;
  color: #6a6f8c;
  position: relative;
  top: 35px;
  cursor: pointer;
  z-index: 2;
  font-size: 14px;
}

.success-tip{
  text-align: center;
  height: 300px;
  line-height: 300px;
}

@keyframes wave {
  from{ background-position-x: 0 }
  to{ background-position-x: -115% }
}

</style>
