module.exports = {
  future: {
    webpack5: true,
  },
  webpack: function (config, _options) {
    config.experiments = {}
    return config
  },
}