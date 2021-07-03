import { getPriceMAHTMLTemplate } from '@/lib/email/priceMA'
import { getEmailByID } from '@/lib/firebaseResult'
import sendEmail from '@/lib/sendEmail'

export default async (req, res) => {
  const response = {
    response: 'NOT OK'
  }

  const { id } = req.query

  const emails = await getEmailByID(id)
  const curEmailTemplate = emails.find(x => x)

  const tickerArr = curEmailTemplate.stock
    .split(',')
    .map(item => item.toUpperCase())
  const genChart = curEmailTemplate.genChart ? true : false

  const emailTemplate = await getPriceMAHTMLTemplate({
    tickerArr,
    genChart,
    nane: curEmailTemplate.name
  })

  const mailOptions = {
    from: process.env.EMAIL,
    bcc: curEmailTemplate.to,
    ...emailTemplate
  }

  await sendEmail(mailOptions)

  res.statusCode = 200
  res.json(response)
}
