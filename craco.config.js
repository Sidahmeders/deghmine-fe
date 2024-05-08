const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@context': path.resolve(__dirname, './src/context'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@config': path.resolve(__dirname, './src/config'),
      '@services': path.resolve(__dirname, './src/services'),
      '@components': path.resolve(__dirname, './src/components'),
      '@fakeDB': path.resolve(__dirname, './src/fakeDB'),
    },
  },
}
