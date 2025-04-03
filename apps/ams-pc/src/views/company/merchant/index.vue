<!--
 * @Author: caszhou
 * @Date: 2023-08-01 13:45:17
 * @Description: 商户管理
-->

<template>
  <div class="app-container" v-loading="loading">
    <div class="app-part">
      <div class="app-item">条件筛选:</div>
      <div class="app-item">
        <el-input
          clearable
          class="w300"
          maxlength="32"
          v-model="search.name"
          @keyup.native.enter="initList"
          placeholder="请输入编号/账号/管理员"
        >
          <el-button slot="append" icon="el-icon-search" @click="initList" />
        </el-input>
      </div>
    </div>
    <div class="app-part">
      <div class="app-item">创建日期:</div>
      <div class="app-item">
        <el-date-picker
          type="daterange"
          range-separator="至"
          value-format="timestamp"
          end-placeholder="结束日期"
          v-model="search.dateTime"
          start-placeholder="开始日期"
          @change="handleDateTimeChange"
        />
      </div>
    </div>
    <div class="app-part">
      <div class="app-item">功能操作:</div>
      <div class="app-item">
        <el-button type="primary" icon="el-icon-plus" @click="handleOperate('add')">新增商户</el-button>
      </div>
    </div>
    <!-- 公共表格 -->
    <div class="app-table">
      <el-table height="100%" :data="tableData">
        <el-table-column label="商户编号" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.serialNo || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="商户名" min-width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.name || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="商户账号" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.adminPhone || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="管理员" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.contact || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="审批状态" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            {{
              scope.row.serialNo === defaultCompanySerialNo()
                ? '不需要审批'
                : processOptions.get(scope.row.processStatus) ?? '--'
            }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150">
          <template slot-scope="scope">
            {{ dateTimeStr(scope.row.createTime) || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <el-link icon="el-icon-view" class="operate" @click="handleOperate('detail', scope.row)">详情</el-link>
            <el-link icon="el-icon-edit" class="operate" @click="handleOperate('edit', scope.row)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 公共表格 结束 -->
    <!-- 对应表格分页 -->
    <div class="app-pagination">
      <el-pagination
        background
        :total="pagination.total"
        :page-size="pagination.size"
        :page-sizes="pagination.sizes"
        @size-change="handleSizeChange"
        :current-page="pagination.current"
        :pager-count="pagination.pagerCount"
        @current-change="handleCurrentChange"
        layout="total, sizes, prev, pager, next, jumper"
      />
    </div>
    <!-- 对应表格分页 结束 -->
  </div>
</template>

<script>
import MixinPage from '@/utils/mixinPage'
import { dateTimeStr } from '@/utils/commonTools'
import { companyPage } from '@/api/sso-idp-server'
import { defaultCompanySerialNo, processOptions } from '@/utils/constants'
import { getStatusByBusinessKey } from '@/api/process-service-server'

export default {
  name: 'companyMerchantIndex',
  computed: {
    processOptions() {
      return processOptions
    }
  },
  mixins: [MixinPage],
  data() {
    return {
      listApi: companyPage,
      search: {
        name: null,
        dateTime: null,
        startCreateTime: null,
        endCreateTime: null
      }
    }
  },
  async activated() {
    try {
      this.loading = true
      await this.getList()
    } catch (error) {
      console.error('await:', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    async tableDataHook(records) {
      for (const record of records) {
        // todo 优化
        const { data } = await getStatusByBusinessKey({
          businessKey: record.id
        })
        record.processStatus = data
      }
      return records
    },
    defaultCompanySerialNo() {
      return defaultCompanySerialNo
    },
    dateTimeStr,
    handleDateTimeChange() {
      if (this.search.dateTime) {
        this.search.startCreateTime = this.search.dateTime[0]
        this.search.endCreateTime = this.search.dateTime[1]
      } else {
        this.search.startCreateTime = ''
        this.search.endCreateTime = ''
      }
      this.initList()
    },
    // 新增商户/商户详情
    handleOperate(type, row) {
      let name = ''
      const query = { type, id: row?.id }
      switch (type) {
        case 'add':
        case 'edit':
          name = 'companyMerchantOperate'
          break
        case 'detail':
          name = 'companyMerchantDetail'
          break
      }
      this.$router.push({ name, query })
    }
  }
}
</script>

<style scoped lang="scss"></style>
