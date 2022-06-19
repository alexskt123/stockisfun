import { Fragment } from 'react'

import CardGroup from 'react-bootstrap/CardGroup'

import EmailSubscriptionCard from '@/components/Parts/EmailSubscriptionCard'
import { emailConfig } from '@/config/admin'

export const EmailSubscription = ({ user, userData }) => {
  return (
    <Fragment>
      <CardGroup>
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
      </CardGroup>
    </Fragment>
  )
}
