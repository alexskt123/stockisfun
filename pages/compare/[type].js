import { useEffect } from 'react'

import { ComparisonSettings } from '@/config/compare'
import { sortUniqCommaStr } from '@/lib/commonFunction'
import { useRouter } from 'next/router'

import Comparison from './Comparison'

const CompareType = () => {
  const router = useRouter()
  const { type, ...params } = router.query

  const { tickers } = params
  const removedDupTickers = tickers && sortUniqCommaStr(tickers)
  const newParams = Object.assign({ ...params }, { tickers: removedDupTickers })
  const chkType = ComparisonSettings[type]

  useEffect(() => {
    type && !chkType && router.push('/error')
  }, [type, chkType, router])

  return (chkType && <Comparison type={type} params={newParams} />) || null
}

export default CompareType
