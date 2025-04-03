/*
 * @Author: caszhou
 * @Date: 2021-04-01 14:02:59
 * @Description: 常用公共方法(包括金额，时间，日期转换，对象操作，uuid, 颜色取反)
 */

import vue from '@/main'
import DayJs from 'dayjs'
import NP from 'number-precision'
import { MessageBox } from 'element-ui'

NP.enableBoundaryChecking(false)

/**
 * UUID生成方法
 */
export function uuid() {
  let d = Date.now()
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now()
  }
  const uuid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

/**
 * 获取浏览器滚动条宽度
 */
export function getScrollBarWidth() {
  const outer = document.createElement('div')
  outer.style.overflow = 'scroll'
  outer.style.visibility = 'hidden'
  outer.style.width = '100px'
  outer.style.height = '100%'
  outer.style.position = 'absolute'
  outer.style.top = '-9999px'
  document.body.appendChild(outer)
  const widthNoScroll = outer.offsetWidth

  const inner = document.createElement('div')
  inner.style.width = '100%'
  outer.appendChild(inner)

  const widthWithScroll = inner.offsetWidth
  outer.parentNode.removeChild(outer)
  // 父元素出现滚动条，子元素无滚动条，父元素减去子元素的宽度就是滚动条宽度
  const scrollBarWidth = widthNoScroll - widthWithScroll

  return scrollBarWidth
}

/**
 * 快速给对象赋值 只会赋值a里面有的属性
 * @param {*} a 被赋值的对象
 * @param {*} b 数据源
 * @returns a
 */
export function objectDeepCopy(a, b) {
  for (let key in a) {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      if (typeof a[key] === 'object' && typeof b[key] === 'object') {
        if (Array.isArray(a[key]) && Array.isArray(b[key])) {
          a[key] = b[key].slice()
        } else {
          a[key] = objectDeepCopy(a[key], b[key])
        }
      } else {
        a[key] = b[key]
      }
    }
  }
  return a
}

/**
 * 获取年月日时分秒详细日期
 */
export function dateTimeStr(data) {
  if (!data) return
  const date = DayJs(data)
  const Y = date.format('YYYY') + '/'
  const M = date.format('MM') + '/'
  const D = date.format('DD') + ' '
  const h = date.format('HH') + ':'
  const m = date.format('mm') + ':'
  const s = date.format('ss')
  return Y + M + D + h + m + s
}

/**
 * 解决级联选择器卡顿问题
 */
export function handleCascaderStuck() {
  this.$nextTick(() => {
    const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]')
    Array.from($el).map(item => item.removeAttribute('aria-owns'))
  })
}

function createMessageBox(msg, icon, title) {
  MessageBox({
    title,
    customClass: 'bigger-icon',
    message: vue.$createElement(
      'div',
      {
        attrs: {
          class: 'bigger'
        }
      },
      [
        vue.$createElement('img', {
          attrs: {
            src: require(`@/assets/${icon}.gif`),
            class: 'bigger-error'
          }
        }),
        vue.$createElement('div', null, msg)
      ]
    ),
    showConfirmButton: false,
    dangerouslyUseHTMLString: true
  })
    .then(() => {})
    .catch(() => {})
}

export function errorAlertWithAudio(msg) {
  createMessageBox(msg, 'error', '错误')
}

// 递归函数，查找满足条件的属性
export function findFieldName(obj, key, value, results = []) {
  for (const prop in obj) {
    if (typeof obj[prop] === 'object') {
      findFieldName(obj[prop], key, value, results)
    } else if (prop === key && obj[prop] === value) {
      results.push(obj)
      break // 如果找到匹配的属性值，停止查找该对象的其他属性
    }
  }
  return results
}

/**
 * 深拷贝 拷贝源对象返回新对象
 * @param {Object} source 源对象
 * @param {Object} uniqueRefs 优化 用于处理循环引用的漏洞
 * @returns {Object}
 */
export function deepClone(source, uniqueRefs = new WeakMap()) {
  if (source === null || typeof source !== 'object') return source
  if (uniqueRefs.has(source)) {
    return uniqueRefs.get(source)
  }
  const targetObj = Array.isArray(source) ? [] : {}
  uniqueRefs.set(source, targetObj)
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      targetObj[key] = deepClone(source[key], uniqueRefs)
    }
  }
  return targetObj
}

export function getClientId() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? 4 : 1
}
