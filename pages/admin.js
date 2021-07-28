import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import LoginAlert from '@/components/Parts/LoginAlert'
import { adminTabs } from '@/components/Tab/Admin'
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
          {user && userData ? (
            <Fragment>
              <Tabs
                style={{ fontSize: '11px' }}
                className="mt-1"
                activeKey={tab}
                onSelect={k => changeTab(k)}
              >
                {adminTabs.map(t => (
                  <Tab key={t.eventKey} eventKey={t.eventKey} title={t.title}>
                    <t.component user={user} userData={userData} />
                  </Tab>
                ))}
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
