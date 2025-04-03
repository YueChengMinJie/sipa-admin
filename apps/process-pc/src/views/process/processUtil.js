let processUtil = {
  // 条件类型
  fieldTypeSel: [
    { id: 1, name: '数字' },
    { id: 2, name: '多选' },
    { id: 3, name: '日期' },
    { id: 4, name: '单选' }
  ],
  symbolSel: [
    { id: 1, name: '小于', mathSign: '<' },
    { id: 2, name: '小于等于', mathSign: '≤' },
    { id: 3, name: '等于', mathSign: '=' },
    { id: 5, name: '大于等于', mathSign: '≥' },
    { id: 4, name: '大于', mathSign: '>' },
    { id: 6, name: '之间', mathSign: '~' },
    { id: 7, name: '包含', mathSign: '包含' }
  ],
  timeSymbolSel: [
    { id: 1, name: '小于', mathSign: '<' },
    { id: 2, name: '小于等于', mathSign: '≤' },
    { id: 3, name: '等于', mathSign: '=' },
    { id: 5, name: '大于等于', mathSign: '≥' },
    { id: 4, name: '大于', mathSign: '>' },
    { id: 6, name: '之间', mathSign: '~' }
  ],
  numberSymbolSel: [
    { id: 1, name: '小于', mathSign: '<' },
    { id: 2, name: '小于等于', mathSign: '≤' },
    { id: 3, name: '等于', mathSign: '=' },
    { id: 5, name: '大于等于', mathSign: '≥' },
    { id: 4, name: '大于', mathSign: '>' },
    { id: 6, name: '之间', mathSign: '-' }
  ],
  textSymbolSel: [
    { id: 3, name: '完全等于', mathSign: '=' }
    // { id: 7, name: '包含', mathSign: '包含' }
  ],
  // 审批人去重
  nodeRepeatSel: [
    { id: 1, name: '开启' },
    { id: 2, name: '关闭' }
  ],
  // 多人审批时方式
  multipleApproveSel: [
    { id: 2, name: '会签（需所有人同意）' },
    { id: 3, name: '或签（一位审批人同意或拒绝即可）' }
  ],
  //  审批人类型
  approveSel: [
    { id: 10, name: '指定成员' },
    { id: 11, name: '部门负责人' },
    { id: 13, name: '直属主管' },
    { id: 14, name: '指定标签' },
    { id: 17, name: '发起人自选' },
    { id: 15, name: '发起人自己' }
  ]
};

export default processUtil;
