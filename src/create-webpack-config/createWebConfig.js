import AssetsWebpackPlugin from 'assets-webpack-plugin';
import UglifyWebpackPlugin from 'uglifyjs-webpack-plugin';
import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';

export default function createWebConfig(webpackConfig, action, config) {
  const { paths, host, port, devPort, environment } = config;
  webpackConfig = {
    ...webpackConfig,
    entry: {
      client: [paths.client]
    },
    externals: {
      'reaction/config': JSON.stringify(config)
    },
    plugins: [
      ...webpackConfig.plugins,
      new AssetsWebpackPlugin({
        path: paths.dist,
        filename: 'assets.json'
      })
    ]
  };
  if (environment === 'development') {
    webpackConfig = {
      ...webpackConfig,
      output: {
        path: paths.distPublic,
        publicPath: action === 'start' ? `http://${host}:${devPort}/` : '/',
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
      output: {
        path: paths.distPublic,
        publicPath: '/',
        filename: 'scripts/bundle.[chunkhash:8].js',
        chunkFilename: 'scripts/[name].[chunkhash:8].chunk.js'
      },
      plugins: [
        ...webpackConfig.plugins,
        new UglifyWebpackPlugin({
          uglifyOptions: {
            compress: {
              warnings: false,
              comparisons: false
            },
            output: {
              comments: false
            }
          },
          sourceMap: true
        })
      ]
    };
  }
  if (action === 'start') {
    webpackConfig = {
      ...webpackConfig,
      entry: {
        client: [
          ...webpackConfig.entry.client,
          require.resolve('../webpackHotDevClient')
        ]
      },
      devServer: {
        disableHostCheck: true,
        compress: true,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        historyApiFallback: {
          disableDotRule: true
        },
        host,
        hot: true,
        noInfo: true,
        overlay: false,
        port,
        quiet: true,
        watchOptions: {
          ignored: /node_modules/
        },
        before(app) {
          app.use(errorOverlayMiddleware());
        }
      }
    };
  }
  return webpackConfig;
}
