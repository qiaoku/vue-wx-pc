const webpack = require('webpack');
module.exports = {
    publicPath: './',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/qidian': {
                target: 'http://101.37.116.134:3001',
                // target: 'http://192.168.0.169:3001',
                changeOrigin: true,
                pathRewrite: {
                    '/qidian': ''
                }
            },
        }
    },
    configureWebpack: {

        plugins: [
 
           new webpack.ProvidePlugin({
 
             $:"jquery",
 
             jQuery:"jquery",
 
             "windows.jQuery":"jquery"
 
           })
 
         ]
 
     }
}