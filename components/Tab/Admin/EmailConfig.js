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

const EmailConfig = () => {
  return (
    <Fragment>
      <CardDeck>
        {config.map((item, idx) => {
          return <EmailSubscriptionCard key={idx} item={item} />
        })}
      </CardDeck>
    </Fragment>
  )
}

export default EmailConfig
