const path = require('path');
const fs = require('fs');;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

// Directory where our Multi Variant Tests reside
const mvtFolderPath = path.resolve('./src/mvt');

/**
 * Loop through the JS files in the test folder root
 * and define a new bundle for each one
 */
const getEntries = (testFolderName) => {
  const entries = {};
  const testFolderPath = path.resolve(mvtFolderPath, testFolderName);

  fs.readdirSync(testFolderPath).forEach(file => {
    const fileName = path.parse(file).name;
    const fileExt = path.parse(file).ext;
    
    if (fileExt === '.js') {
      entries[fileName] = path.resolve(testFolderPath, file);
    }
  });

  return entries;
}

/**
 * Webpack config
 */
module.exports = (env) => {
  // The --env argument must be a string matching the test folder name in ./src/mvt/
  if (!env) {
    console.error('ERROR: --env test directory name not provided');
    return;
  }

  return {
    entry: getEntries(env),
    plugins: [
      new ExtractTextPlugin(`[name]/styles.css`),
      new WebpackShellPlugin({
        onBuildEnd:['node ./compile.js'], // Run our custom compile script
        dev: false, // Allows script to run more than once (i.e on every watch)
      })
    ],
    module: {
      loaders: [
        {
          test: /\.js$/, 
          exclude: /node_modules/, 
          loader: "babel-loader"
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          })
        }
      ]
    },
    output: {
      path: path.resolve('./dist'),
      publicPath: '/mvt-framework/dist/',
      filename: "[name]/script.js",
    },
  };
}