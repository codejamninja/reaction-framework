import AssetsWebpackPlugin from 'assets-webpack-plugin';
import OfflinePlugin from 'offline-plugin';
import UglifyWebpackPlugin from 'uglifyjs-webpack-plugin';
import _ from 'lodash';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { IgnorePlugin } from 'webpack';

export default function createClientConfig(config, webpackConfig) {
  const {
    action,
    env,
    host,
    offline,
    options,
    paths,
    platform,
    platformType,
    ports
  } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: {
      client: [path.resolve(paths.platform, 'client.js')]
    },
    externals: {
      ...webpackConfig.externals,
      'react-art': {}
    },
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ..._.get(webpackConfig, 'resolve.alias'),
        '@reactant/web-isomorphic/ClientRoot': path.resolve(
          paths.platform,
          'ClientRoot.js'
        )
      },
      extensions: _.uniq([
        `.${platform}.client.js`,
        `.${platform}.client.jsx`,
        `.${platform}.client.mjs`,
        `.${platform}.client.json`,
        `.${platformType}.client.js`,
        `.${platformType}.client.jsx`,
        `.${platformType}.client.mjs`,
        `.${platformType}.client.json`,
        ..._.get(webpackConfig, 'resolve.extensions', [])
      ])
    },
    plugins: [
      ...webpackConfig.plugins,
      new AssetsWebpackPlugin({
        path: paths.dist,
        filename: 'assets.json'
      }),
      new IgnorePlugin(/^child_process$/),
      new IgnorePlugin(/^deasync$/),
      new IgnorePlugin(/^fs$/),
      new IgnorePlugin(/^winston$/)
    ]
  };
  if (env === 'development') {
    webpackConfig = {
      ...webpackConfig,
      output: {
        path: path.resolve(paths.dist, 'public'),
        publicPath: action === 'start' ? `http://${host}:${ports.dev}/` : '/',
        pathinfo: true,
        filename: 'scripts/bundle.js',
        chunkFilename: 'scripts/[name].chunk.js',
        devtoolModuleFilenameTemplate: info => {
          return path.resolve(info.resourcePath).replace(/\\/g, '/');
        }
      }
    };
  } else {
    webpackConfig = {
      ...webpackConfig,
      optimization: {
        concatenateModules: true,
        flagIncludedChunks: true,
        mangleWasmImports: true,
        mergeDuplicateChunks: true,
        minimize: true,
        occurrenceOrder: true,
        providedExports: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        sideEffects: true,
        minimizer: [
          new UglifyWebpackPlugin({
            uglifyOptions: {
              compress: {
                warnings: false,
                comparisons: false,
                drop_console: true
              },
              output: {
                comments: false
              }
            },
            sourceMap: true
          })
        ],
        splitChunks: {
          chunks: 'all'
        }
      },
      output: {
        path: path.resolve(paths.dist, 'public'),
        publicPath: '/',
        filename: 'scripts/bundle.[hash:8].js',
        chunkFilename: 'scripts/[name].[hash:8].chunk.js'
      }
    };
  }
  if (action === 'start') {
    webpackConfig = {
      ...webpackConfig,
      entry: {
        client: [
          ...webpackConfig.entry.client,
          require.resolve('../hotDevClient')
        ]
      },
      devServer: {
        before(app) {
          app.use(errorOverlayMiddleware());
        },
        compress: true,
        disableHostCheck: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: { disableDotRule: true },
        host,
        hot: true,
        noInfo: !options.debug,
        overlay: false,
        port: ports.dev,
        quiet: false,
        watchOptions: { ignored: /node_modules/ }
      }
    };
  }
  if (config.options.analyze) {
    webpackConfig = {
      ...webpackConfig,
      plugins: [
        ...webpackConfig.plugins,
        new BundleAnalyzerPlugin({
          analyzerPort: ports.analyzer,
          analyzerMode: 'static'
        })
      ]
    };
  }
  if (offline) {
    webpackConfig = {
      ...webpackConfig,
      plugins: [
        ...webpackConfig.plugins,
        new OfflinePlugin({ publicPath: path.resolve(paths.dist, 'public') })
      ]
    };
  } else {
    webpackConfig = {
      ...webpackConfig,
      plugins: [
        ...webpackConfig.plugins,
        new IgnorePlugin(/^offline-plugin\/runtime/)
      ]
    };
  }
  return webpackConfig;
}
