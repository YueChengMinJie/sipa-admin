<!--
 * @Author: caszhou
 * @Date: 2023-08-01 13:45:17
 * @Description: 新增/编辑 商户
-->

<template>
  <div class="app-container" v-loading="loading">
    <div class="app-header"><el-page-header :content="pageTitle[pageType]" @back="goBack" /></div>
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="180px" class="app-main">
      <div class="anchor-point">
        <el-divider content-position="left"><h3>账户信息</h3></el-divider>
      </div>
      <div class="app-row">
        <el-form-item label="登录账号:" prop="adminPhone">
          <el-input
            clearable
            maxlength="11"
            class="input-width-400"
            v-if="pageType === 'add'"
            placeholder="请输入登录账号"
            v-model="formData.adminPhone"
          />
          <span v-else>{{ formData.adminPhone }}</span>
        </el-form-item>
      </div>
      <div class="app-row" v-if="pageType === 'add'">
        <el-form-item label="登录密码:" prop="loginPassword">
          <el-input
            clearable
            show-password
            maxlength="12"
            type="password"
            class="input-width-400"
            placeholder="请输入登录密码"
            v-model="formData.loginPassword"
          />
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item label="商户名:" prop="name">
          <el-input
            clearable
            maxlength="16"
            class="input-width-400"
            v-model="formData.name"
            placeholder="请输入商户名"
            v-if="pageType === 'add'"
          />
          <span v-else>{{ formData.name }}</span>
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item label="管理员:" prop="contact">
          <el-input
            clearable
            maxlength="16"
            class="input-width-400"
            placeholder="请输入管理员"
            v-if="pageType === 'add'"
            v-model="formData.contact"
          />
          <span v-else>{{ formData.contact }}</span>
        </el-form-item>
      </div>
    </el-form>
    <div class="app-footer">
      <el-button @click="goBack()">返回</el-button>
      <el-button type="primary" @click="handleSave()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { objectDeepCopy } from '@/utils/commonTools'
import { saveCompany, getCompany } from '@/api/sso-idp-server'

export default {
  name: 'companyMerchantOperate',
  data() {
    return {
      loading: false,
      pageType: 'add',
      pageId: '',
      pageTitle: {
        add: '新增商户',
        edit: '编辑商户'
      },
      formData: {
        adminPhone: null,
        loginPassword: 'Aa123456',
        name: null,
        contact: null
      },
      rules: {
        adminPhone: [
          { required: true, message: '请输入11位手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入合法的手机号', trigger: 'blur' }
        ],
        loginPassword: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/,
            message: '密码为6-12位字母数字组合',
            trigger: 'blur'
          }
        ],
        name: [{ required: true, message: '请输入商户名', trigger: 'blur' }],
        contact: [{ required: true, message: '请输入管理员名称', trigger: 'blur' }]
      }
    }
  },
  async mounted() {
    const { type, id } = this.$route.query
    this.pageType = type
    this.pageId = id || null
    try {
      this.loading = true
      if (this.pageType === 'edit') {
        await this.getDetail()
      }
    } catch (error) {
      console.error('await:', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async handleSave() {
      await this.$refs['formRef'].validate()

      try {
        this.loading = true
        await saveCompany({
          ...this.formData,
          id: this.pageId
        })
        this.$notify({
          title: '消息',
          message: '保存成功',
          type: 'success'
        })
        this.goBack()
      } catch (error) {
        console.error('await:', error)
      } finally {
        this.loading = false
      }
    },
    async getDetail() {
      const { data } = await getCompany({ id: this.pageId })
      objectDeepCopy(this.formData, data)
    }
  }
}
</script>

<style scoped lang="scss">
.app-container {
  .app-main {
    position: relative;

    .anchor-point {
      overflow: hidden;
    }

    .input-width-400 {
      width: 400px;
    }
  }
}
</style>
