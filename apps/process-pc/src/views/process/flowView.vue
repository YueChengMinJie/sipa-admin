<template>
  <div class="view-container">
    <div class="flow-title">{{ processDefName }}</div>
    <div class="flow-container">
      <div id="toolbar">
        <span data-command="zoomIn" class="command"><a-icon type="zoom-in" />放大</span>
        <span data-command="zoomOut" class="command"><a-icon type="zoom-out" />缩小</span>
        <span data-command="resetZoom" class="command"><a-icon type="reload" />还原</span>
        <span data-command="multiSelect" class="command"><a-icon type="table" />多选</span>
      </div>
      <su-process-preview ref="processPreview" />
      <div class="page-footer">
        <a-button @click="$router.back()">返回</a-button>
      </div>
      <copy-drawer ref="copyDrawer" :enabled="false" />
      <handle-drawer ref="handleDrawer" :enabled="false" />
      <condition-drawer ref="conditionDrawer" :enabled="false" />
      <approve-drawer ref="approveDrawer" :enabled="false" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { queryDeployedProcessDetail, selectTempForm } from '@/api/process';
import { ApproveDrawer, ConditionDrawer, CopyDrawer, HandleDrawer } from './setting/drawer';

export default {
  data() {
    return {
      processDefName: null
    };
  },

  components: {
    CopyDrawer,
    ConditionDrawer,
    HandleDrawer,
    ApproveDrawer
  },

  computed: {
    ...mapState({
      companyId(state) {
        return state.process.companyId;
      },
      conditionList(state) {
        return state.process.conditionList;
      },
      formPersonList(state) {
        return state.process.formPersonList;
      }
    })
  },

  async mounted() {
    this.initG6Editor();
    try {
      const { data } = await selectTempForm({ processDefKey: this.$route.query.processDefKey });
      if (this.conditionList.length === 0) {
        this.$store.dispatch('process/changeConditionList', data.tempFormVos);
      }
      if (this.formPersonList.length === 0) {
        this.$store.dispatch('process/changeFormPersonList', data.peopleFormVos);
      }
    } catch (error) {
      console.error(error);
    }
  },

  destroyed() {
    if (this.editor) {
      this.editor.destroy();
    }
  },

  methods: {
    initG6Editor() {
      const flow = this.$refs.processPreview.flow;
      const graph = flow.getGraph();
      graph.on('node:click', evt => {
        if (evt.button === 0) {
          const nodeType = Number(evt.item.model.nodetype);
          if (nodeType === 1 || nodeType === 7 || nodeType === 5 || nodeType === 11) return;
          if (nodeType === 4) {
            const { title, nodePersonnelType, nodeValue = [], code = [] } = evt.item.model;
            this.$refs.copyDrawer.title = title;
            this.$refs.copyDrawer.nodePersonnelType = nodePersonnelType === 16 ? null : nodePersonnelType;
            this.$refs.copyDrawer.choosedUsers = nodeValue.concat(code);
            this.$refs.copyDrawer.visible = true;
          } else if (nodeType === 10 || nodeType === 9) {
            const {
              title,
              nodePersonnelType,
              nodeValue = [],
              code = [],
              formId = null,
              transactUrl = null
            } = evt.item.model;
            this.$refs.handleDrawer.title = title;
            this.$refs.handleDrawer.nodePersonnelType = nodePersonnelType ? nodePersonnelType : 10;
            this.$refs.handleDrawer.choosedUsers = nodeValue.concat(code);
            this.$refs.handleDrawer.formId = formId;
            this.$refs.handleDrawer.transactUrl = transactUrl;
            this.$refs.handleDrawer.visible = true;
          } else if (nodeType === 2 || nodeType === 8) {
            const {
              title,
              nodePersonnelType,
              nodeValue = [],
              code = [],
              nodeRepeatType,
              approvalType,
              formId = null,
              special,
              specialBackMsg
            } = evt.item.model;
            this.$refs.approveDrawer.title = title;
            this.$refs.approveDrawer.nodePersonnelType = nodePersonnelType ? nodePersonnelType : 10;
            this.$refs.approveDrawer.nodeRepeatType = nodeRepeatType;
            this.$refs.approveDrawer.approvalType = approvalType;
            this.$refs.approveDrawer.choosedUsers = nodeValue.concat(code);
            this.$refs.approveDrawer.formId = formId;
            this.$refs.approveDrawer.isSpecialNode = special || 0;
            this.$refs.approveDrawer.specialBackMsg = specialBackMsg;
            this.$refs.approveDrawer.visible = true;
          } else if (nodeType === 3) {
            const { title, tempNodeFormModelList } = evt.item.model;
            this.$refs.conditionDrawer.title = title;
            this.$refs.conditionDrawer.conditonFormList = JSON.parse(JSON.stringify(tempNodeFormModelList || []));
            this.$refs.conditionDrawer.visible = true;
          }
        }
      });

      queryDeployedProcessDetail({ processDefKey: this.$route.query.processDefKey }).then(({ data }) => {
        const { nodes = [], edges = [], tempWorkflowModel = {} } = data;
        this.processDefName = tempWorkflowModel.processDefName;
        if (!this.companyId) {
          this.$store.dispatch('process/changeCompanyId', tempWorkflowModel.companyDto.companyId);
        }
        this.$refs.processPreview.editor.getCurrentPage().read({ nodes, edges });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.view-container {
  margin-top: -20px;
}

.flow-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.1);
  margin-left: -20px;
  width: calc(100vw - 32px);
  padding-left: 20px;
}

.flow-container {
  #toolbar {
    border-bottom: 1px solid #dadce0;
    height: 40px;
    line-height: 40px;

    .command {
      margin-right: 10px;
    }

    span {
      font-size: 14px;
      user-select: none;
      color: #333;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
