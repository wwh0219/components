const glob = require('glob')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const files = glob.sync('./packages/*')
const entry = files.reduce((result, current) => {
  result[current.replace('./packages/', '')] = path.resolve(__dirname, current)
  return result
}, {})
module.exports = {
  entry,
  mode: 'production',
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.tsx?$/,
        loader: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              compiler: 'ttypescript'
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.jsx?$/,
        loader: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: [
          {
            loader: 'vue-loader',
            options: {
              optimizeSSR: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        include: path.resolve(__dirname, './src/assets'),
        use: path.resolve(__dirname, './loader.js')
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        exclude: path.resolve(__dirname, './src/assets'),
        use: {
          loader: 'url-loader',
          options: {
            limit: 1,
            fallback: {
              loader: 'file-loader',
              options: {
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          }, // 将 CSS 转化成 CommonJS 模块
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: false
            }
          },
          'sass-loader' // 将 Sass 编译成 CSS，默认使用 Node Sass
        ]
      }

    ]
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin()
  ],
  resolve: {
    modules: ['node_modules'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
      packages: path.resolve(__dirname, './packages')
    },
    extensions: [
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm',
      '.ts',
      '.tsx'
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [new OptimizeCSSAssetsPlugin({}), new UglifyJsPlugin()],
    splitChunks: {
      cacheGroups: {
        style: {
          name: 'index',
          test: /\.css$|\.scss$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}
