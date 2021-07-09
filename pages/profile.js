import { Fragment, useState, useEffect } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import AccountSummary from '@/components/Page/Profile/AccountSummary'
import Performance from '@/components/Page/Profile/Performance'
import StockHighlight from '@/components/Page/Profile/StockHighlight'
import LoginAlert from '@/components/Parts/LoginAlert'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'
import { getUserBoughtListDetails } from '@/lib/stockDetailsFunction'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'

const Profile = () => {
  const user = usePersistedUser()
  const userData = useUserData(user)
  const [boughtListData, setBoughtListData] = useState(null)

  const elements = [
    {
      component: AccountSummary,
      boughtListData,
      header: 'Account Summary',
      key: 'AccountSummary'
    },
    {
      component: Performance,
      boughtListData,
      header: 'Performance',
      key: 'Performance'
    },
    {
      component: StockHighlight,
      boughtListData,
      header: 'Stock Highlight',
      key: 'StockHighlight'
    }
  ]

  useEffect(() => {
    ;(async () => {
      const data = await getUserBoughtListDetails(userData)
      setBoughtListData(data)
    })()
    return () => setBoughtListData(null)
  }, [userData])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          {user ? (
            <Accordion
              preExpanded={['AccountSummary', 'Performance']}
              allowZeroExpanded={true}
              allowMultipleExpanded={true}
            >
              {elements.map((item, idx) => {
                return (
                  <Fragment key={idx}>
                    <AccordionItem uuid={item.key}>
                      <AccordionItemHeading>
                        <AccordionItemButton>{item.header}</AccordionItemButton>
                      </AccordionItemHeading>
                      <AccordionItemPanel>
                        <item.component boughtListData={item.boughtListData} />
                      </AccordionItemPanel>
                    </AccordionItem>
                  </Fragment>
                )
              })}
            </Accordion>
          ) : (
            <LoginAlert />
          )}
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

export default Profile
