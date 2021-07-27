import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import LoginAlert from '@/components/Parts/LoginAlert'
import BoughtList from '@/components/Tab/Admin/BoughtList'
import EmailConfig from '@/components/Tab/Admin/EmailConfig'
import General from '@/components/Tab/Admin/General'
import { useUserData, usePersistedUser } from '@/lib/firebaseResult'
import { useTab } from '@/lib/hooks/useTab'
import { useRouter } from 'next/router'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

export default function Admin() {
  const user = usePersistedUser()
  const userData = useUserData(user)

  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, {
      shallow: true
    })
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {user ? (
            <Fragment>
              <Tabs
                style={{ fontSize: '11px' }}
                className="mt-1"
                activeKey={tab}
                onSelect={k => changeTab(k)}
              >
                <Tab eventKey="General" title="General">
                  <General user={user} userData={userData} />
                </Tab>
                <Tab eventKey="BoughtList" title="Bought List">
                  <BoughtList userData={userData} />
                </Tab>
                <Tab eventKey="EmailConfig" title="Email Configuration">
                  <EmailConfig user={user} userData={userData} />
                </Tab>
              </Tabs>
            </Fragment>
          ) : (
            <LoginAlert />
          )}
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
