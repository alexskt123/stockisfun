import { getHost } from '../../lib/commonFunction'
import { getEmailsByCategory } from '../../lib/firebaseResult'

const axios = require('axios').default

export default async (req, res) => {
  const { category } = req.query

  const emails = await getEmailsByCategory(category)

  const response = {
    response: 'OK'
  }

  await Promise.all(
    emails.map(email => {
      return axios
        .get(`${getHost()}/api/sendEmailFor${category}?id=${email.id}`)
        .catch(err => console.error(err))
    })
  ).catch(error => console.error(error))

  res.statusCode = 200
  res.json(response)
}
