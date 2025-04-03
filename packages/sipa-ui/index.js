/**
 * @Author: zhouxiajie86@gmail.com
 * @Date: 2023-08-15 14:53:45
 * @LastEditors: zhouxiajie86@gmail.com
 * @LastEditTime: 2023-09-25 10:32:20
 * @FilePath: /compoment-library-master/packages/core/index.js
 * @Description:
 */
import components from './components';

export default (app) => {
  app.use(components);
};

export * from './components';
