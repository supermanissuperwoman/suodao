// const autoprefixer = require('autoprefixer');
// const pxtorem = require('postcss-pxtorem');

// var project = require('./src/test.json')
// var euip = require('./src/equip.json')
// var one = require('./src/one.json')
// module.exports = {
//     publicPath: process.env.NODE_ENV === 'production' ? './' : '',
//     productionSourceMap: false,
//     devServer: {
//         before(app) {
//             app.get('/test/projcet', (req, res) => {
//                 res.json({
//                     errno: 0,
//                     data: project
//                 })
//             }),
//             app.get('/test/equip', (req, res) => {
//                 res.json({
//                     errno: 0,
//                     data: euip
//                 })
//             }),
//             app.get('/test/one', (req, res) => {
//                 res.json({
//                     errno: 0,
//                     data: one
//                 })
//             })
//         }
//     },
//     css: {
//         loaderOptions: {
//           postcss: {
//             plugins: [
//               autoprefixer(),
//               pxtorem({
//                 rootValue: 192, //设计稿宽度为1920px的
//                 propList: ['*']
//               })
//             ]
//           }
//         }
//       },
// }

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// 定义压缩文件类型
const productionGzipExtensions = ["js", "css"];
module.exports = {
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
  },
};
