/**
 * Created by mash on 2020/10/31
 */
const uglify = require('uglifyjs-webpack-plugin');
module.exports = {
    entry: './dist/index.js',
    output: {
        libraryTarget: 'umd',
        library: 'DragCellResize',
        umdNamedDefine: true,
    },
    optimization: {
        minimizer: [
            new uglify({
                uglifyOptions: {
                    compress: false,
                },
            }),
        ],
    },
};