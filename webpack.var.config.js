/**
 * Created by mash on 2020/10/31
 */
const baseConfig = require('./webpack.baseconfig');
const merge = require('webpack-merge').merge;
module.exports = merge(baseConfig,{
    output: {
        filename:'../dist/index.var.js',
        libraryExport: 'DragCellResize',
    },
});
