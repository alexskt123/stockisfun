import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import BirdMouth from '@/components/Parts/BirdMouth'
import TrendBarChart from '@/components/Parts/TrendBarChart'
import { trend, trendTools } from '@/config/trend'

export default function Trend() {
  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TrendBarChart />
          <BirdMouth
            className={'mt-5'}
            tools={trendTools}
            input={trend.map(item => ({
              label: `${item.label} - ${item.ticker}`,
              ticker: item.ticker
            }))}
          />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
