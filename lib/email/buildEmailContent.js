import { getUserInfoByUID, getUsers } from '@/lib/firebaseResult'
import validator from 'email-validator'

import { getHTMLTemplate } from './template'

const sendUserByType = async ({ type }) => {
  const users = await getUsers()

  return await users
    .filter(x =>
      x?.emailConfig?.filter(
        x => x.category === type && x?.subscribe && validator.validate(x?.to)
      )
    )
    .reduce(async (acc, user) => {
      const priceMAEmails = user.emailConfig.filter(x => x.category === type)

      const templates = priceMAEmails
        .filter(x => validator.validate(x?.to) && x?.subscribe)
        .map(email => {
          return getHTMLTemplate(
            user[email.type],
            email.name,
            email.subject,
            email.to,
            email.category
          )
        })

      return Promise.all([...(await acc), ...templates])
    }, [])
}

const sendUserByID = async ({ id, uid }) => {
  const user = await getUserInfoByUID(uid)
  const emailMatchesID = user?.emailConfig?.filter(x => x.id === id)

  const templates = (emailMatchesID || []).map(email => {
    return getHTMLTemplate(
      user[email.type],
      email.name,
      email.subject,
      email.to,
      email.category
    )
  })

  return Promise.all([...templates])
}

export { sendUserByType, sendUserByID }
