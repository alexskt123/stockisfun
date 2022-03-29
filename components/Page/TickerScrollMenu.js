import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import useSWR from 'swr'

import CustomScrollMenu from '@/components/Parts/CustomScrollMenu'
import TickerCard from '@/components/Parts/TickerCard'
import { extractYahooInfo } from '@/config/highlight'
import { stockMarketIndexSWROptions, fetcher } from '@/config/settings'

export default function TickerScrollMenu({ inputList }) {
  const router = useRouter()

  const [stockInfo, setStockInfo] = useState([])

  const { data: responses } = useSWR(
    () =>
      inputList &&
      `/api/yahoo/getQuote?ticker=${[...inputList].map(item => item.Ticker)}`,
    fetcher,
    stockMarketIndexSWROptions
  )

  function getStockInfo(responses) {
    const stockInfoAdd = responses
      ? [...inputList].map(stock => {
          const data = responses.find(x => x && x.symbol === stock.Ticker)

          const info = data
            ? extractYahooInfo.reduce((acc, cur) => {
                const newAcc = {
                  ...acc,
                  [cur.label]: data[cur.field]
                }

                return newAcc
              }, {})
            : {}

          return { ...stock, ...info }
        })
      : []

    setStockInfo(stockInfoAdd)
  }

  const onSelect = key => {
    router.push(
      `/highlight?ticker=${inputList[key].Ticker}&type=quote&show=true`
    )
  }

  useEffect(() => {
    getStockInfo(responses)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responses])

  return (
    <CustomScrollMenu
      data={stockInfo}
      ChildComponent={TickerCard}
      onSelect={onSelect}
    />
  )
}
