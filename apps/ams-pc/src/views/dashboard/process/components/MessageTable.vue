<!--
 * @Author: caszhou
 * @Date: 2023-07-18 17:18:07
 * @Description: S/N列表
-->

<template>
  <div v-loading="loading" class="message-table">
    <el-table :data="tableData" class="app-table" row-key="id">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="消息" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.msg || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="80">
        <template slot-scope="scope">
          <el-link
            class="operate"
            v-if="scope.row.status === 0"
            icon="el-icon-document-checked"
            @click="handleOperate('read', scope.row)"
          >
            已读
          </el-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
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
  </div>
</template>

<script>
import MixinPage from '@/utils/mixinPage'
import { operateSuccess } from '@/utils/text'
import { messagePage, updateMessage } from '@/api/message-service-server'

export default {
  mixins: [MixinPage],
  data() {
    return {
      listApi: messagePage,
      search: {}
    }
  },
  watch: {
    ['pagination.total'](val) {
      this.$emit('loaded', val)
    }
  },
  async mounted() {
    await this.initList()
  },
  methods: {
    async handleOperate(type, row) {
      if (type === 'read') {
        await updateMessage({
          messageId: row?.id
        })
        this.$message.success(operateSuccess)
        await this.getList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.message-table {
  overflow: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pagination {
  text-align: center;
  margin-top: 10px;
}
</style>
