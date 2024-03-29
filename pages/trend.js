import { Fragment } from 'react'

import { useRouter } from 'next/router'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

import CustomContainer from '@/components/Layout/CustomContainer'
import BirdMouth from '@/components/Parts/BirdMouth'
import TrendBarChart from '@/components/Parts/TrendBarChart'
import { trend, trendBarCategory, trendTools } from '@/config/trend'
import { useTab } from '@/lib/hooks/useTab'

export default function Trend() {
  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, {
      shallow: true
    })
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <Tabs
            style={{ fontSize: '11px' }}
            className="mt-1"
            activeKey={tab}
            onSelect={k => changeTab(k)}
            mountOnEnter={true}
          >
            <Tab eventKey="trendChart" title="Trend Chart">
              <TrendBarChart input={trendBarCategory} />
            </Tab>
            <Tab eventKey="birdMouth" title="Bird Mouth">
              <BirdMouth
                className={'mt-2'}
                tools={trendTools}
                input={trend.map(item => ({
                  label: `${item.label} - ${item.ticker}`,
                  ticker: item.ticker
                }))}
              />
            </Tab>
          </Tabs>
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
