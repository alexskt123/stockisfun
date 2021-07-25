import pug from 'pug'

import path from 'path'

export const getTemplate = (refPug, options) => {
  const compiledFunction = pug.compileFile(path.resolve(__dirname, refPug))

  return compiledFunction({
    ...options
  })
}
