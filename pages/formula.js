import { Fragment } from 'react'

import dynamic from 'next/dynamic'

import CustomContainer from '@/components/Layout/CustomContainer'
import { formulaSettings } from '@/config/formula'

const FormulaCard = dynamic(
  () => {
    return import('@/components/Parts/FormulaCard')
  },
  { ssr: false }
)

export default function Formula() {
  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          {formulaSettings.map((item, idx) => {
            return <FormulaCard key={idx} content={item} />
          })}
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
