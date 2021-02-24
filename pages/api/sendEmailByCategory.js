
import { getEmailsByCategory } from '../../lib/firebaseResult'

const axios = require('axios').default

export default async (req, res) => {

    const { category } = req.query

    const emails = await getEmailsByCategory(category)

    let response = {
        response: 'NOT OK'
    }

    await axios.all(emails.map(email => {
        return axios.get(`https://stockisfun.vercel.app/api/sendEmailFor${category}?id=${email.id}`).catch(err => console.log(err))
    }))
        .catch(error => console.log(error))
        .then((_responses) => {
            response.response = 'OK'
        })

    res.statusCode = 200
    res.json(response)
}
