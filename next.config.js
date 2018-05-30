const withCss = require('@zeit/next-css')
const withTypescript = require('@zeit/next-typescript')

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
    require.extensions['.css'] = (file) => {}
}

module.exports = withTypescript(withCss({
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    return config
  }
}))
