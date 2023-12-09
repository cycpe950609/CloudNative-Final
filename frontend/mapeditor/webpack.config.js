/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
import path from "path";
import { fileURLToPath } from "url";
import CopyPlugin from "copy-webpack-plugin";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import RemarkHTML from "remark-html";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CompressionPlugin from 'compression-webpack-plugin';
import webpack from "webpack";

const module = {
    entry: {
        index: "./ts/main.ts"
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 8080,
    },
    output: {
        filename: "js/[name].bundle.js",
        chunkFilename: "js/[name].chunk.js",
        publicPath: "public/",
        path: path.resolve(__dirname, "..", "..", "public/")
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "favicon.ico", to: "favicon.ico" },
                { from: "index.html", to: "index.html" },
                { from: "css", to: "css" },
                { from: "img", to: "img" }
            ]
        }),
        new CompressionPlugin(),
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(`./`),
        }),
        // new CleanWebpackPlugin({
        //     dangerouslyAllowCleanPatternsOutsideProject: true,
        //     dry: false
        // })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: [
                    {
                        loader: "babel-loader",
                        options: { presets: ["@babel/preset-env"] }
                    },
                    { loader: "ts-loader" }
                ]
            },
            {
                test: /\.js$/i,
                use: {
                    loader: "babel-loader",
                    options: { presets: ["@babel/preset-env"] }
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: {loader: 'html-loader'}
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "html-loader"
                    },
                    {
                        loader: "remark-loader",
                        options: {
                            remarkOptions: {
                                plugins: [RemarkHTML]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            }
        ]
    },
    resolve: { extensions: [".ts", ".js"] },
};

export default module;
