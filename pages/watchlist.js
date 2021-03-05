
import { Fragment, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import Button from 'react-bootstrap/Button'
import moment from 'moment-business-days'
import millify from 'millify'

import CustomContainer from '../components/Layout/CustomContainer'
import StockInfoTable from '../components/Page/StockInfoTable'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import { tableHeaderList } from '../config/watchlist'
import { sortTableItem, handleDebounceChange } from '../lib/commonFunction'
import { updUserWatchList, getUserInfoByUID } from '../lib/firebaseResult'
import { Store } from '../lib/store'
import { fireToast } from '../lib/toast'

const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [watchList, setWatchList] = useState([])

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)

  const store = useContext(Store)
  const { state, dispatch } = store
  const { user } = state

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

    router.replace('/watchlist')
  }

  const refreshItems = async () => {
    handleTickers(tickers.join(','))
  }

  const handleDispatch = async () => {
    const { watchList } = await getUserInfoByUID(user == null ? '' : user.uid)

    const newUserConfig = {
      ...user,
      watchList
    }

    dispatch({ type: 'USER', payload: newUserConfig })
  }

  const updateWatchList = async () => {
    await updUserWatchList(user.uid, watchList.map(item => item.find(x => x)))
    await handleDispatch()

    fireToast({
      icon: 'success',
      title: 'Updated'
    })
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setWatchList(
      [...watchList.filter(x => x.find(x => x) !== value)]
    )
  }

  async function handleTickers(inputTickersWithComma) {

    setClicked(true)

    const newTickers = inputTickersWithComma.split(',').map(item => item.toUpperCase())
    const temp = []

    await axios.all([...newTickers].map(ticker => {
      return axios(`/api/yahoo/getYahooQuote?ticker=${ticker}`)
    }))
      .catch(error => { console.log(error) })
      .then(responses => {
        if (responses) {

          responses.forEach((response) => {
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

    const newTemp = temp.every(itemArr => itemArr.filter(x => x != undefined).length == 6) ? temp :
      temp.filter(x => x.find(x => x) && x.find(x => x).label == 'Ticker').map(itemArr => {
        return itemArr.map((item, idx) => {
          return item == undefined ? { label: tableHeaderList[idx].label, item: 'N/A' } : item
        })
      })

    setTableHeader(
      [...newTemp.find(x => x).filter(x => x).map(item => item.label)]
    )

    setTickers([...newTickers])

    setWatchList(
      [...newTemp.map(item => {
        return item.filter(x => x).map(jj => jj.item)
      })]
    )

    router.replace('/watchlist', `/watchlist?query=${inputTickersWithComma.toUpperCase()}`)

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
            <LoadingSpinner /> : null
          }
          <Button onClick={() => { refreshItems() }} size='sm' variant='outline-dark' >{'Refresh'}</Button>
          {
            user.id != ''
              ? <Button className="ml-2" onClick={() => { updateWatchList() }} size='sm' variant='dark' >{'Update Watch List'}</Button>
              : null
          }
          <StockInfoTable striped={true} tableHeader={tableHeader} tableData={watchList} sortItem={sortItem} tableSize="sm" />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
