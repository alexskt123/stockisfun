
import { Fragment, useEffect, useState } from 'react'
import TickerCard from '../../components/Parts/TickerCard'
import { extractYahooInfo } from '../../config/highlight'
import roundTo from 'round-to'
import ScrollMenu from 'react-horizontal-scrolling-menu'
import { AiFillLeftCircle, AiFillRightCircle } from 'react-icons/ai'
import '../../styles/ScrollMenu.module.css'

const axios = require('axios').default

export default function TickerScrollMenu({ inputList, setSelectedTicker }) {
  const [stockInfo, setStockInfo] = useState([])

  async function getStockInfo(inputList) {
    const stockInfoAdd = [...inputList]

    await axios.all([...inputList].map(item => {
      return axios(`/api/yahoo/getYahooQuote?ticker=${item.Ticker}`)
    }))
      .catch(error => { console.log(error) })
      .then(responses => {
        responses.forEach((response) => {
          const { data } = response
          extractYahooInfo.forEach(info => {
            const curData = stockInfoAdd.find(x => x.Ticker === data.symbol)
            if (curData)
              curData[info.label] = typeof data[info.field] === 'number' ? roundTo(data[info.field], 2) : data[info.field]
          })
        })
      })

    setStockInfo(stockInfoAdd)
  }

  const onSelect = (key) => {
    setSelectedTicker(inputList[key].Ticker)
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
