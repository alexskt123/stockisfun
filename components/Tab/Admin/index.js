import { BoughtList } from './BoughtList'
import { EmailSubscription } from './EmailSubscription'
import { General } from './General'

export const adminTabs = [
  {
    eventKey: 'General',
    title: 'General',
    component: General
  },
  {
    eventKey: 'BoughtList',
    title: 'Bought List',
    component: BoughtList
  },
  {
    eventKey: 'EmailSubscription',
    title: 'Email Subscription',
    component: EmailSubscription
  }
]
