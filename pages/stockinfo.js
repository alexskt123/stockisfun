import React from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import HighlightInfo from '@/components/Page/Highlight/HighlightInfo'
import { useRouter } from 'next/router'

const StockInfo = () => {
  const router = useRouter()
  return (
    <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
      <HighlightInfo query={router.query} />
    </CustomContainer>
  )
}

export default StockInfo
