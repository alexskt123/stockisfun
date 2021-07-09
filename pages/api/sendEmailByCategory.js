import { getHost, toAxios } from '@/lib/commonFunction'
import { getEmailsByCategory } from '@/lib/firebaseResult'

export default async (req, res) => {
  const { category } = req.query

  const emails = await getEmailsByCategory(category)

  const response = {
    response: 'OK'
  }

  await Promise.all(
    emails.map(email => {
      return toAxios(`${getHost()}/api/sendEmailFor${category}?id=${email.id}`)
    })
  ).catch(error => console.error(error))

  res.statusCode = 200
  res.json(response)
}
