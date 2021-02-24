
import sendEmail from '../../lib/sendEmail'
import { getEmailByID } from '../../lib/firebaseResult'
import { getCSVContent } from '../../lib/commonFunction'
import moment from 'moment-business-days'

const axios = require('axios').default

export default async (req, res) => {
    
    let response = {
        response: 'NOT OK'
    }

    const { id } = req.query

    const emails = await getEmailByID(id)
    const curEmailTemplate = emails.find(x => x)
    const tickerArr = curEmailTemplate.stock.split(',').map(item => item.toUpperCase())

    const tdy = moment().format('YYYY-MM-DD')
    const subName = `AUM - As of ${tdy}`
    let csvFile = {
        tableHeader: [
            'Ticker',
            ...Array.from({ length: 10 }, (x, i) => `ETF ${i + 1}`),
            'AUM Sum',
            'Price',
            'Market Cap.',
            'Floating Shares Ratio'
          ],
        tableData: []
    }

    await axios.all(tickerArr.map(ticker => {
        return axios.get(`https://stockisfun.vercel.app/api/getETFAUMSum?ticker=${ticker}`).catch(err => console.log(err))
    }))
        .catch(error => console.log(error))
        .then((responses) => {
            if (responses) {
                response.response = 'OK'

                responses.forEach((item, index) => {
                    if (item && item.data) {
                        csvFile.tableData.push([tickerArr[index], ...item.data])
                    }
                })                
            }
        })


    let mailOptions = {
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
            {   // utf-8 string as an attachment
                filename: `${subName}.csv`,
                content: getCSVContent(csvFile.tableHeader, csvFile.tableData)
            }
        ]
    };


    await sendEmail(mailOptions)

    res.statusCode = 200
    res.json(response)
}
