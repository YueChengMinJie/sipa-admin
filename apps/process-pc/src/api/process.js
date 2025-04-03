import request from '@/utils/request';

/**
 * @description 获得主体列表
 */
export function getProcessList(data) {
  return request.post('/process-service-server/process/definition/processConfigQuery', data);
}

/**
 * @description 复制流程
 */
export function copyAllTemp(data) {
  return request.post('/process-service-server/tempWorkflow/copyAllTemp', data);
}

/**
 * @description 流程状态启用/停用
 */
export function updateWorkFlowStatus(data) {
  return request.post('/process-service-server/workflow/updateWorkFlowStatus', data);
}

/**
 * @description 查询流程详情
 */
export function queryProcessDetail(data) {
  return request.post('/process-service-server/process/definition/queryProcessDetail', data);
}

/**
 * @description 查询已发布流程详情
 */
export function queryDeployedProcessDetail(data) {
  return request.post('/process-service-server/process/definition/queryDeployedProcessDetail', data);
}

/**
 * @description 检查流程定义名称是否存在
 */
export function checkProcessDefName(data) {
  return request.get('/process-service-server/workflow/checkProcessDefName', data);
}

/**
 * @description 基础设置-保存临时表单
 */
export function saveTempForm(data) {
  return request.post('/process-service-server/tempForm/saveTempForm', data);
}

/**
 * @description 基础设置-修改临时表单
 */
export function updateTempFormField(data) {
  return request.post('/process-service-server/tempForm/updateTempFormField', data);
}

/**
 * @description 基础设置-删除临时表单
 */
export function deleteTempFormField(data) {
  return request.post('/process-service-server/tempForm/deleteTempFormField', data);
}

/**
 * @description 基础设置-查询临时表单
 */
export function selectTempForm(data) {
  return request.get('/process-service-server/tempForm/selectTempForm', data);
}

/**
 * @description 暂存基本信息
 */
export function storageTempWorkflow(data) {
  return request.post('/process-service-server/process/definition/storageTempWorkflow', data);
}

/**
 * @description 暂存流程图信息
 */
export function saveChartLine(data) {
  return request.post('/process-service-server/process/definition/storageChartLine', data);
}

/**
 * @description 发布
 */
export function deployProcess(data) {
  return request.post('/process-service-server/process/definition/deployTempWorkflow', data);
}

/**
 * @description 导出
 */
export function exportProcess(data) {
  return request.post('/process-service-server/process/definition/exportWorkflowInstance', data);
}

/**
 * @description 导入检查是否重复
 */
export function importProcessCheck(data) {
  return request.post('/process-service-server/process/definition/importWorkflowCheckExisted', data);
}

/**
 * @description 导入
 */
export function importProcess(data) {
  return request.post('/process-service-server/process/definition/importWorkflowInstance', data);
}
