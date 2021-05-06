
import sendEmail from '../../lib/sendEmail'
import { getEmailByID } from '../../lib/firebaseResult'
import { getHost, getHostForETFDb } from '../../lib/commonFunction'

const axios = require('axios').default

const getUrlItem = (item) => {
  return `<u><a href="${getHostForETFDb()}/stockdetail?query=${item}">${item}</a></u>`
}

export default async (req, res) => {

  const response = {
    response: 'NOT OK'
  }

  const { id } = req.query

  const emails = await getEmailByID(id)
  const curEmailTemplate = emails.find(x => x)

  const tickerArr = curEmailTemplate.stock.split(',').map(item => item.toUpperCase())
  const genChart = curEmailTemplate.genChart ? true : false

  // no idea why cannot use spread priceMAlist here
  const priceMADetails = {
    asOfDate: '',
    priceMAList: [
      {
        id: '5<20',
        name: '5-MA lower than 20-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '5>20',
        name: '5-MA higher than 20-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '5<60',
        name: '5-MA lower than 60-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '5>60',
        name: '5-MA higher than 60-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '20<60',
        name: '20-MA lower than 60-MA',
        tickersInfo: [],
        tickersChart: []
      },
      {
        id: '20>60',
        name: '20-MA higher than 60-MA',
        tickersInfo: [],
        tickersChart: []
      }

    ]
  }

  response.response = 'OK'

  const responses = await Promise.all(tickerArr.map(ticker => {
    return axios.get(`${getHost()}/api/getPriceMADetails?ticker=${ticker}&genChart=${genChart}`).catch(err => console.log(err))
  }))
    .catch(error => console.log(error))

  const responsesArr = responses || []
  responsesArr.filter(x => x && x.data).forEach(item => {
    priceMADetails.asOfDate = priceMADetails.asOfDate == '' ? item.data.asOfDate : priceMADetails.asOfDate
    priceMADetails.priceMAList.forEach(cur => {
      const priceMA = item.data.priceMAList.find(x => x.id === cur.id)
      cur.tickersInfo.push(...priceMA.tickersInfo)
      cur.tickersChart.push(...priceMA.tickersChart)
    })
  })

  const mailOptions = {
    from: process.env.EMAIL,
    bcc: curEmailTemplate.to,
    subject: `Moving Average Highlight - As of ${priceMADetails.asOfDate}`,
    html: `
          <p>
              <h5>${curEmailTemplate.name}</h5>
          </p>        
          <p>
              <b>As of ${priceMADetails.asOfDate}:</b>
          </p>
          ${priceMADetails.priceMAList.map(priceMA => {
    return (
      `<hr>
                <p>
                    <b>${priceMA.name}</b>
                    <ol>
                      ${priceMA.tickersInfo.map((cur, idx) => {
        const imgElement = genChart ? `<img src=${priceMA.tickersChart[idx]}/>` : ''
        return (
          `<li>
                            <p>Symbol: ${getUrlItem(cur.Symbol)}</p>
                            <p>Name: ${cur.Name}</p><p>Market Price: ${cur.Price}</p>
                            <p>Market Cap.: ${cur.MarketCap}</p>
                            <p>Industry: ${cur.Industry}</p>
                            <p>${imgElement}</p>
                          </li>`
        )
      }).join('')}
                    </ol>
                </p>
                `
    )
  }).join('')
}
          <hr>       
          <p>
              <b>Grabbing Ticker List:</b>
              <ol>
                  ${tickerArr.map(item => `<li>${getUrlItem(item)}</li>`).join('')}
              </ol>
          </p>
          `
  }

  await sendEmail(mailOptions)

  res.statusCode = 200
  res.json(response)
}
