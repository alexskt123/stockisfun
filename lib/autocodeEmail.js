const lib = require('lib')({ token: process.env.AUTOCODE_TOKEN })

export const sendEmail = async options => {
  const result = await lib.gmail.messages['@0.2.4'].create({ ...options })

  return result
}
