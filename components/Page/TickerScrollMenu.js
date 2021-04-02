
import { Fragment, useEffect, useState } from 'react'
import TickerCard from '../../components/Parts/TickerCard'
import { extractYahooInfo } from '../../config/highlight'
import { roundTo } from '../../lib/commonFunction'
import ScrollMenu from 'react-horizontal-scrolling-menu'
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'
import '../../styles/ScrollMenu.module.css'

const axios = require('axios').default

export default function TickerScrollMenu({ inputList, setSelectedTicker }) {
  const [stockInfo, setStockInfo] = useState([])

  async function getStockInfo(inputList) {

    const quoteResponses = await axios(`/api/yahoo/getYahooQuote?ticker=${[...inputList].map(item => item.Ticker)}`)
    const { data: responses } = quoteResponses

    const stockInfoAdd = [...inputList].map((stock) => {
      const data = responses.find(x => x && x.symbol === stock.Ticker)

      const info = extractYahooInfo.reduce((acc, cur) => {
        const newAcc = {
          ...acc,
          [cur.label]: typeof data[cur.field] === 'number' ? roundTo(data[cur.field], 2) : data[cur.field]
        }

        return newAcc
      }, {})

      return { ...stock, ...info }
    })

    setStockInfo(stockInfoAdd)
  }

  const onSelect = (key) => {
    setSelectedTicker({
      ticker: inputList[key].Ticker,
      show: true
    })
  }

  useEffect(async () => {
    await getStockInfo(inputList)
  }, [])

  return (
    <Fragment>
      <ScrollMenu
        data={stockInfo.map((item, idx) => {
          return <div key={idx} className="menu-item"><TickerCard {...item} /></div>
        })}
        arrowLeft={<AiFillLeftCircle />}
        arrowRight={<AiFillRightCircle />}
        menuClass="justify-content-center"
        onSelect={onSelect}
        wheel={false}
      />
    </Fragment >
  )
}
