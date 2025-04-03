/**
 * @Author: zhouxiajie86@gmail.com
 * @Date: 2023-08-15 14:53:45
 * @LastEditors: zhouxiajie86@gmail.com
 * @LastEditTime: 2023-09-25 09:51:05
 * @FilePath: /compoment-library-master/packages/core/components/button/index.js
 * @Description:
 */
import ProcessPreview from './process-preview.vue';

ProcessPreview.install = (app) => {
  app.component(ProcessPreview.name, ProcessPreview);
};

export default ProcessPreview;
