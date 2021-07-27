import { BoughtList } from './BoughtList'
import { EmailConfig } from './EmailConfig'
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
    eventKey: 'EmailConfig',
    title: 'Email Configuration',
    component: EmailConfig
  }
]
