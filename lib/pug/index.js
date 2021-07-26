import { getPug } from '@/lib/firebaseResult'
import pug from 'pug'

export const getTemplate = async (refPug, options) => {
  const content = await getPug(refPug)
  const compiledFunction = pug.compile(content)

  return compiledFunction({
    ...options
  })
}
