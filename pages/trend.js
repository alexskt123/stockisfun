
import { Fragment } from 'react'

import CustomContainer from '../components/Layout/CustomContainer'
import { trend } from '../config/trend'
import BirdMouth from '../components/Parts/BirdMouth'

export default function Trend() {

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <BirdMouth input={trend.map(item => ({label: `${item.label} - ${item.ticker}`, ticker: item.ticker}))} />
        </Fragment >
      </CustomContainer>
    </Fragment >
  )
}
