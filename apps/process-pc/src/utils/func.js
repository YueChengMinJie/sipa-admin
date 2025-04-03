import fmt from './fmt';

/**
 * 格式化函数转为Vue的过滤器
 * @param Vue
 */
export function fmtToFilters(Vue) {
  for (let k in fmt) {
    if (!Object.prototype.hasOwnProperty.call(fmt, k)) {
      continue;
    }
    Vue.filter(k, fmt[k]);
  }
}

//table数据值为空置显示'--'
export function formatData(data = []) {
  const arr = data;
  arr.map(item => {
    if (Object.prototype.toString.call(item) === '[object Object]') {
      for (let v in item) {
        if (!item[v] && typeof item[v] !== 'number' && typeof item[v] !== 'boolean') {
          item[v] = '--';
        }
      }
    }
  });
  return arr;
}

/**
 * 判断是否是null或undefined
 */
export function isNullOrUndefined(data) {
  return data === null || data === undefined;
}

//树转为数组
export function treeToArray(tree, children = 'children') {
  let treeCopy = JSON.parse(JSON.stringify(tree));
  let arrays = [];
  let result = [];
  arrays = arrays.concat(treeCopy);
  while (arrays.length) {
    let first = arrays.shift(); // 弹出第一个元素
    if (first[children]) {
      //如果有children
      arrays = arrays.concat(first[children]);
      delete first[children];
    }
    result.push(first);
  }
  return result;
}
