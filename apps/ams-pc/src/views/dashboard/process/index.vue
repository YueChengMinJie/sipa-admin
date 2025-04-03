<template>
  <div class="app-container d-c">
    <div class="d-b d-b1">
      <div class="d-t">
        <div class="d-t1">流程审批</div>
      </div>
      <div class="d-t-g">
        <el-tabs v-model="activeName" @tab-click="handleTabClick" class="d-t-t">
          <el-tab-pane :label="`待处理(${pendNum})`" name="pend">
            <process-task-table ref="table1" :type="0" />
          </el-tab-pane>
          <el-tab-pane label="已处理" name="deal">
            <process-task-table ref="table2" :type="1" />
          </el-tab-pane>
          <el-tab-pane label="我发起的" name="launch">
            <process-task-table ref="table3" :type="2" />
          </el-tab-pane>
          <el-tab-pane :label="`我收到的(${receiveNum})`" name="receive">
            <process-task-table ref="table4" :type="3" />
          </el-tab-pane>
        </el-tabs>
        <div class="more">查看更多</div>
      </div>
    </div>

    <div class="d-b d-b1">
      <div class="d-t">
        <div class="read-all" @click="handleReadAll">全部已读</div>
      </div>
      <div class="d-t-g">
        <div class="d-t1">
          {{ `通知(${messageTotal})` }}
        </div>
        <message-table ref="messageTableRef" @loaded="handleMessageLoaded" />
      </div>
    </div>

    <div class="d-b d-b1">
      <div class="d-t">
        <div class="task-more">查看更多</div>
      </div>
      <div class="d-t-g">
        <div class="d-t1">待办任务</div>
        <process-task-table ref="table1" :type="0" />
      </div>
    </div>

    <div class="d-b d-b2">
      <div class="d-t">
        <div class="d-t1">便捷导航</div>
      </div>
      <div class="d-t-g-2 company-list">
        <div v-for="company in companies" :key="company.id">
          <el-radio v-model="companyId" :label="company.id" border>
            {{ company.name }}
          </el-radio>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getClientId } from '@/utils/commonTools'
import { switchSubject } from '@/api/sso-idp-server'
import MessageTable from '@/views/dashboard/process/components/MessageTable.vue'
import ProcessTaskTable from '@/views/dashboard/process/components/ProcessTaskTable.vue'

export default {
  name: 'dashboardProcessIndex',
  components: { MessageTable, ProcessTaskTable },
  data() {
    return {
      activeName: 'pend',
      messageTotal: 0
    }
  },
  computed: {
    ...mapState({
      pendNum: state => state.dashboard.pendNum,
      receiveNum: state => state.dashboard.receiveNum,
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
  mounted() {
    this.handleTabClick({ index: '0' })
  },
  methods: {
    async handleTabClick(tab) {
      switch (tab.index) {
        case '0':
          await this.$refs.table1.getList()
          return
        case '1':
          await this.$refs.table2.getList()
          return
        case '2':
          await this.$refs.table3.getList()
          return
        case '3':
          await this.$refs.table4.getList()
          return
      }
    },
    handleMessageLoaded(messageTotal) {
      this.messageTotal = messageTotal
    },
    handleReadAll() {
      this.$refs.messageTableRef.handleOperate('read')
    }
  }
}
</script>

<style scoped lang="scss">
// dashboard-container
.d-c {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  gap: 16px;
  box-sizing: border-box;
}

// dashboard-block
.d-b {
  padding: 16px 6px;
  border: 1px solid #e7dddd;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}

// dashboard-block1
.d-b1 {
  min-width: 1000px;
  height: 280px;
  flex-grow: 1;
}

// dashboard-block2
.d-b2 {
  width: 380px;
  height: 280px;
  flex-grow: 1;
}

// dashboard-inner-container
.d-t {
  padding: 0 10px;
  position: relative;
}

.d-t-g {
  padding: 0 10px;
  position: relative;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.d-t-g-2 {
  padding: 0 10px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.more {
  position: absolute;
  right: 10px;
  top: 16px;
  font-size: 12px;
  cursor: pointer;
}

.read-all {
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 12px;
  cursor: pointer;
  z-index: 1000;
}

.task-more {
  position: absolute;
  right: 10px;
  top: 0;
  font-size: 12px;
  cursor: pointer;
}

// dashboard-title
.d-t1 {
  font-size: 14px;
  font-weight: 700;
}

// dashboard-tab
.d-t-t {
  flex: 1;
  display: flex;
  flex-direction: column;

  ::v-deep .el-tabs__content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  ::v-deep .el-tab-pane {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  ::v-deep .el-tabs__item {
    font-size: 12px;
  }
}

.company-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
}
</style>
