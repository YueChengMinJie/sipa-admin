// 流程管理相关
const state = {
  processDefKey: null,
  companyId: null,
  companyName: null,
  conditionList: [],
  formPersonList: [],
  flowChartInfo: {},
  status: null
};

const mutations = {
  CHANGE_PROCESS_DEF_KEY(state, processDefKey) {
    state.processDefKey = processDefKey;
  },
  CHANGE_COMPANY_ID(state, companyId) {
    state.companyId = companyId;
  },
  CHANGE_COMPANY_NAME(state, companyName) {
    state.companyName = companyName;
  },
  SET_CONDITION_LIST(state, conditionList) {
    state.conditionList = conditionList;
  },
  SET_FORM_PERSON_LIST(state, formPersonList) {
    state.formPersonList = formPersonList;
  },
  SET_FLOW_CHART_INFO(state, flowChartInfo) {
    state.flowChartInfo = flowChartInfo;
  },
  SET_WORK_FLOW_STATUS(state, status) {
    state.status = status;
  }
};

const actions = {
  changeProcessDefKey({ commit }, value) {
    commit('CHANGE_PROCESS_DEF_KEY', value);
  },
  changeCompanyId({ commit }, value) {
    commit('CHANGE_COMPANY_ID', value);
  },
  changeCompanyName({ commit }, value) {
    commit('CHANGE_COMPANY_NAME', value);
  },
  changeConditionList({ commit }, value) {
    commit('SET_CONDITION_LIST', value);
  },
  changeFormPersonList({ commit }, value) {
    commit('SET_FORM_PERSON_LIST', value);
  },
  changeFlowchartInfo({ commit }, value) {
    commit('SET_FLOW_CHART_INFO', value);
  },
  changeWorkflowStatus({ commit }, value) {
    commit('SET_WORK_FLOW_STATUS', value);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
