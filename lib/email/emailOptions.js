import { getUsers } from '@/lib/firebaseResult'
import validator from 'email-validator'

import { getPriceMAHTMLTemplate } from './priceMA'

const getHTMLTemplate = async (inputList, name, subject, to) => {
  const contents = await getPriceMAHTMLTemplate({
    tickerArr: inputList.map(item => item?.ticker || item),
    genChart: false,
    name
  })

  return {
    to,
    subject: subject,
    ...contents
  }
}

export const sendUserPriceMA = async () => {
  const users = await getUsers()

  return await users
    .filter(
      x =>
        x?.emailConfig?.filter(x => x.category === 'priceMA')?.find(x => x)
          ?.subscribe === true &&
        validator.validate(
          x?.emailConfig?.filter(x => x.category === 'priceMA')?.find(x => x)
            ?.to
        )
    )
    .reduce(async (acc, user) => {
      const priceMAEmails = user.emailConfig.filter(
        x => x.category === 'priceMA'
      )

      const templates = await Promise.all(
        priceMAEmails
          .filter(x => validator.validate(x?.to) && x?.subscribe)
          .map(async email => {
            return await getHTMLTemplate(
              user[email.type],
              email.name,
              email.subject,
              email.to
            )
          })
      )

      return [...(await acc), ...templates]
    }, [])
}