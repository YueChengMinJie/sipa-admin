module.exports = [
  {
    url: '/process-service-server/process/definition/processConfigQuery',
    type: 'post',
    response: config => {
      return {
        code: 0,
        errorCode: '000000',
        data: {
          processList: [
            {
              processDefKey: 'pk_225371832571266805',
              processDefName: '主体创建',
              tenantId: 1000201,
              companyDto: {
                companyId: 1,
                companyName: '苏州玥呈敏洁网络科技有限公司'
              },
              uploadUser: '王智晶',
              released: 1,
              status: 1,
              remark: '',
              createTime: '2024-07-16 20:27:26',
              uploadTime: '2024-07-18 17:05:46'
            }
          ],
          totalCount: 1
        }
      };
    }
  },
  {
    url: '/process-service-server/process/definition/queryDeployedProcessDetail',
    type: 'post',
    response: config => {
      return {
        code: 0,
        errorCode: '000000',
        data: {
          tempWorkflowModel: {
            processDefKey: 'pk_225371832571266805',
            processDefName: '主体创建',
            tenantId: 1000201,
            companyDto: {
              companyId: 1,
              companyName: '苏州玥呈敏洁网络科技有限公司'
            },
            uploadUser: '王智晶',
            released: 1,
            status: 1,
            remark: '',
            workFlowRepeatType: 1
          },
          nodes: [
            {
              nodeName: '发起人',
              nodeCode: 'nc_225392895823315879',
              formId: 0,
              transactUrl: '',
              type: 'node',
              shape: 'start-node',
              x: 379.3359375,
              y: 62.0,
              id: '908c1333',
              index: 0,
              title: '发起人',
              createName: '王智晶',
              special: 0,
              nodetype: 1
            },
            {
              nodeName: '审批人',
              nodeCode: 'nc_225392895823315880',
              approvalType: 2,
              nodePersonnelType: 20,
              nodeRepeatType: 2,
              formId: '225392875254973467',
              transactUrl: '',
              type: 'node',
              shape: 'approve-node',
              x: 363.3359375,
              y: 183.0,
              id: 'd81e1c17',
              index: 1,
              title: '审批人',
              content: '表单中的人',
              createName: '王智晶',
              special: 0,
              nodetype: 2
            },
            {
              nodeName: '结束',
              nodeCode: 'nc_225392895823315881',
              formId: 0,
              transactUrl: '',
              type: 'node',
              shape: 'end-node',
              x: 358.3359375,
              y: 317.0,
              id: 'deee3615',
              index: 2,
              title: '结束',
              createName: '王智晶',
              special: 0,
              nodetype: 7
            }
          ],
          edges: [
            {
              source: '908c1333',
              sourceAnchor: 0,
              target: 'd81e1c17',
              targetAnchor: 0,
              id: 'c3ff40f6'
            },
            {
              source: 'd81e1c17',
              sourceAnchor: 1,
              target: 'deee3615',
              targetAnchor: 0,
              id: 'd38a4a40'
            }
          ]
        }
      };
    }
  },
  {
    url: '/process-service-server/tempForm/selectTempForm',
    type: 'get',
    response: config => {
      return {
        code: 0,
        errorCode: '000000',
        data: {
          processDefKey: 'pk_225371832571266805',
          tempFormVos: [],
          peopleFormVos: [
            {
              tempFormId: '225392875254973467',
              formFieldName: 'zhouxiajie',
              formFieldCode: '13587756256'
            }
          ]
        }
      };
    }
  }
];
