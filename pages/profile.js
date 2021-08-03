import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import LoginAlert from '@/components/Parts/LoginAlert'
import { usePersistedUser, useUserData } from '@/lib/firebaseResult'
import { useProfileElements } from '@/lib/hooks/admin'
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
  const elements = useProfileElements(userData)

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
              {elements?.map((item, idx) => {
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
