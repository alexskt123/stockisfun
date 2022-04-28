import pug from 'pug'

import { getFileFromStorage } from '@/lib/request'

export const getTemplate = async (refPug, options) => {
  const content = await getFileFromStorage(`templates/${refPug}`)
  const compiledFunction = pug.compile(content)

  return compiledFunction({
    ...options
  })
}
