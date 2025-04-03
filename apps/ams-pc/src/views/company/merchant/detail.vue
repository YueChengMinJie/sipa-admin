<!--
 * @Author: caszhou
 * @Date: 2023-08-03 12:32:37
 * @Description: 商户/组织 详情
-->

<template>
  <div class="app-container" v-loading="loading">
    <div class="app-header"><el-page-header content="查看详情" @back="goBack" /></div>
    <el-form ref="formRef" :model="formData" label-width="180px" class="app-main">
      <div class="anchor-point">
        <el-divider content-position="left"><h3>账户信息</h3></el-divider>
      </div>
      <div class="app-row">
        <el-form-item label="登录账号:">
          {{ formData.adminPhone }}
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item label="商户名:">
          {{ formData.name }}
        </el-form-item>
      </div>
      <div class="app-row">
        <el-form-item label="管理员:">
          {{ formData.contact }}
        </el-form-item>
      </div>
    </el-form>
    <div class="app-footer">
      <el-button @click="goBack()">返回</el-button>
    </div>
  </div>
</template>

<script>
import { getCompany } from '@/api/sso-idp-server'
import { objectDeepCopy } from '@/utils/commonTools'

export default {
  name: 'companyMerchantDetail',
  data() {
    return {
      loading: false,
      pageId: '',
      formData: {
        adminPhone: null,
        name: null,
        contact: null
      }
    }
  },
  async mounted() {
    const { id } = this.$route.query
    this.pageId = id
    await this.getDetail()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async getDetail() {
      try {
        this.loading = true
        const { data } = await getCompany({ id: this.pageId })
        objectDeepCopy(this.formData, data)
      } catch (error) {
        console.error('await:', error)
      } finally {
        this.loading = false
      }
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
  }
}
</style>
