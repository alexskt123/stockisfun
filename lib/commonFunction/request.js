import to from 'await-to-js'
import axios from 'axios'

const Qs = require('qs')

const handleAxiosError = err => {
  if (err) {
    console.error(err)
  }
}

const toAxios = async (apiLink, queries) => {
  const [err, response] = await to(
    axios.get(apiLink, {
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' })
      },
      params: {
        ...queries
      }
    })
  )
  handleAxiosError(err)
  return response
}

module.exports = {
  toAxios
}
