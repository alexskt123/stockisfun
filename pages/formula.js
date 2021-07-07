import { Fragment } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import { formulaSettings } from '@/config/formula'
import dynamic from 'next/dynamic'

const FormulaCard = dynamic(
  () => {
    return import('@/components/Parts/FormulaCard')
  },
  { ssr: false }
)

//export default component
export default function Formula() {
  //template
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
