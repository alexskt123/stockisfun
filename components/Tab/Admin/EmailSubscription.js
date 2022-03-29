import { Fragment } from 'react'

import CardDeck from 'react-bootstrap/CardDeck'

import EmailSubscriptionCard from '@/components/Parts/EmailSubscriptionCard'
import { emailConfig } from '@/config/admin'

export const EmailSubscription = ({ user, userData }) => {
  return (
    <Fragment>
      <CardDeck>
        {emailConfig.map((item, idx) => {
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
