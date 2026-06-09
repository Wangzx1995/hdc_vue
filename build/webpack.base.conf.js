var path = require("path");
var utils = require("./utils");
var config = require("../config");
var vueLoaderConfig = require("./vue-loader.conf");
const { test } = require("shelljs");

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

module.exports = {
    entry: {
        app: ["babel-polyfill", "./src/main.js"],
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath:
            process.env.NODE_ENV === "production"
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath,
    },
    resolve: {
        extensions: [".js", ".vue", ".json"],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
        },
    },
    module: {
        rules: [
            // {
            //   test: /\.(js|vue)$/,
            //   loader: 'eslint-loader',
            //   enforce: 'pre',
            //   include: [resolve('src'), resolve('test')],
            //   options: {
            //     formatter: require('eslint-friendly-formatter')
            //   }
            // },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: "vue-loader",
                        options: vueLoaderConfig,
                    },
                    {
                        loader: "iview-loader",
                        options: {
                            prefix: false,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [resolve("src"), resolve("test")],
                options: {
                    presets: [["env", { modules: false }]],
                },
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 10000,
                    name: utils.assetsPath("images/[name].[hash:7].[ext]"),
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 0,
                    name: utils.assetsPath("fonts/[name].[hash:7].[ext]"),
                },
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: "url-loader",
                options: {
                    limit: 4096,
                    fallback: {
                        loader: "file-loader",
                        options: {
                            name: "media/[name].[hash:8].[ext]",
                        },
                    },
                },
            },
            {
                test: /iview.src.*?js$/,
                loader: "babel-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/hui/src/utils"),
                ],
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/web-control/dist"),
                ],
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/hui/src/locale"),
                ],
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/ol"),
                    resolve("node_modules/ol/renderer/webgl"),
                ],
            },
            {
                test: /\.(js|vue)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [resolve("node_modules/ol")],
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/geotiff"),
                ],
            },
        ],
    },
};
