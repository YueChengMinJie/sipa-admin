// Description: 格式化

const fmt = {};

/**
 * 数字
 * @param v num 数字
 * @param n int 保留几位小数
 * @returns {string}
 */
fmt.number = function(v, n = 2) {
  if (typeof v === 'undefined') {
    v = 0;
  } else if (v === '--') {
    return '--';
  }
  v = v ? 0 + v : 0;
  n = Math.abs(n);
  return v.toFixed(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export default fmt;
