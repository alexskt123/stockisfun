import { Fragment, useEffect, useState } from 'react'

import ProfilePieChart from '@/components/Parts/ProfilePieChart'
import { pieOptions } from '@/config/profile'
import { decendingArrSort } from '@/lib/commonFunction'
import CardDeck from 'react-bootstrap/CardDeck'

const AccountSummary = ({ boughtListData }) => {
  const [stockPie, setStockPie] = useState(null)
  const [catPie, setCatPie] = useState(null)
  const [cashPie, setCashPie] = useState(null)

  useEffect(() => {
    if (!boughtListData?.boughtList) return

    const total = boughtListData.boughtList.reduce((acc, cur) => {
      return acc + cur.sum
    }, 0)

    const { cash } = boughtListData

    const boughtList = boughtListData.boughtList.map(item => {
      return {
        ...item,
        pcnt: item.sum / total
      }
    })

    const boughtListByCategory = boughtListData.boughtList.reduce(
      (acc, cur) => {
        const curCategory = cur.sector || cur.type
        const curSector = acc.find(x => x.sector === curCategory)

        const sec = curSector
          ? {
              ...curSector,
              sum: curSector.sum + cur.sum,
              pcnt: (curSector.sum + cur.sum) / total
            }
          : {
              sum: cur.sum,
              sector: curCategory,
              pcnt: cur.sum / total
            }
        return [...acc.filter(x => x.sector !== curCategory), sec]
      },
      []
    )

    const boughtListByStockCash = [
      { sum: cash / (cash + total), label: 'CASH' },
      { sum: total / (cash + total), label: 'STOCK' }
    ]

    setStockPie(boughtList.sort((a, b) => decendingArrSort(a, b, 'pcnt')))
    setCatPie(
      boughtListByCategory.sort((a, b) => decendingArrSort(a, b, 'pcnt'))
    )
    setCashPie(
      boughtListByStockCash.sort((a, b) => decendingArrSort(a, b, 'sum'))
    )

    return () => {
      setStockPie(null)
      setCatPie(null)
      setCashPie(null)
    }
  }, [boughtListData])

  return (
    <Fragment>
      <CardDeck>
        <ProfilePieChart
          header={'Individual Stock'}
          inputList={stockPie}
          label={'ticker'}
          data={'pcnt'}
          pieOptions={pieOptions}
        />
        <ProfilePieChart
          header={'Cateogry'}
          inputList={catPie}
          label={'sector'}
          data={'pcnt'}
          pieOptions={pieOptions}
        />
        <ProfilePieChart
          header={'CASH and STOCK'}
          inputList={cashPie}
          label={'label'}
          data={'sum'}
          pieOptions={pieOptions}
        />
      </CardDeck>
    </Fragment>
  )
}

export default AccountSummary
