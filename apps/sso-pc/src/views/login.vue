<!--
 * @Author: caszhou
 * @Date: 2022-10-24 13:25:12
 * @Description: 登录
-->

<template>
  <div class="container">
    <div class="header">
      <a href="/" class="logo-outer">
        <img src="../assets/logo.png" alt="" class="logo" />
      </a>

      <div class="gap" />

      <div class="title">统一登陆中心</div>
    </div>

    <div class="middle">
      <div class="background" />

      <div class="login">
        <div class="login-title">账户密码登录</div>

        <el-form
          :model="accountForm"
          :rules="accountRules"
          ref="accountForm"
          label-width="0"
          @submit.native.prevent="accountSubmit"
          class="login-form"
        >
          <el-form-item prop="account">
            <el-input
              clearable
              v-model.trim="accountForm.account"
              prefix-icon="el-icon-user"
              placeholder="手机号/邮箱/工号"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              type="password"
              v-model.trim="accountForm.password"
              maxlength="16"
              show-password
              prefix-icon="el-icon-lock"
              placeholder="密码"
            />
          </el-form-item>

          <el-form-item prop="free" class="free">
            <el-checkbox v-model="accountForm.free">勾选7天免登录</el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="btn primary-color" :loading="loading" native-type="submit">
              {{ loading ? '正在登录...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="footer">Copyright © 2009 - present 苏州玥呈敏洁网络科技有限公司</div>
  </div>
</template>

<script>
import Config from '@/config'
import Cookies from 'js-cookie'
import { getClientId } from '@/utils/tool'
import { loginPassword, switchSubject } from '@/api/sso-idp-server'

export default {
  data() {
    return {
      accountForm: {
        account: '',
        password: 'Aa123456',
        free: true
      },
      accountRules: {
        account: [{ required: true, message: '请输入手机号或邮箱或工号', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '密码位数为6-16位', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {
    const account = Cookies.get('account')
    if (account) {
      this.accountForm.account = account
    }
  },
  methods: {
    accountSubmit() {
      this.$refs['accountForm']?.validate(async valid => {
        if (valid) {
          try {
            this.loading = true
            const { data } = await loginPassword({
              account: this.accountForm.account,
              password: this.accountForm.password,
              remember: this.accountForm.free,
              urlType: Config.env,
              clientId: getClientId()
            })
            Cookies.set('account', this.accountForm.account)
            await this.handleTenantLogin(data, this.accountForm.free)
          } catch (error) {
            this.accountForm.password = ''
            console.error('await:', error)
          } finally {
            this.loading = false
          }
        }
      })
    },
    async handleTenantLogin(data, ifFree) {
      const tenantList = []
      data.accountVo.companies.forEach(item => {
        item.applicationInfos.forEach(unit => {
          tenantList.push({
            ...unit,
            companyId: item.id
          })
        })
      })
      const ifMultiTenancy = tenantList.length > 1
      if (ifMultiTenancy) {
        this.$router.push({
          name: 'platformLink',
          query: { token: data.accessToken, ifFree }
        })
      } else {
        if (tenantList && tenantList.length === 1) {
          const tenantData = tenantList[0]
          const { data: switchData } = await switchSubject({
            companyId: tenantData.companyId,
            applicationId: tenantData.id,
            remember: ifFree,
            token: data.accessToken
          })
          const url = tenantData.url.replace('http://', '')
          const key = url.substr(url.lastIndexOf('/')) || '/'
          if (url.includes('localhost')) {
            Cookies.set(Config.merchantId, tenantData.companyId, { expires: 7 })
            Cookies.set(key, tenantData.companyId, { expires: 7 })
          } else {
            Cookies.set(Config.merchantId, tenantData.companyId, { expires: 7, domain: '.sipa.com' })
            Cookies.set(key, tenantData.companyId, { expires: 7, domain: '.sipa.com' })
          }
          location.replace(`${tenantData.url}?token=${switchData.accessToken}&ifFree=%${ifFree}`)
          Promise.resolve(true)
        } else {
          this.$notify({
            title: '消息',
            message: '登陆没有找到应用!',
            type: 'error'
          })
          Promise.reject('WE请求错误: 登陆没有找到应用!')
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../styles/mixin.scss';

.container {
  min-width: 1024px;
  min-height: 768px;
  height: 100vh;
  @include fcsbfs();
  margin: 0 auto;
}

.header {
  height: 64px;
  padding: 0 50px;
  @include frfsc();
  background-color: #f0f0f0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  width: 100%;
}

.logo-outer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo {
  height: 42px;
}

.gap {
  width: 1px;
  height: 44px;
  margin: 0 10px;
  background-color: #e8e8e8;
}

.title {
  font-weight: 400;
  font-size: 16px;
  color: #333;
}

.middle {
  margin: 0 auto;
  width: 804px;
  height: 400px;
  @include frfsc();
}

.background {
  width: 544px;
  height: 400px;
  background-image: url('../assets/background.jpeg');
  background-size: auto 100%;
}

.login {
  width: 260px;
  height: 400px;
  padding: 0 20px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  @include fccfs();
}

.login-title {
  font-size: 18px;
  font-weight: 400;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ccc;
  width: 100%;
}

.login-form {
  width: 100%;
}

.btn {
  width: 100%;
}

.footer {
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
  text-align: center;
  width: 100%;
  padding: 10px 0;
}

.free {
  margin-bottom: 0;

  .el-checkbox ::v-deep .el-checkbox__label {
    font-size: 12px;
  }
}
</style>
