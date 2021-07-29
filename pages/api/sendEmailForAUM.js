import { aumTableHeader } from '@/config/etf'
import { getCSVContent, getHostForETFDb, getHost } from '@/lib/commonFunction'
import { sendEmail } from '@/lib/email'
import { getEmailByID } from '@/lib/firebaseResult'
import { toAxios } from '@/lib/request'
import moment from 'moment-business-days'

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

  const tdy = moment().format('YYYY-MM-DD')
  const subName = `AUM - As of ${tdy}`
  const csvFile = {
    tableHeader: [...aumTableHeader],
    tableData: []
  }

  response.response = 'OK'

  const temp = await Promise.all(
    tickerArr.map(async ticker => {
      const etf = await toAxios(
        `${getHostForETFDb()}/api/etfdb/getETFAUMSum?ticker=${ticker}`
      )
      const cnn = await toAxios(
        `${getHost()}/api/forecast/getMoneyCnn?ticker=${ticker}`
      )
      const { data: etfData } = etf
      const { data: cnnData } = cnn
      return {
        ticker: ticker.toUpperCase(),
        info: [...etfData, ...cnnData]
      }
    })
  )

  temp.forEach(item => {
    csvFile.tableData.push([item.ticker, ...item.info])
  })

  const inputArrList = tickerArr.reduce((acc, cur) => {
    acc += `<li>${cur}</li>`
    return acc
  }, '')

  const mailOptions = {
    from: process.env.EMAIL,
    bcc: curEmailTemplate.to,
    subject: subName,
    html: `
        <p>
            <h5>${curEmailTemplate.name}</h5>
        </p>        
        <p>
            <b>As of ${tdy}:</b>
        </p>        
        <hr>       
        <p>
            <b>AUM Ticker List:</b>
            <ol>
                ${inputArrList}
            </ol>
        </p>
        `,
    attachments: [
      {
        // utf-8 string as an attachment
        filename: `${subName}.csv`,
        content: getCSVContent(csvFile.tableHeader, csvFile.tableData)
      }
    ]
  }

  await sendEmail(mailOptions)

  res.statusCode = 200
  res.json(response)
}
