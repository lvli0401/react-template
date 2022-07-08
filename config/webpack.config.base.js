const path = require("path");
// 根据相对路径获取绝对路径
const resolvePath = (relativePath) => path.resolve(__dirname, relativePath);
// HTML模板
const HtmlWebpackPlugin = require("html-webpack-plugin");
// css 代码打包分离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 字节arco-design引入插件
const ArcoWebpackPlugin = require("@arco-plugins/webpack-react");
// 打包分析插件
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// 压缩js
const TerserPlugin = require("terser-webpack-plugin");
// 压缩css插件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const threadLoader = require("thread-loader");

const jsWorkerPool = {
  // options

  // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)
  // 当 require('os').cpus() 是 undefined 时，则为 1
  workers: 2,

  // 闲置时定时删除 worker 进程
  // 默认为 500ms
  // 可以设置为无穷大， 这样在监视模式(--watch)下可以保持 worker 持续存在
  poolTimeout: 2000,
};

const cssWorkerPool = {
  // 一个 worker 进程中并行执行工作的数量
  // 默认为 20
  workerParallelJobs: 2,
  poolTimeout: 2000,
};

threadLoader.warmup(jsWorkerPool, ["babel-loader"]);
threadLoader.warmup(cssWorkerPool, ["css-loader", "postcss-loader"]);

// 基础配置
const baseConfig = {
  // 入口文件
  entry: resolvePath("../src/index.tsx"),
  // 出口文件
  output: {
    path: resolvePath("../dist"),
    filename: "[name].bundle.js",
  },
  // 所有loader的配置都在 module.rules 中
  module: {
    rules: [
      // 对css文件的处理
      // use里的loader如果有多个的情况下，切记执行顺序是：从下到上（或者从右到左）
      // MiniCssExtractPlugin插件和style-loader冲突，所以这里用MiniCssExtractPlugin插件替换了style-loader
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "thread-loader",
            options: cssWorkerPool,
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
            options: {
              importLoaders: 1,
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]",
              sourceMap: true,
            },
          },
          "postcss-loader",
        ],
      },
      // 对less文件的处理
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      // 对ts|tsx文件的处理
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: "thread-loader",
            options: jsWorkerPool,
          },
          "babel-loader?cacheDirectory",
        ],
        exclude: /node_modules/,
      },
      // 对图片的处理
      {
        test: /\.(svg|png|jpg|gif)$/,
        type: "asset/resource",
      },
    ],
  },
  // Resolve 配置 Webpack 如何寻找模块所对应的文件
  resolve: {
    // 在导入语句没带文件后缀时，Webpack 会自动带上后缀后去尝试访问文件是否存在。  resolve.extensions用于配置在尝试过程中用到的后缀列表，默认是：js 和 json
    extensions: [".js", ".ts", ".tsx"],
    // 配置项通过别名来把原导入路径映射成一个新的导入路径
    alias: {
      "@": resolvePath("../src"),
    },
    // 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    mainFields: ["main"],
  },
  // 不用打包
  // externals: {
  //   react: "React",
  // },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/,
        safe: true,
        cache: true,
        parallel: true,
        discardComments: {
          removeAll: true,
        },
      }),
    ],
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  // 插件的处理
  plugins: [
    new HtmlWebpackPlugin({
      // title 配置
      title: "Webpack V5 + React",
      // 模板导入
      template: resolvePath("../public/index.html"),
      // 名称为
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: `[name].[hash:8].css`,
    }),
    new ArcoWebpackPlugin(),
  ].concat(
    process.env.ANALYZER
      ? new BundleAnalyzerPlugin({
          analyzerPort: 9090, // 展示打包报告的http服务器端口
        })
      : []
  ),
};
module.exports = {
  baseConfig,
};
