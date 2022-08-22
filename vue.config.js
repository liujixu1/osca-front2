const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  devServer: {
    disableHostCheck: true,
    port: 3000,
    proxy: {
      '/graphql': {
        target: 'https://compliance3.openeuler.org/',
        changeOrigin: true,
        pathRewrite: { '^/graphql': '/osca_graphql' }
      }
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    plugins: [new MonacoWebpackPlugin()]
  }
}
