import { Fragment, useEffect, useState } from 'react'

import CardDeck from 'react-bootstrap/CardDeck'

import ProfilePieChart from '@/components/Parts/ProfilePieChart'
import { pieOptions } from '@/config/profile'

const descendingArrSort = (list, key) => {
  return list.sort((a, b) => b[key] - a[key])
}

const AccountSummary = ({ boughtListData }) => {
  const [stockPie, setStockPie] = useState(null)
  const [catPie, setCatPie] = useState(null)
  const [cashPie, setCashPie] = useState(null)

  useEffect(() => {
    if (!boughtListData?.boughtList) return

    //todo: maybe can tune
    const total = boughtListData.boughtList.reduce((acc, cur) => {
      return acc + cur.regular.sum
    }, 0)

    const { cash } = boughtListData

    const boughtList = boughtListData.boughtList.map(item => {
      return {
        ...item,
        pcnt: item.regular.sum / total
      }
    })

    const boughtListByCategory = boughtListData.boughtList.reduce(
      (acc, cur) => {
        const curCategory = cur.sector || cur.type
        const curSector = acc.find(x => x.sector === curCategory)

        const sec = curSector
          ? {
              ...curSector,
              sum: curSector.sum + cur.regular.sum,
              pcnt: (curSector.sum + cur.regular.sum) / total
            }
          : {
              sum: cur.regular.sum,
              sector: curCategory,
              pcnt: cur.regular.sum / total
            }
        return [...acc.filter(x => x.sector !== curCategory), sec]
      },
      []
    )

    const boughtListByStockCash = [
      { sum: cash / (cash + total), label: 'CASH' },
      { sum: total / (cash + total), label: 'STOCK' }
    ]

    setStockPie(descendingArrSort(boughtList, 'pcnt'))
    setCatPie(descendingArrSort(boughtListByCategory, 'pcnt'))
    setCashPie(descendingArrSort(boughtListByStockCash, 'sum'))

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
          header={'Category'}
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
