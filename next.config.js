const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    runtimeCaching,
  },
  future: {
    webpack5: true,
  },
  webpack: function (config, _options) {
    config.experiments = {}
    return config
  },
})
