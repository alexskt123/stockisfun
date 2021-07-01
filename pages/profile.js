import { Fragment, useEffect, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import GooeySpinner from '@/components/Loading/GooeySpinner'
import SWRTable from '@/components/Page/SWRTable'
import ProfilePieChart from '@/components/Parts/ProfilePieChart'
import TrendBarChart from '@/components/Parts/TrendBarChart'
import {
  pieOptions,
  keyInfoTableHeaderList,
  keyForecastInfoHeader
} from '@/config/profile'
import { staticSWROptions, fetcher } from '@/config/settings'
import { useUser } from '@/lib/firebaseResult'
import Badge from 'react-bootstrap/Badge'
import CardDeck from 'react-bootstrap/CardDeck'
import useSWR from 'swr'

const Profile = () => {
  const user = useUser()
  const { data: boughtListData } = useSWR(
    `/api/user/getUserBoughtListDetails?uid=${user?.uid}`,
    fetcher,
    staticSWROptions
  )

  const [stockPie, setStockPie] = useState(null)
  const [catPie, setCatPie] = useState(null)
  const [cashPie, setCashPie] = useState(null)
  const [stockList, setStockList] = useState([])

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

    setStockPie(boughtList)
    setCatPie(boughtListByCategory)
    setCashPie(boughtListByStockCash)
    setStockList(
      boughtList.filter(item => item.type === 'EQUITY').map(item => item.ticker)
    )

    return () => {
      setStockPie(null)
      setCatPie(null)
      setCashPie(null)
      setStockList([])
    }
  }, [boughtListData])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <h5>
            <Badge variant="dark">{'Account Summary'}</Badge>
          </h5>
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
          <h5>
            <Badge variant="dark" className={'mt-4'}>
              {'Stock Revenue/Net Income Highlight'}
            </Badge>
          </h5>
          {stockList?.length > 0 ? (
            <SWRTable
              requests={stockList.map(x => ({
                request: `/api/getIndexQuote?ticker=${x}`,
                key: x
              }))}
              options={{
                tableHeader: keyInfoTableHeaderList,
                tableSize: 'sm',
                SWROptions: staticSWROptions
              }}
            />
          ) : (
            <GooeySpinner />
          )}
          <h5>
            <Badge variant="dark" className={'mt-4'}>
              {'Stock Forecast'}
            </Badge>
          </h5>
          {stockList?.length > 0 ? (
            <SWRTable
              requests={stockList.map(x => ({
                request: `/api/forecast/getKeyInfo?ticker=${x}`,
                key: x
              }))}
              options={{
                tableHeader: keyForecastInfoHeader,
                tableSize: 'sm',
                SWROptions: staticSWROptions
              }}
            />
          ) : (
            <GooeySpinner />
          )}

          <h5>
            <Badge variant="dark" className={'mt-4'}>
              {'Performance'}
            </Badge>
          </h5>
          {stockPie ? (
            <TrendBarChart
              input={stockPie.map(item => ({
                label: item.ticker,
                ticker: item.ticker
              }))}
            />
          ) : (
            <GooeySpinner />
          )}
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}

export default Profile
