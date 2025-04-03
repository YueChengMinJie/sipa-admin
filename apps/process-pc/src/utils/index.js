import remoteLoad from './remoteLoad';

const { AMapCDN, AMapUiCDN } = require('@/plugins/cdn');

/**
 * 用于将地址后面的参数转换成对象返回
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  );
}

/**
 * 函数防抖
 * @param {Function} func
 * @param {number} delay
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, delay = 300, immediate = false) {
  let timer,
    context = this;
  return (...args) => {
    if (immediate) {
      func.apply(context, args);
      immediate = false;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * 获取geoJson数据  通过高德获取    递归获取区县geoJson
 * @param  {string} adcode  行政区code
 * @param  {string} childAdcode 区县级行政区code
 * @return {Array}
 */
export function getGeoJson(adcode, childAdcode = '') {
  return new Promise((resolve, reject) => {
    if (window.AMap && window.AMapUI) {
      insideFun(adcode, childAdcode);
    } else {
      remoteLoad(AMapCDN).then(() => {
        if (window.AMap) {
          remoteLoad(AMapUiCDN).then(() => {
            if (window.AMapUI) {
              insideFun(adcode, childAdcode);
            } else {
              console.error('AMapUI获取失败');
            }
          });
        } else {
          console.error('AMap获取失败');
        }
      });
    }

    function insideFun(adcode, childAdcode) {
      // eslint-disable-next-line
      AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
        var districtExplorer = new DistrictExplorer();
        districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
          if (error) {
            console.error(error);
            reject(error);
            return;
          }
          let Json = areaNode.getSubFeatures();
          if (Json.length === 0) {
            let parent = areaNode._data.geoData.parent.properties.acroutes;
            insideFun(parent[parent.length - 1], adcode);
            return;
          }

          if (childAdcode) {
            Json = Json.filter(item => {
              return item.properties.adcode == childAdcode;
            });
          }
          let mapJson = {
            features: Json
          };
          resolve(mapJson);
        });
      });
    }
  });
}

/**
 * 转换JSON  导出
 * @param  {Array}
 * @return {Array}
 */

export function formatJson(arr, filterVal) {
  return arr.map(v => filterVal.map(j => v[j].toString()));
}

/**
 * @param {date} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time = null, fmt = 'yyyy-MM-dd') {
  if (!time) {
    time = new Date();
  }
  const date = new Date(time);
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

/**
 *数字翻牌器格式化千分符
 */
export function DataVformatter(number = []) {
  const numbers = number
    .toString()
    .split('')
    .reverse();
  const segs = [];

  while (numbers.length) segs.push(numbers.splice(0, 3).join(''));

  return segs
    .join(',')
    .split('')
    .reverse()
    .join('');
}

/** 权限接口数据格式化
 * @param {String/JSON} data
 */
let permissionData = null;
let parentCode = '';

export function transferPermissionData(data = [], currentModule = '/screen') {
  const currentPermissionData = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].code === currentModule) {
      currentPermissionData.push(data[i]);
      break;
    }
  }

  permissionData = currentPermissionData; //JSON.parse(JSON.stringify(data));
  let roles = [],
    permissionMap = {};
  getPermissionMap(currentPermissionData, roles, permissionMap);
  return { roles, permissionMap };
}

function getPermissionMap(data, roles, permissionMap) {
  for (let i in data) {
    if (data[i].type != 'button' && data[i].code) {
      roles.push(data[i].code);
    }
    //页面级别
    if (data[i].level0 >= 3) {
      parentCode = data[i].code;
      if (data[i].code == null) {
        getFunctionById(permissionData, data[i].parentId);
      }
      permissionMap[parentCode] = permissionMap[parentCode] || [];
      for (let j in data[i].functionCodeVOList) {
        permissionMap[parentCode].push(data[i].functionCodeVOList[j].code);
      }
    } else if (data[i].functionCodeVOList && data[i].functionCodeVOList.length > 0) {
      getPermissionMap(data[i].functionCodeVOList, roles, permissionMap);
    }
  }
  return { roles, permissionMap };
}

function getFunctionById(data, id) {
  for (let i in data) {
    if (data[i].id === id) {
      parentCode = data[i].code;
    }
    if (data[i].functionCodeVOList && data[i].functionCodeVOList.length > 0) {
      getFunctionById(data[i].functionCodeVOList, id);
    }
  }
}
