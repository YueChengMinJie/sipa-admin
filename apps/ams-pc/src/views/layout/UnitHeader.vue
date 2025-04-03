<!--
 * @Author: caszhou
 * @Date: 2023-06-13 13:02:58
 * @Description: 文件用途描述
-->

<template>
  <div class="unit-header">
    <!-- 左侧logo + 菜单 -->
    <div class="app-left">
      <div class="svg-logo">
        <el-image :src="require('@/assets/logo.png')" class="logo" />
      </div>
      <div class="company-select">
        <el-select v-model="companyId" placeholder="请选择主体" @change="handleCompanySelect">
          <el-option v-for="company in companies" :key="company.id" :value="company.id" :label="company.name" />
        </el-select>
      </div>
    </div>
    <!-- 右侧个人头像 -->
    <div class="app-right">
      <unit-user-info />
    </div>
    <!-- 右侧个人头像 结束 -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UnitUserInfo from './UnitUserInfo'
import { getClientId } from '@/utils/commonTools'
import { switchSubject } from '@/api/sso-idp-server'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      companies: state => state.companies
    }),
    companyId: {
      get() {
        return this.$store.state.companyId
      },
      async set(val) {
        try {
          const { data } = await switchSubject({
            companyId: val,
            applicationId: this.$store.state.applicationId,
            remember: false,
            token: this.$store.state.token,
            clientId: getClientId()
          })
          location.replace(`${window.location.origin}?token=${data.accessToken}&ifFree=false`)
        } catch (error) {
          console.error('await:', error)
        }
      }
    }
  },
  components: {
    UnitUserInfo
  },
  methods: {
    handleCompanySelect() {
      //
    }
  }
}
</script>

<style lang="scss" scoped>
.unit-header {
  width: 100%;
  height: 100%;
  min-width: 750px;
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0px 2px 3px 0px rgba(227, 227, 227, 0.5);

  .app-left {
    display: flex;
    flex: 1;

    .svg-logo {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 220px;

      .logo {
        width: 150px;
      }
    }

    .el-menu.el-menu--horizontal {
      border: 0;
    }

    .svg {
      margin-right: 4px;
      color: inherit;
    }
  }

  .app-right {
    display: flex;
    padding: 0 15px 0 5px;
  }
}

.company-select {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 15px;
}
</style>
