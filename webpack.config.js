const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: {
      fix: "./src/fix.ts",
      contentScript: "./src/contentScript.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].js",
    },
    devtool: isProduction ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
              ],
            },
          },
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: "src", to: ".", globOptions: { ignore: ["**/*.ts"] } },
          { from: "assets", to: "." }
        ],
      }),
    ],
  };
};
