/**
 * @Author: zhouxiajie86@gmail.com
 * @Date: 2023-08-15 14:53:45
 * @LastEditors: zhouxiajie86@gmail.com
 * @LastEditTime: 2023-09-25 10:00:43
 * @FilePath: /compoment-library-master/packages/core/rollup.config.js
 * @Description:
 */
import path from 'path';
import multiInput from 'rollup-plugin-multi-input';
import styles from 'rollup-plugin-styles';

export default [
  {
    input: ['components/**/style/index.scss', 'style/index.scss'],
    plugins: [
      multiInput(),
      styles({
        mode: ['extract'],
        alias: {
          '@sipa-ui/core': path.resolve('./'),
        },
        minimize: true,
      }),
    ],
    output: {
      dir: 'dist/',
      assetFileNames: '[name].css',
    },
    watch: {
      include: ['components/**/style/index.scss', 'style/index.scss'],
    },
  },
];
