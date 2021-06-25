import { Fragment } from 'react'

import CustomContainer from '../components/Layout/CustomContainer'
import { trend, trendTools } from '../config/trend'
import BirdMouth from '../components/Parts/BirdMouth'

export default function Trend() {
  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <BirdMouth
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
