const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, dir);
}

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  productionSourceMap: false,
  outputDir: 'dist',
  publicPath: './',
  lintOnSave: !isProd,
  devServer: {
    port: 7120,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    // before: require('./mock/mock-server.js'),
    proxy: {
      '/sso-idp-server': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        headers: {
          Connection: 'keep-alive'
        }
      },
      '/process-service-server': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        headers: {
          Connection: 'keep-alive'
        }
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "~@/styles/variables.scss";`
      },
      postcss: {
        exclude: /node_modules/
      }
    }
  },
  configureWebpack: {
    name: process.env.VUE_APP_BASE_NAME,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    // 设置svg
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // 设置开发环境sourceMap
    config.when(!isProd, config => config.devtool('cheap-source-map'));
    // 生产环境
    config.when(isProd, config => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            maxSize: 400000,
            chunks: 'initial'
          },
          antDesignVue: {
            name: 'chunk-antDesignVue',
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/,
            priority: 20,
            maxSize: 500000
          },
          commons: {
            name: 'chunk-commons',
            test: /[\\/]src[\\/]js[\\/]/,
            minChunks: 2, //  minimum common number
            priority: 5,
            maxSize: 400000,
            reuseExistingChunk: true
          }
        }
      });

      config.optimization.runtimeChunk('single');

      // 去除生产环境debugger 和console
      config.optimization.minimizer('terser').tap(args => {
        args[0].terserOptions.compress.warnings = false;
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        args[0].terserOptions.compress.pure_funcs = ['console.*'];
        return args;
      });
      // g-zip开启
      config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [
        {
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$|\.css/, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          minRatio: 0.8
        }
      ]);
      // 打包大小分析
      if (process.env.NPM_CONFIG_REPORT === 'true') {
        config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
      }
    });
  },
  transpileDependencies: ['sipa-boot-sdk-js']
};
