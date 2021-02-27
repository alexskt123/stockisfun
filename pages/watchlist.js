
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import CustomContainer from '../components/Layout/CustomContainer'

import StockInfoTable from '../components/Page/StockInfoTable'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import { sortTableItem, handleDebounceChange } from '../lib/commonFunction'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import moment from 'moment-business-days'
import { tableHeaderList } from '../config/watchlist'
import millify from 'millify'
import { Button } from 'react-bootstrap'

const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [watchList, setWatchList] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)


  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }


  const sortItem = async (index) => {
    setAscSort(!ascSort)
    setWatchList(
      await sortTableItem(watchList, index, ascSort)
    )
  }

  const clearItems = async () => {
    setTickers([])
    setWatchList([])
  }

  const refreshItems = async () => {
    handleTickers(tickers.join(','))
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setWatchList(
      [
        ...watchList.filter(x => x.find(x => x) !== value)
      ]
    )
  }

  async function handleTickers(inputTickersWithComma) {

    setClicked(true)

    const newTickers = inputTickersWithComma.split(',').map(item => item.toUpperCase())
    const temp = []

    await axios.all([...newTickers].map(ticker => {
      return axios(`/api/getYahooQuote?ticker=${ticker}`)
    }))
      .catch(error => { console.log(error) })
      .then(responses => {
        if (responses) {

          responses.forEach((response, index) => {
            if (response && response.data) {
              temp.push(tableHeaderList.map(header => {
                if (response.data[header.item])
                  return {
                    'label': header.label,
                    'item': header.format && header.format == '%' ? { style: 'green-red', data: `${response.data[header.item]?.toFixed(2)}%` }
                      : header.format && header.format == 'H:mm:ss' ? moment(response.data[header.item] * 1000).format('H:mm:ss')
                        : header.format && header.format == 'millify' ? millify(response.data[header.item] || 0)
                          : response.data[header.item]
                  }
              })
              )
            }
          })
        }
      })

    setTableHeader(
      [
        ...temp.find(x => x).filter(x => x).map(item => item.label)
      ]
    )

    setTickers([
      ...newTickers
    ])

    setWatchList(
      [
        ...temp.map(item => {
          return item.filter(x => x).map(jj => jj.item)
        })
      ]
    )

    setClicked(false)

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget


    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue
      await handleTickers(formTicker)

    }
    setValidated(true)
  }

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      handleTickers(query)
    }

  }, [query])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  voo /  Mulitple:  voo,arkk,smh'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={tableHeader}
            tableData={watchList}
            exportFileName={'Stock_watch_list.csv'}
          />
          <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <Button onClick={() => { refreshItems() }} size='sm' variant='outline-dark' >{'Refresh'}</Button>
          <StockInfoTable tableHeader={tableHeader} tableData={watchList} sortItem={sortItem} tableSize="sm" />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
