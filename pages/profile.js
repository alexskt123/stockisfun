import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import AccountSummary from '@/components/Page/Profile/AccountSummary'
import Performance from '@/components/Page/Profile/Performance'
import StockHighlight from '@/components/Page/Profile/StockHighlight'
import { staticSWROptions, fetcher } from '@/config/settings'
import { usePersistedUser } from '@/lib/firebaseResult'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel
} from 'react-accessible-accordion'
import useSWR from 'swr'

const Profile = () => {
  const user = usePersistedUser()
  const { data: boughtListData } = useSWR(
    `/api/user/getUserBoughtListDetails?uid=${user?.uid}`,
    fetcher,
    staticSWROptions
  )

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

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
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
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

export default Profile
