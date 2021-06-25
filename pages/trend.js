import { Fragment } from 'react'

import CustomContainer from '../components/Layout/CustomContainer'
import BirdMouth from '../components/Parts/BirdMouth'
import { trend, trendTools } from '../config/trend'

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
