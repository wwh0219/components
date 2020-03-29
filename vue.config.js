const path = require('path')
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        example: path.resolve(__dirname, './example'),
        packages: path.resolve(__dirname, './packages'),
        styles: path.resolve(__dirname, './styles')
      }
    }
  }
}
