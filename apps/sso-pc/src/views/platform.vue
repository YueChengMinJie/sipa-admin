<!--
 * @Author: caszhou
 * @Date: 2022-10-24 17:39:56
 * @Description: 选择登录的后台
-->

<template>
  <div class="platform" v-loading="loading">
    <div class="logo-intro">
      <img src="@/assets/logo.png" alt="logo" class="logo-img" />
      <div class="txt">
        <div class="cn">登录中心</div>
        <div class="en">SIPA login center</div>
      </div>
    </div>
    <div class="container">
      <div class="title">登录后台选择</div>
      <div class="custom-search">
        <el-input placeholder="请搜索后台" v-model="search.name" size="medium">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="lately" v-if="recentTenant.length > 0">
          <span class="lately-title">最近登录:</span>
          <el-link type="primary" v-for="item in recentTenant" :key="item.id" @click="handleChooserTenant(item)">
            {{ item.name }}
          </el-link>
        </div>
      </div>
      <div class="hr"></div>
      <div class="list-box">
        <div class="list">
          <!-- <template v-if="generalData">
            <div class="group-title">总部</div>
            <div class="group-box">
              <div class="item" @click="handleChooserTenant(generalData)">{{ generalData.name || '--' }}</div>
            </div>
          </template> companies-->
          <div v-for="item in filterCompanies" :key="item.id">
            <div class="group-title">{{ item.name }}</div>
            <div class="group-box">
              <div class="item" v-for="unit in item.applicationInfos" :key="unit.id" @click="handleChooserTenant(unit)">
                {{ unit.name || '--' }}
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="custom-pagination">
          <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
        </div> -->
      </div>
      <el-button type="primary" class="custom-btn" round @click="backToLogin()">返回登录页面</el-button>
    </div>
  </div>
</template>

<script>
import Config from '@/config'
import Cookies from 'js-cookie'
import { getClientId } from '@/utils/tool'
import { companySelectByLogin, switchSubject, logout } from '@/api/sso-idp-server'

export default {
  data() {
    return {
      loading: false,
      recentTenant: [],
      search: { name: '' },
      companies: [],
      token: '',
      ifFree: false
    }
  },
  computed: {
    filterCompanies() {
      if (this.search.name) {
        const treeData = []
        for (const item of this.companies) {
          if (item.name.includes(this.search.name)) {
            treeData.push(item)
          } else if (item.applicationInfos && item.applicationInfos.length > 0) {
            const applicationInfos = []
            for (const iterator of item.applicationInfos) {
              if (iterator.name.includes(this.search.name)) {
                applicationInfos.push(iterator)
              }
            }
            if (applicationInfos.length > 0) {
              treeData.push({
                ...item,
                applicationInfos
              })
            }
          }
        }
        return treeData
      } else {
        return this.companies
      }
    }
  },
  mounted() {
    const { token, ifFree } = this.$route.query
    if (!(token && ifFree !== undefined)) {
      this.$notify({
        title: '消息',
        message: 'web: 获取的参数不合法!',
        type: 'error'
      })
      return false
    }
    this.token = token
    this.ifFree = String(ifFree) === 'true' ? true : false
    this.initPage()
  },
  methods: {
    async initPage() {
      try {
        this.loading = true
        await this.getTenantList()
      } catch (error) {
        console.error('await:', error)
      } finally {
        this.loading = false
      }
    },
    async backToLogin() {
      try {
        this.loading = true
        await logout({ token: this.token })
      } catch (error) {
        console.error('await:', error)
      } finally {
        this.loading = false
        this.$router.replace({ name: 'loginLink' })
      }
    },
    async getTenantList() {
      const { data } = await companySelectByLogin({ token: this.token, urlType: Config.env })
      this.companies = data
    },
    async handleChooserTenant(appData) {
      try {
        this.loading = true
        const { data } = await switchSubject({
          companyId: appData.companyId,
          applicationId: appData.id,
          remember: this.ifFree,
          token: this.token,
          clientId: getClientId()
        })
        const url = appData.url.replace('http://', '')
        const key = url.substr(url.lastIndexOf('/')) || '/'
        if (url.includes('localhost')) {
          Cookies.set(Config.merchantId, appData.companyId, { expires: 7 })
          Cookies.set(key, appData.companyId, { expires: 7 })
        } else {
          Cookies.set(Config.merchantId, appData.companyId, { expires: 7, domain: '.sipa.com' })
          Cookies.set(key, appData.companyId, { expires: 7, domain: '.sipa.com' })
        }
        location.replace(`${appData.url}?token=${data.accessToken}&ifFree=${this.ifFree}`)
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
.platform {
  width: 100%;
  height: 100%;
  position: relative;
  background: #ffffff;

  .logo-intro {
    font-size: 22px;
    color: #666666;
    display: flex;
    position: absolute;
    left: 28px;
    top: 36px;
    z-index: 3;

    .txt {
      flex: 1;
      color: #303133;

      .cn {
        font-weight: 500;
        line-height: 26px;
        font-size: 18px;
      }
      .en {
        font-size: 16px;
        color: #303133;
      }
    }
    .logo-img {
      height: 48px;
      margin-right: 10px;
    }
  }
  .container {
    width: 1000px;
    height: 100%;
    margin: 0 auto;
    padding-top: 10vh;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .title {
      font-weight: 500;
      color: #303133;
      line-height: 48px;
      font-size: 26px;
      text-align: center;
      margin-bottom: 20px;
    }
    .custom-search {
      width: 600px;
      margin: 0 auto 20px;

      .lately {
        color: #303133;
        font-size: 14px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        line-height: 1.5em;

        // .lately-title {
        //   margin-right: 5px;
        // }
        .el-link {
          margin-left: 15px;

          &::after {
            display: block;
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            height: 0;
            bottom: 0;
            border-bottom: 1px solid #409eff;
          }
        }
      }
    }
    .hr {
      height: 1px;
      background: #f2f2f2;
    }
    .list-box {
      flex: 1;
      overflow: hidden;
      margin-top: 15px;
      position: relative;
      padding-bottom: 40px;

      .list {
        max-height: 100%;
        min-height: 150px;
        overflow: auto;
      }

      .custom-pagination {
        display: flex;
        justify-content: flex-end;
        padding-top: 10px;
      }
    }
    .custom-btn {
      height: 46px;
      line-height: 46px;
      width: 180px;
      margin: 15px auto 6vh;
      padding: 0;
      font-size: 16px;
      border-radius: 40px;
      background: #527dff;
    }
    .group-title {
      font-size: 18px;
      font-weight: 500;
      color: #303133;
      line-height: 28px;
      margin-bottom: 15px;
    }
    .group-box {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 30%;
        height: 68px;
        line-height: 66px;
        color: #303133;
        border-radius: 10px;
        border: 1px solid #527dff;
        margin-bottom: 20px;
        margin-right: 5%;
        cursor: pointer;
        transition: all 0.3s;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 20px;

        &:nth-child(3n) {
          margin-right: 0;
        }

        &:hover {
          box-shadow: 6px 6px 16px 0px rgba(0, 88, 235, 0.35);
        }
      }
    }
  }
}
</style>
