<template>
  <div>
    <div class="flow-title">{{ processDefName }}</div>
    <div class="flow-container">
      <a-row>
        <a-col>
          <div id="toolbar">
            <span data-command="zoomIn" class="command"><a-icon type="zoom-in" />放大</span>
            <span data-command="zoomOut" class="command"><a-icon type="zoom-out" />缩小</span>
            <span data-command="resetZoom" class="command"><a-icon type="reload" />还原</span>
            <span data-command="multiSelect" class="command"><a-icon type="table" />多选</span>
          </div>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="2">
          <div id="itempannel">
            <div
              id="startNode"
              class="getItem"
              data-type="node"
              data-shape="start-node"
              data-nodeType="1"
              data-title="发起人"
            >
              发起人
            </div>
            <div
              id="approveNode"
              class="getItem"
              data-type="node"
              data-shape="approve-node"
              data-nodeType="2"
              data-title="审批人"
            >
              审批人
            </div>
            <div
              id="copyNode"
              class="getItem"
              data-type="node"
              data-shape="copy-node"
              data-nodeType="4"
              data-title="抄送人"
            >
              抄送人
            </div>
            <div
              id="handleNode"
              class="getItem"
              data-type="node"
              data-shape="handle-node"
              data-nodeType="10"
              data-title="办理人"
            >
              办理人
            </div>
            <div
              id="conditionStartNode"
              class="getItem"
              data-type="node"
              data-shape="condition-start-node"
              data-nodeType="11"
              data-title="条件开始"
            >
              条件开始
            </div>
            <div
              id="conditionNode"
              class="getItem"
              data-type="node"
              data-shape="condition-node"
              data-nodeType="3"
              data-title="条件"
            >
              条件
            </div>
            <div
              id="parallelStartNode"
              class="getItem"
              data-type="node"
              data-shape="parallel-start-node"
              data-nodeType="5"
              data-title="并行开始"
            >
              并行开始
            </div>
            <div
              id="parallelApproveNode"
              class="getItem"
              data-type="node"
              data-shape="parallel-approve-node"
              data-nodeType="8"
              data-title="并行审批人"
            >
              并行审批人
            </div>
            <div
              id="parallelHandleNode"
              class="getItem"
              data-type="node"
              data-shape="parallel-handle-node"
              data-nodeType="9"
              data-title="并行办理人"
            >
              并行办理人
            </div>
            <div
              id="endNode"
              class="getItem"
              data-type="node"
              data-shape="end-node"
              data-nodeType="7"
              data-title="结束"
            >
              结束
            </div>
          </div>
        </a-col>
        <a-col :span="22">
          <div id="editor-container" />
        </a-col>
      </a-row>
      <div id="contextmenu">
        <a-button data-command="delete" class="command">删除</a-button>
      </div>
      <!-- 脚部按钮 -->
      <div class="page-footer">
        <a-button @click="onCancel">取消</a-button>
        <a-button @click="onSave" :loading="btnSaveLoading" v-if="workflowStatus !== 1 && workflowStatus !== 2">
          暂存
        </a-button>
        <a-button @click="beforeStep" :loading="btnBeforeLoading">上一步</a-button>
        <a-button type="primary" @click="onSubmit" :loading="btnSubmitLoading"> 发布</a-button>
      </div>
      <copy-drawer ref="copyDrawer" @onDrawerConfirm="handleDrawerConfirm" />
      <handle-drawer ref="handleDrawer" @onDrawerConfirm="handleDrawerConfirm" />
      <condition-drawer ref="conditionDrawer" @onDrawerConfirm="handleDrawerConfirm" />
      <approve-drawer ref="approveDrawer" @onDrawerConfirm="handleDrawerConfirm" />
    </div>
  </div>
</template>

<script>
import G6Editor from '@antv/g6-editor';
import { mapState } from 'vuex';
import { deployProcess, queryProcessDetail, saveChartLine } from '@/api/process';
import { ApproveDrawer, ConditionDrawer, CopyDrawer, HandleDrawer } from './drawer';
import registerNode from './registerNode';

registerNode(G6Editor);

export default {
  data() {
    return {
      editor: null,
      btnSaveLoading: false,
      btnBeforeLoading: false,
      btnSubmitLoading: false,
      processDefName: null
    };
  },

  components: {
    CopyDrawer,
    ConditionDrawer,
    HandleDrawer,
    ApproveDrawer
  },

  async mounted() {
    this.initG6Editor();
    try {
      const { data } = await queryProcessDetail({ processDefKey: this.processDefKey });
      const { tempWorkflowModel = {} } = data;
      this.processDefName = tempWorkflowModel.processDefName;
    } catch (error) {
      console.error(error);
    }
  },

  destroyed() {
    this.editor.destroy();
  },

  computed: {
    ...mapState({
      createName(state) {
        return state.user.accountInfo.name;
      },
      processDefKey(state) {
        return state.process.processDefKey;
      },
      flowChartInfo(state) {
        return state.process.flowChartInfo;
      },
      workflowStatus(state) {
        return state.process.status;
      }
    })
  },

  methods: {
    initG6Editor() {
      const editor = new G6Editor();
      this.editor = editor;
      G6Editor.track(false);
      const flow = new G6Editor.Flow({
        graph: {
          container: 'editor-container'
        },
        align: {
          line: {
            stroke: '#dadce0',
            lineWidth: 1
          },
          item: true
        },
        edge: {
          shape: 'flow-smooth'
        }
      });

      const itempannel = new G6Editor.Itempannel({
        container: 'itempannel'
      });
      const toolbar = new G6Editor.Toolbar({
        container: 'toolbar'
      });
      const contextmenu = new G6Editor.Contextmenu({
        container: 'contextmenu'
      });

      editor.add(flow);
      editor.add(itempannel);
      editor.add(toolbar);
      editor.add(contextmenu);

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

      this.editor.getCurrentPage().on('afterchange', e => {
        if (e.action === 'add' && e.item.model.type === 'node') {
          e.item.model.createName = this.createName;
          const nodes = this.editor.getCurrentPage().getNodes();
          const startNodes = nodes.filter(item => item.model.shape === 'start-node');
          const endNodes = nodes.filter(item => item.model.shape === 'end-node');
          if (startNodes.length > 1 || endNodes.length > 1) {
            this.editor.getCurrentPage().remove(e.item);
            this.$message.error('只能有一个开始节点或结束节点');
          }
        }
      });

      if (this.$route.query.type === 'edit') {
        this.editor.getCurrentPage().read(this.flowChartInfo);
      }
    },

    /**
     * 取消
     */
    onCancel() {
      this.$confirm({
        content: '该操作不会保存当前数据，是否继续？',
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: () => {
          this.$router.replace({ path: '/process' });
        }
      });
    },
    /**
     * 上一步
     */
    beforeStep() {
      queryProcessDetail({ processDefKey: this.processDefKey }).then(async ({ data }) => {
        const oldEdges = data.edges;
        const oldNodes = data.nodes;
        const newEdges = this.editor.getCurrentPage().save().edges;
        const newNodes = this.editor.getCurrentPage().save().nodes;
        newEdges && newEdges.map(item => delete item.index);
        if (
          JSON.stringify(oldNodes) === JSON.stringify(newNodes) &&
          JSON.stringify(oldEdges) === JSON.stringify(newEdges)
        ) {
          this.$emit('beforeStep');
        } else {
          const { nodes = [], edges = [] } = this.editor.getCurrentPage().save();
          if (nodes.length > 0 && edges.length > 0) {
            this.btnBeforeLoading = true;
            try {
              await saveChartLine({
                nodes,
                edges,
                processDefKey: this.processDefKey
              });
              this.btnBeforeLoading = false;
            } catch (error) {
              this.btnBeforeLoading = false;
              console.error(error);
            }
          }
          this.$store.dispatch('process/changeFlowchartInfo', {
            edges,
            nodes
          });
          this.$emit('beforeStep');
        }
      });
    },

    updateGraph(key, value) {
      this.editor.executeCommand(() => {
        const page = this.editor.getCurrentPage();
        const selectedItems = page.getSelected();
        selectedItems.forEach(item => {
          const updateModel = {};
          updateModel[key] = value;
          page.update(item, updateModel);
        });
      });
    },

    handleDrawerConfirm(value) {
      Object.keys(value).forEach(key => {
        this.updateGraph(key, value[key]);
      });
    },

    async onSave() {
      const { nodes = [], edges = [] } = this.editor.getCurrentPage().save();
      if (nodes.length > 0 && edges.length > 0) {
        this.btnSaveLoading = true;
        try {
          await saveChartLine({
            nodes,
            edges,
            processDefKey: this.processDefKey
          });
          this.$message.success('暂存成功');
          this.btnSaveLoading = false;
        } catch (error) {
          this.btnSaveLoading = false;
          console.error(error);
        }
      } else {
        this.$message.success('暂存成功');
      }
    },

    async onSubmit() {
      const { nodes = [], edges = [] } = this.editor.getCurrentPage().save();
      if (nodes.length > 0 && edges.length > 0) {
        this.btnSubmitLoading = true;
        try {
          const processDefKey = this.processDefKey;
          await saveChartLine({
            nodes,
            edges,
            processDefKey
          });
          await deployProcess({ processDefKey });
          this.$message.success('发布成功');
          this.btnSubmitLoading = false;
          this.$router.replace({ path: '/process' });
        } catch (error) {
          this.btnSubmitLoading = false;
          console.error(error);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flow-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.1);
  border-top: 1px solid #eaeaea;
  margin-left: -20px;
  width: calc(100vw - 48px);
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

  #itempannel {
    border-right: 1px solid #dadce0;
    padding-right: 10px;
    padding-bottom: 30px;
    box-sizing: border-box;
    overflow-y: scroll;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-content: flex-start;

    .getItem {
      width: 120px;
      height: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 12px;
      border-radius: 5px;
      margin-top: 20px;
      cursor: move;
      user-select: none;
    }

    #startNode {
      background: #1890ff;
    }

    #approveNode {
      background: #fb602d;
    }

    #copyNode {
      background: #6bc2fc;
    }

    #handleNode {
      background: #ff9552;
    }

    #conditionStartNode {
      background: #d7613f;
    }

    #conditionNode {
      background: #fca315;
    }

    #parallelStartNode {
      background: #5624d4;
    }

    #parallelApproveNode {
      background: #576a95;
    }

    #parallelHandleNode {
      background: #1fce76;
    }

    #endNode {
      background: #1890ff;
    }
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  @media screen and (max-height: 1400px) {
    #itempannel {
      height: 1000px;
    }
    #editor-container {
      min-height: 1000px;

      canvas {
        display: block;
        width: 100%;
      }
    }
  }
  @media screen and (max-height: 740px) {
    #itempannel {
      height: 430px;
    }
    #editor-container {
      min-height: 430px;

      canvas {
        display: block;
        width: 100%;
      }
    }
  }
  @media screen and (max-height: 610px) {
    #itempannel {
      height: 300px;
    }
    #editor-container {
      min-height: 300px;

      canvas {
        display: block;
        width: 100%;
      }
    }
  }
}
</style>
