import { getUsers } from '@/lib/firebaseResult'

import { getPriceMAHTMLTemplate } from './priceMA'

export const sendUserBoughtListMA = async () => {
  const users = await getUsers()

  return await Promise.all(
    users
      .filter(x => x.userID === 'cPMEr6IuP1bzCMa7x7kSjlfcf3x1')
      .map(async user => {
        const contents = await getPriceMAHTMLTemplate({
          tickerArr: user.boughtList.map(item => item.ticker),
          genChart: false,
          name: 'Bought List'
        })
        return {
          to: 'alexskt123@gmail.com',
          subject: 'Bought List Moving Average',
          ...contents
        }
      })
  )
}
