<template>
  <div class="page-detail">
    <steps class="steps-box" :steps="steps" :currentStep="currentStep"></steps>
    <basicInfo
      v-if="currentStep === 1"
      :defualtTempWorkflowModel="processDetailInfo.tempWorkflowModel"
      :defualtFieldTableData="tempFormInfo.tempFormVos"
      :defualtFormPersonData="tempFormInfo.peopleFormVos"
      @nextStep="nextStep"
    />
    <flowSetting v-else @beforeStep="beforeStep"></flowSetting>
  </div>
</template>
<script>
import steps from '@/components/steps';
import basicInfo from './basic.vue';
import flowSetting from './flow.vue';
import { queryProcessDetail, selectTempForm } from '@/api/process';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      currentStep: 1,
      steps: [
        { id: 1, name: '基础设置' },
        { id: 2, name: '流程设置' }
      ],
      processDetailInfo: {
        tempWorkflowModel: {
          tenantId: null,
          workFlowRepeatType: 1,
          otherCompanyIds: [],
          company: {},
          otherCompany: [],
          companyDto: {},
          otherCompanyModels: []
        }
      },
      tempFormInfo: {},
      tempFormVos: {}
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'processView') {
        vm.currentStep = 2;
      }
    });
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapState({
      processDefKey(state) {
        return state.process.processDefKey || this.$route.query.processDefKey;
      }
    })
  },
  components: { steps, basicInfo, flowSetting },
  methods: {
    init() {
      if (this.processDefKey) {
        this.$store.dispatch('process/changeProcessDefKey', this.processDefKey);
        queryProcessDetail({ processDefKey: this.processDefKey }).then(res => {
          let tempWorkflowModel = res.data.tempWorkflowModel;
          this.$store.dispatch('process/changeCompanyId', tempWorkflowModel.companyDto.companyId);
          this.$store.dispatch('process/changeCompanyName', tempWorkflowModel.processDefName);
          this.$store.dispatch('process/changeWorkflowStatus', tempWorkflowModel.status);
          this.$store.dispatch('process/changeFlowchartInfo', {
            edges: res.data.edges || [],
            nodes: res.data.nodes || []
          });
          tempWorkflowModel.companyId = tempWorkflowModel.companyDto.companyId;
          tempWorkflowModel.otherCompanyIds = [];
          if (tempWorkflowModel.otherCompanyModels && tempWorkflowModel.otherCompanyModels.length) {
            tempWorkflowModel.otherCompanyModels.forEach(item => {
              tempWorkflowModel.otherCompanyIds.push(item.companyId);
            });
          } else {
            tempWorkflowModel.otherCompanyIds = [];
          }
          this.processDetailInfo = res.data;
        });
        selectTempForm({ processDefKey: this.processDefKey }).then(res => {
          this.tempFormInfo = res.data;
          this.$store.dispatch('process/changeConditionList', res.data.tempFormVos);
          this.$store.dispatch('process/changeFormPersonList', res.data.peopleFormVos);
        });
      }
    },
    //上一步
    beforeStep() {
      if (this.currentStep <= 1) {
        return;
      }
      this.currentStep = this.currentStep - 1;
      this.init();
      document.body.scrollIntoView();
    },
    //下一步
    nextStep() {
      if (this.currentStep >= this.steps.length) {
        return;
      }
      this.currentStep = this.currentStep + 1;
      this.init();
      document.body.scrollIntoView();
    }
  }
};
</script>

<style lang="scss" scoped>
.steps-box {
  display: flex;
  justify-content: center;
}
</style>
