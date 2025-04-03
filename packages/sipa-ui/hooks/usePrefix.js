/**
 * @Author: zhouxiajie86@gmail.com
 * @Date: 2023-08-15 14:53:45
 * @LastEditors: zhouxiajie86@gmail.com
 * @LastEditTime: 2023-09-25 10:00:00
 * @FilePath: /compoment-library-master/packages/core/hooks/usePrefix.js
 * @Description:
 */
import { computed } from 'vue';
import { defaultPrefix } from '@sipa-ui/core/utils/config';

export const useDefaultPrefix = (name) => computed(() => {
    const defaultName = `${defaultPrefix}-${name}`;
    return {
      defaultName,
      types: {
        isPrimary: `${defaultName}-primary`,
        isDefault: `${defaultName}-default`,
      },
    };
  });
