/*
 * @Author: caszhou
 * @Date: 2022-02-08 10:51:05
 * @Description: 脚手架配置文件
 */

'use strict'
const Path = require('path')
const Config = require('./src/config.js')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return Path.join(__dirname, dir)
}

/** 本地测试环境需要配置的跨域问题 */
const ifLocal = Config.env === 'local'
const proxy = {}
if (ifLocal) {
  Config.associationServices.forEach(item => {
    proxy[item.prefix] = {
      target: item.target,
      changeOrigin: true
    }
  })
}
module.exports = {
  productionSourceMap: ifLocal,
  devServer: {
    port: 7100,
    proxy,
    headers: {
      'Cache-Control': 'private, no-store, no-cache, must-revalidate, proxy-revalidate'
    }
  },
  configureWebpack: {
    name: Config.siteName,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: {
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT'
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.plugin('compressionPlugin').use(
      new CompressionWebpackPlugin({
        test: /\.js$|\.html$|\.css/, // 匹配文件名
        threshold: 1024, // 对超过1k的数据压缩
        deleteOriginalAssets: false // 不删除源文件
      })
    )
  }
}
