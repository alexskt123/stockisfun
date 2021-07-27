import { Fragment } from 'react'

import EmailSubscriptionCard from '@/components/Parts/EmailSubscriptionCard'
import CardDeck from 'react-bootstrap/CardDeck'

const config = [
  {
    category: 'priceMA',
    name: 'Stock Price Moving Average - Bought List',
    subject: 'Stock Price Moving Average - Bought List',
    type: 'boughtList',
    id: 'priceMABoughtList',
    subscribe: false,
    to: ''
  },
  {
    category: 'priceMA',
    name: 'Stock Price Moving Average - Watch List',
    subject: 'Stock Price Moving Average - Watch List',
    type: 'watchList',
    id: 'priceMAWatchList',
    subscribe: false,
    to: ''
  }
]

export const EmailConfig = ({ user, userData }) => {
  return (
    <Fragment>
      <CardDeck>
        {config.map((item, idx) => {
          return (
            <EmailSubscriptionCard
              user={user}
              userData={userData}
              key={idx}
              item={item}
            />
          )
        })}
      </CardDeck>
    </Fragment>
  )
}
