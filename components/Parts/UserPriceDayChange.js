import { Fragment, useState, useEffect } from 'react'

import { calPcnt } from '@/lib/commonFunction'
import { getUserBoughtList } from '@/lib/stockInfo'

import PriceDayChgRow from './PriceDayChgRow'

const UserPriceDayChange = ({ userData }) => {
  const [dayChange, setDayChange] = useState(null)

  const calDayChgPcnt = (data, cash) => {
    data.sum = data.sum + cash
    data.prevSum = data.prevSum + cash

    data.pcnt = calPcnt(data.sum - data.prevSum, data.prevSum, 2) / 100

    return data
  }

  const calDayChg = (data, cash) => {
    const dayChgAndTotal = data.reduce(
      (acc, cur) => {
        const { regular, pre, post } = cur
        const newReg = {
          net: acc.regular.net + regular.net,
          sum: acc.regular.sum + regular.sum,
          prevSum: acc.regular.prevSum + regular.prevSum
        }

        const newPre = {
          net: acc.pre.net + pre.net,
          sum: acc.pre.sum + pre.sum,
          prevSum: acc.pre.prevSum + pre.prevSum
        }

        const newPost = {
          net: acc.post.net + post.net,
          sum: acc.post.sum + post.sum,
          prevSum: acc.post.prevSum + post.prevSum
        }
        return {
          regular: newReg,
          pre: newPre,
          post: newPost
        }
      },
      {
        regular: { net: 0, sum: 0, prevSum: 0 },
        pre: { net: 0, sum: 0, prevSum: 0 },
        post: { net: 0, sum: 0, prevSum: 0 }
      }
    )

    calDayChgPcnt(dayChgAndTotal.regular, cash)
    calDayChgPcnt(dayChgAndTotal.pre, cash)
    calDayChgPcnt(dayChgAndTotal.post, cash)

    return dayChgAndTotal
  }

  const setBoughtListDayChange = async () => {
    const data = await getUserBoughtList(userData)
    const boughtListData = data?.boughtList || []

    const cash = data?.cash || 0

    const dayChg = calDayChg(boughtListData, cash)

    setDayChange(dayChg)
  }

  useEffect(() => {
    ;(async () => {
      await setBoughtListDayChange()
    })()
    return () => setDayChange(null)
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData])

  return (
    <Fragment>
      {
        <Fragment>
          <PriceDayChgRow
            data={dayChange?.regular}
            stateKey={'priceDayChange'}
            header={'Account Summary'}
            setBoughtListDayChange={setBoughtListDayChange}
            hideIfNA={false}
            showRefreshButton={true}
          />
          <PriceDayChgRow
            data={dayChange?.pre}
            stateKey={'prePriceDayChange'}
            header={'Pre'}
            setBoughtListDayChange={setBoughtListDayChange}
            hideIfNA={true}
            showRefreshButton={true}
          />
          <PriceDayChgRow
            data={dayChange?.post}
            stateKey={'postPriceDayChange'}
            header={'Post'}
            setBoughtListDayChange={setBoughtListDayChange}
            hideIfNA={true}
            showRefreshButton={true}
          />
        </Fragment>
      }
    </Fragment>
  )
}

export default UserPriceDayChange
