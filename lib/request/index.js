import { ModuleQuote } from '@/lib/quote'
import to from 'await-to-js'
import axios from 'axios'
import Qs from 'qs'

const handleAxiosError = err => {
  if (err) {
    console.error(err)
  }
}

export const toAxios = async (apiLink, querys) => {
  const [err, response] = await to(
    axios.get(apiLink, {
      paramsSerializer: function (params) {
        return Qs.stringify(params, { arrayFormat: 'repeat' })
      },
      params: {
        ...querys
      }
    })
  )
  handleAxiosError(err)
  return response
}

export const getAPIResponse = async (req, callback, optionalArgs) => {
  const response = {
    result: null
  }
  try {
    const { ticker } = req.query

    const quote = new ModuleQuote(ticker)
    await quote.request()

    const args = {
      ticker,
      quoteData: quote.quoteData,
      valid: quote.valid,
      type: quote.type,
      ...(optionalArgs || {})
    }

    response.result = quote.valid ? await callback({ ...args }) : null
    response.message = 'OK'
  } catch (error) {
    console.error(error)
    response.message = error.message
  }

  return response
}
