<!--
 * @Author: caszhou
 * @Date: 2023-07-18 17:18:07
 * @Description: S/N列表
-->

<template>
  <div v-loading="loading" class="process-task-table">
    <el-table :data="tableData" class="app-table" row-key="id">
      <el-table-column label="序号" width="60">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ dateTimeStr(scope.row.createTime) || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="提交人" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.originatorName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="流程描述" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.approvalName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="业务数据" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="scope.row.approvalType === 1">
            <el-link type="primary" @click="toCompanyDetail(scope.row.businessKey)">
              {{ scope.row.businessKey }}
            </el-link>
          </div>
          <span v-else>
            {{ scope.row.businessKey || '--' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100" show-overflow-tooltip v-if="type === 1">
        <template slot-scope="scope">
          {{ taskOptions.get(scope.row.approvalStatus) || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="type === 0 ? '180' : type === 1 ? '150' : '80'">
        <template slot-scope="scope">
          <el-popconfirm
            placement="top"
            class="operate"
            v-if="type === 0"
            title="你确认进行通过操作？"
            transition="el-zoom-in-left"
            @confirm="handleOperate('deal', scope.row)"
          >
            <el-link slot="reference" icon="el-icon-check">通过</el-link>
          </el-popconfirm>
          <el-popconfirm
            placement="top"
            class="operate"
            v-if="type === 0"
            title="你确认进行拒绝操作？"
            transition="el-zoom-in-left"
            @confirm="handleOperate('no', scope.row)"
          >
            <el-link slot="reference" icon="el-icon-close">拒绝</el-link>
          </el-popconfirm>
          <el-link icon="el-icon-s-order" class="operate" @click="handleOperate('record', scope.row)" v-if="type === 1">
            审批记录
          </el-link>
          <el-link icon="el-icon-sort" class="operate" @click="handleOperate('image', scope.row)">流程图</el-link>
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
    <el-drawer direction="rtl" title="流程图查看" :visible.sync="processView" size="50%">
      <su-process-preview ref="processPreview" />
    </el-drawer>
    <el-drawer direction="rtl" title="审批记录查看" :visible.sync="historyView" size="50%">
      <el-table :data="processHistory" class="w-100 p-20">
        <el-table-column label="序号" width="60">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="操作人" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.assignee || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="节点名" min-width="120">
          <template slot-scope="scope">
            {{ scope.row.taskName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" width="150">
          <template slot-scope="scope">
            {{ dateTimeStr(scope.row.taskEndTime) || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="结果" width="150">
          <template slot-scope="scope">
            {{ taskOptions.get(scope.row.approvalTaskStatus || 4) || '--' }}
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import MixinPage from '@/utils/mixinPage'
import { operateSuccess } from '@/utils/text'
import { taskOptions } from '@/utils/constants'
import { toCompanyDetail } from '@/utils/router'
import { dateTimeStr } from '@/utils/commonTools'
import { completeTask, getInstances, processInstancePreview, taskHistory } from '@/api/process-service-server'

export default {
  mixins: [MixinPage],
  props: {
    type: Number
  },
  data() {
    return {
      listApi: getInstances,
      search: {
        type: 0,
        approvalStatus: null
      },
      processView: false,
      historyView: false,
      processHistory: []
    }
  },
  computed: {
    taskOptions() {
      return taskOptions
    }
  },
  watch: {
    type: {
      immediate: true,
      handler: function (val) {
        this.search.type = val
        if (val === 0) {
          this.search.approvalStatus = 1
        }
      }
    }
  },
  methods: {
    dateTimeStr,
    toCompanyDetail,
    ...mapMutations({
      setPendNum: 'dashboard/setPendNum',
      setReceiveNum: 'dashboard/setReceiveNum'
    }),
    tableDataHook(records) {
      if (this.type === 0) {
        this.setPendNum(records.length)
      } else if (this.type === 3) {
        this.setReceiveNum(records.length)
      }
      return records
    },
    async handleOperate(type, row) {
      switch (type) {
        case 'deal':
        case 'no':
          await completeTask({
            taskId: row.taskId,
            processInsId: row.processInsId,
            variables: [
              {
                key: 'check',
                value: type === 'deal' ? 1 : 0
              }
            ]
          })
          this.$message.success(operateSuccess)
          await this.getList()
          return
        case 'record': {
          const { processInsId } = row
          const { data } = await taskHistory(processInsId)
          if (data?.length) {
            this.historyView = true
            this.processHistory = data
          } else {
            this.historyView = false
            this.processHistory = []
          }
          return
        }
        case 'image': {
          const { processInsId } = row
          const { data } = await processInstancePreview(processInsId)
          const { nodes = [], edges = [] } = data
          if (nodes.length && edges.length) {
            this.processView = true
            this.$nextTick(() => {
              this.$refs.processPreview.editor.getCurrentPage().read({ nodes, edges })
            })
          } else {
            this.$message.error('未查询到流程定义')
          }
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.process-task-table {
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
