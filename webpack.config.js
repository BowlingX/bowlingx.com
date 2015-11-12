/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 David Heidrich, BowlingX <me@bowlingx.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var path = require("path");
var webpack = require("webpack"), fs = require('fs');
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var glob = require('glob');

var entries = {
    'js/app': ['App'],
    'css/layout': ['sass/layout.scss']
};

module.exports = {
    watch: false,
    module: {
        loaders: [
            {
                include: [
                    path.resolve(__dirname, "src"),
                    fs.realpathSync(path.resolve(__dirname, "node_modules/flexcss"))
                ],
                test: /\.jsx?$/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(
                    // activate source maps via loader query
                    'css!' +
                    'autoprefixer?browsers=last 2 versions!' +
                    'sass?outputStyle=expanded&sourceMap=false'
                )
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg|jpg|jpeg)$/,
                loaders: [
                    'url-loader?limit=1000',
                    'image-webpack?{bypassOnDebug:true, progressive:true, optimizationLevel: 7, ' +
                    'interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            }

        ],
        preLoaders: [

            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "main/assets/js")
                ],
                loader: "eslint-loader"
            }
        ]
    },
    resolve: {
        modulesDirectories: [
            'assets/',
            'src',
            'src/main',
            'node_modules'
        ]
    },
    entry: entries,
    output: {
        publicPath:'/build/',
        path: __dirname + "/build",
        filename: '[name].js',
        libraryTarget: 'umd',
        library: '[name]',
        sourceMapFilename: 'js/[name].map',
        chunkFilename: 'js/[id].js'
    },
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        })
    ]
};

if(process.env.NODE_ENV === 'production') {
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: false}));
}