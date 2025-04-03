module.exports = [
  {
    url: '/sso-idp-server/company/all',
    type: 'get',
    response: config => {
      return {
        code: 0,
        errorCode: '000000',
        data: [
          {
            id: 1,
            name: '苏州玥呈敏洁网络科技有限公司',
            serialNo: 'M00000000001',
            type: 1,
            status: 1,
            createName: '脚本',
            createTime: '2023-05-13 19:06:46'
          },
          {
            id: '225371635968377044',
            name: '苏州玥呈敏洁',
            serialNo: 'M00000000002',
            type: 1,
            status: 1,
            createName: '王智晶',
            createTime: '2024-07-16 20:02:26'
          }
        ]
      };
    }
  },
  {
    url: '/sso-idp-server/application/all/bcp',
    type: 'get',
    response: config => {
      return {
        code: 0,
        errorCode: '000000',
        data: [
          {
            id: 1000201,
            name: '大后台',
            url: 'http://ams.sipa.com',
            localUrl: 'http://localhost:7200/',
            devUrl: 'http://ams-dev.sipa.com',
            fatUrl: 'http://ams-fat.sipa.com',
            remark: '',
            createDefaultService: true,
            status: 1
          },
          {
            id: 1000202,
            name: '大后台-移动端',
            url: 'http://ams-mobile.sipa.com',
            localUrl: 'http://localhost:7200/',
            devUrl: 'http://ams-mobile-dev.sipa.com',
            fatUrl: 'http://ams-mobile-fat.sipa.com',
            remark: '',
            createDefaultService: true,
            status: 1
          }
        ]
      };
    }
  }
];
