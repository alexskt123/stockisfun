import { fetcher, staticSWROptions } from '@/config/settings'
import Quote from '@/lib/class/quote'
import to from 'await-to-js'
import axios from 'axios'
import Qs from 'qs'
import useSWR from 'swr'

const handleAxiosError = err => {
  if (err) {
    console.error(err)
  }
}

export const toAxios = async (apiLink, queries) => {
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

export const getAPIResponse = async (req, callback, optionalArgs) => {
  const response = {
    result: null
  }
  try {
    const { ticker } = req.query

    const quote = new Quote(ticker)
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
    response.message = error.message
  }

  return response
}

export const getFileFromStorage = filename => {
  return toAxios(`${process.env.BUCKET_URL}/${filename}`).then(res => res?.data)
}

export const useStaticSWR = (ref, url) => {
  return useSWR(() => ref && url, fetcher, staticSWROptions)
}
