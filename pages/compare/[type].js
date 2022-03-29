import { useEffect } from 'react'

import { useRouter } from 'next/router'

import Comparison from './Comparison'
import { ComparisonSettings } from '@/config/compare'
import { sortUniqCommaStr } from '@/lib/commonFunction'

const CompareType = () => {
  const router = useRouter()
  const { type, ...params } = router.query

  const { tickers } = params
  const removedDupTickers = tickers && sortUniqCommaStr(tickers)
  const newParams = Object.assign(
    { ...params },
    { tickers: removedDupTickers, type }
  )
  const chkType = ComparisonSettings[type]

  useEffect(() => {
    type && !chkType && router.push('/error')
  }, [type, chkType, router])

  return (chkType && <Comparison type={type} params={newParams} />) || null
}

export default CompareType
