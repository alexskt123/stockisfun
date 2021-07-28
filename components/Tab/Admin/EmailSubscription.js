import { Fragment } from 'react'

import EmailSubscriptionCard from '@/components/Parts/EmailSubscriptionCard'
import { emailConfig } from '@/config/admin'
import CardDeck from 'react-bootstrap/CardDeck'

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
